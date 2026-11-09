import { useState } from 'react'
import type { Flavor } from '../types/flavor'

export function ProductCard({ flavor, onAdd }: { flavor: Flavor; onAdd: (flavor: Flavor, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const add = () => { onAdd(flavor, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 550) }
  return <article className={`product-card ${flavor.family} ${added ? 'product-added' : ''}`}><div className="product-art">{flavor.new && <span className="new-tag">Novo</span>}<span className="product-emoji">{flavor.emoji}</span><div className="dots"><i /><i /></div></div><div className="product-info"><span className="product-badge">{flavor.badge}</span><h3>{flavor.name}</h3><small>{flavor.subtitle}</small><p>{flavor.description}</p><div className="product-footer"><strong>R${flavor.price}</strong><div className="add-controls"><div className="quantity-stepper" aria-label={`Quantidade de ${flavor.name}`}><button type="button" aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity((value) => Math.min(20, value + 1))}>+</button></div><button type="button" className="add-button" onClick={add}>{added ? 'Adicionado ✓' : 'Adicionar'}</button></div></div></div></article>
}
