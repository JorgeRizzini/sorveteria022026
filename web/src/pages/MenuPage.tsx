import { useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import type { Category, Flavor } from '../types/flavor'

type Filter = 'Todos os Sabores' | Category

export function MenuPage({ products, onAdd }: { products: Flavor[]; onAdd: (flavor: Flavor) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Filter>('Todos os Sabores')
  const categories: Filter[] = ['Todos os Sabores', 'Clássicos', 'Tropicais', 'Especiais', 'Veganos']
  const visible = products.filter((flavor) => (category === 'Todos os Sabores' || flavor.category === category) && flavor.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
  return <main className="menu-page"><section className="menu-hero"><div className="container"><span className="eyebrow menu-label">{products.length} sabores artesanais</span><h1>Nosso Cardápio</h1><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar sabores..." aria-label="Buscar sabores" /></label></div></section><section className="menu-list"><div className="container"><div className="menu-toolbar"><div className="filter-list">{categories.map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><span>{visible.length} {visible.length === 1 ? 'sabor' : 'sabores'}</span></div>{visible.length ? <div className="menu-grid">{visible.map((flavor) => <ProductCard key={flavor.id ?? flavor.name} flavor={flavor} onAdd={onAdd} />)}</div> : <div className="no-results"><span>🍨</span><h2>Nenhum sabor encontrado</h2><p>Tente buscar outro nome ou escolher uma categoria diferente.</p></div>}</div></section></main>
}
