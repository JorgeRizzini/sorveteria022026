-- ArcadeCream: catálogo, perfis e pedidos.
-- Senhas pertencem exclusivamente ao schema auth gerenciado pelo Supabase Auth.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text not null,
  description text not null,
  price_cents integer not null check (price_cents > 0),
  emoji text not null,
  family text not null check (family in ('gold', 'green', 'lilac')),
  badge text not null,
  category text not null check (category in ('Clássicos', 'Tropicais', 'Especiais', 'Veganos')),
  is_new boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
  ),
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete restrict,
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents > 0),
  quantity integer not null check (quantity between 1 and 20),
  created_at timestamptz not null default now()
);

create index orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index products_active_category_idx on public.products(active, category);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public products are readable"
on public.products for select
to anon, authenticated
using (active = true);

create policy "Users read own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users read own orders"
on public.orders for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

grant select on public.products to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.orders, public.order_items to authenticated;

create or replace function public.create_order_for_user(p_user_id uuid, p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid;
  v_total integer;
  v_requested integer;
  v_found integer;
begin
  if p_user_id is null or not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'Usuário inválido';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'O pedido precisa conter itens';
  end if;

  with requested as (
    select
      (item ->> 'product_id')::uuid as product_id,
      (item ->> 'quantity')::integer as quantity
    from jsonb_array_elements(p_items) as item
  ), valid as (
    select r.product_id, r.quantity, p.price_cents
    from requested r
    join public.products p on p.id = r.product_id and p.active = true
    where r.quantity between 1 and 20
  )
  select
    (select count(*) from requested),
    count(*),
    coalesce(sum(price_cents * quantity), 0)
  into v_requested, v_found, v_total
  from valid;

  if v_requested <> v_found then
    raise exception 'O pedido contém produto ou quantidade inválida';
  end if;

  insert into public.orders (user_id, total_cents)
  values (p_user_id, v_total)
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, product_name, unit_price_cents, quantity
  )
  select
    v_order_id,
    p.id,
    p.name,
    p.price_cents,
    (item ->> 'quantity')::integer
  from jsonb_array_elements(p_items) as item
  join public.products p
    on p.id = (item ->> 'product_id')::uuid
   and p.active = true;

  return v_order_id;
end;
$$;

revoke all on function public.create_order_for_user(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.create_order_for_user(uuid, jsonb) to service_role;

insert into public.products
  (slug, name, subtitle, description, price_cents, emoji, family, badge, category, is_new)
values
  ('pistache-mel', 'Pistache & Mel', 'Artesanal · bola dupla', 'Pistache tostado de verdade, com fio de mel orgânico do Vale do Ribeira. Suave, nobre e irresistível.', 2200, '🍦', 'green', 'Mais pedido', 'Especiais', false),
  ('baunilha-bourbon', 'Baunilha Bourbon', 'Artesanal · fava inteira', 'Leite integral da fazenda, creme fresco e fava de baunilha Bourbon. O clássico feito direito.', 1900, '🍨', 'gold', 'Clássico', 'Clássicos', false),
  ('stracciatella', 'Stracciatella', 'Creme · lascas de chocolate', 'Base de creme puro de leite com lascas finas de chocolate amargo 70%. Elegância italiana em cada colher.', 2100, '🍧', 'lilac', 'Favorito', 'Clássicos', false),
  ('maracuja-litoral', 'Maracujá do Litoral', 'Frutas frescas · sorbet', 'Maracujá colhido na temporada, levemente açucarado. Refrescante como a brisa do mar.', 2000, '🥭', 'gold', 'Temporada', 'Tropicais', true),
  ('acai-guarana', 'Açaí & Guaraná', 'Amazônia · sorbet cremoso', 'Açaí puro de Belém do Pará com toque de guaraná natural. Energia tropical em versão gelada.', 2400, '🫐', 'lilac', 'Regional', 'Tropicais', false),
  ('manga-alphonso', 'Manga Alphonso', 'Manga importada · sorbet', 'A rainha das mangas em versão sorbet. Doçura intensa e textura sedosa.', 2200, '🥭', 'gold', 'Premium', 'Tropicais', false),
  ('lavanda-limao', 'Lavanda & Limão Siciliano', 'Floral · creme suave', 'Flores de lavanda infusionadas no creme, com raspas de limão siciliano.', 2600, '💜', 'lilac', 'Edição Limitada', 'Especiais', true),
  ('matcha-cerimonia', 'Matcha Cerimônia', 'Chá verde · creme japonês', 'Matcha cerimônia grau A, levemente adoçado com xarope de cana.', 2500, '🍵', 'green', 'Artesanal', 'Especiais', false),
  ('caramelo-flor-sal', 'Caramelo Flor de Sal', 'Caramelo artesanal · flor de sal', 'Caramelo feito na panela, com manteiga normanda e flor de sal de Mossoró.', 2400, '🧂', 'gold', 'Chef''s Pick', 'Especiais', false),
  ('coco-limao-kaffir', 'Coco & Limão Kaffir', 'Leite de coco · 100% vegano', 'Leite de coco artesanal com folhas de limão kaffir infusionadas.', 2200, '🥥', 'green', 'Vegano', 'Veganos', false),
  ('framboesa-selvagem', 'Framboesa Selvagem', 'Sorbet · sem lactose', 'Framboesas de produção local, sorbet puro sem nenhum laticínio.', 2000, '🍓', 'lilac', 'Vegano', 'Veganos', true),
  ('banana-caramelada', 'Banana Caramelada', 'Banana · amêndoas · vegano', 'Banana nanica caramelada com amêndoas laminadas e canela do Ceilão.', 2100, '🍌', 'gold', 'Vegano', 'Veganos', false)
on conflict (slug) do update set
  name = excluded.name,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price_cents = excluded.price_cents,
  emoji = excluded.emoji,
  family = excluded.family,
  badge = excluded.badge,
  category = excluded.category,
  is_new = excluded.is_new,
  active = true,
  updated_at = now();
