import type { Flavor } from '../types/flavor'

export const fallbackFlavors: Flavor[] = [
  { name:'Pistache & Mel', subtitle:'Artesanal · bola dupla', description:'Pistache tostado de verdade, com fio de mel orgânico do Vale do Ribeira. Suave, nobre e irresistível.', price:22, emoji:'🍦', family:'green', badge:'Mais pedido', category:'Especiais' },
  { name:'Baunilha Bourbon', subtitle:'Artesanal · fava inteira', description:'Leite integral da fazenda, creme fresco e fava de baunilha Bourbon. O clássico feito direito.', price:19, emoji:'🍨', family:'gold', badge:'Clássico', category:'Clássicos' },
  { name:'Stracciatella', subtitle:'Creme · lascas de chocolate', description:'Base de creme puro de leite com lascas finas de chocolate amargo 70%. Elegância italiana em cada colher.', price:21, emoji:'🍧', family:'lilac', badge:'Favorito', category:'Clássicos' },
  { name:'Maracujá do Litoral', subtitle:'Frutas frescas · sorbet', description:'Maracujá colhido na temporada, levemente açucarado. Acidez na medida certa, refrescante como a brisa do mar.', price:20, emoji:'🥭', family:'gold', badge:'Temporada', category:'Tropicais', new:true },
  { name:'Açaí & Guaraná', subtitle:'Amazônia · sorbet cremoso', description:'Açaí puro de Belém do Pará com toque de guaraná natural. Energia tropical em versão gelada.', price:24, emoji:'🫐', family:'lilac', badge:'Regional', category:'Tropicais' },
  { name:'Manga Alphonso', subtitle:'Manga importada · sorbet', description:'A rainha das mangas em versão sorbet. Doçura intensa, textura sedosa e cor solar inconfundível.', price:22, emoji:'🥭', family:'gold', badge:'Premium', category:'Tropicais' },
  { name:'Lavanda & Limão Siciliano', subtitle:'Floral · creme suave', description:'Flores de lavanda da Mantiqueira infusionadas no creme, com raspas de limão siciliano. Delicado e surpreendente.', price:26, emoji:'💜', family:'lilac', badge:'Edição Limitada', category:'Especiais', new:true },
  { name:'Matcha Cerimônia', subtitle:'Chá verde · creme japonês', description:'Matcha cerimônia grau A, levemente adoçado com xarope de cana. Umami gelado, meditativo.', price:25, emoji:'🍵', family:'green', badge:'Artesanal', category:'Especiais' },
  { name:'Caramelo Flor de Sal', subtitle:'Caramelo artesanal · flor de sal', description:'Caramelo feito na panela, com manteiga normanda e flor de sal de Mossoró. O contraste que vicia.', price:24, emoji:'🧂', family:'gold', badge:"Chef's Pick", category:'Especiais' },
  { name:'Coco & Limão Kaffir', subtitle:'Leite de coco · 100% vegano', description:'Leite de coco artesanal com folhas de limão kaffir infusionadas. Tropical, leve e 100% plant-based.', price:22, emoji:'🥥', family:'green', badge:'Vegano', category:'Veganos' },
  { name:'Framboesa Selvagem', subtitle:'Sorbet · sem lactose', description:'Framboesas de produção local, sorbet puro sem nenhum laticínio. Vibrantemente vermelho e refrescante.', price:20, emoji:'🍓', family:'lilac', badge:'Vegano', category:'Veganos', new:true },
  { name:'Banana Caramelada', subtitle:'Banana · amêndoas · vegano', description:'Banana nanica caramelada com amêndoas laminadas e canela do Ceilão. Conforto gelado, sem lactose.', price:21, emoji:'🍌', family:'gold', badge:'Vegano', category:'Veganos' },
]

export const heroFlavors = [
  ['🍦','Pistache & Mel','Verde suave, nobre','green'], ['💜','Lavanda & Limão','Floral, delicado','lilac'],
  ['🥭','Maracujá do Litoral','Tropical, vibrante','gold'], ['🍵','Matcha Cerimônia','Japonês, meditativo','green'],
  ['🧂','Caramelo Flor de Sal','Intenso, marcante','gold'], ['🍧','Stracciatella','Elegância italiana','lilac'],
] as const

export const featuredFlavorNames = [
  'Pistache & Mel', 'Baunilha Bourbon', 'Maracujá do Litoral',
  'Lavanda & Limão Siciliano', 'Matcha Cerimônia',
]
