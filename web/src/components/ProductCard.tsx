import type { Flavor } from '../types/flavor'

export function ProductCard({flavor,onAdd}:{flavor:Flavor;onAdd:(flavor:Flavor)=>void}){
  return <article className={`product-card ${flavor.family}`}><div className="product-art">{flavor.new&&<span className="new-tag">Novo</span>}<span className="product-emoji">{flavor.emoji}</span><div className="dots"><i/><i/></div></div><div className="product-info"><span className="product-badge">{flavor.badge}</span><h3>{flavor.name}</h3><small>{flavor.subtitle}</small><p>{flavor.description}</p><div className="product-footer"><strong>R${flavor.price}</strong><button onClick={()=>onAdd(flavor)}>Adicionar</button></div></div></article>
}
