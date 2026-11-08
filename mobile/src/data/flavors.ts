import type { Flavor } from '../types'

export const fallbackFlavors: Flavor[] = [
  { name: 'Pistache & Mel', subtitle: 'Artesanal · bola dupla', description: 'Pistache tostado, mel orgânico do Vale do Ribeira. Suave e irresistível.', price: 22, emoji: '🍦', family: 'green', badge: 'Mais pedido', category: 'Especiais' },
  { name: 'Baunilha Bourbon', subtitle: 'Artesanal · fava inteira', description: 'Leite integral, creme fresco e fava de baunilha Bourbon.', price: 19, emoji: '🍨', family: 'gold', badge: 'Clássico', category: 'Clássicos' },
  { name: 'Stracciatella', subtitle: 'Creme · lascas de chocolate', description: 'Creme puro com lascas finas de chocolate amargo 70%.', price: 21, emoji: '🍧', family: 'lilac', badge: 'Favorito', category: 'Clássicos' },
  { name: 'Maracujá do Litoral', subtitle: 'Frutas frescas · sorbet', description: 'Maracujá da temporada, refrescante como a brisa do mar.', price: 20, emoji: '🥭', family: 'gold', badge: 'Temporada', category: 'Tropicais', new: true },
  { name: 'Açaí & Guaraná', subtitle: 'Amazônia · sorbet cremoso', description: 'Açaí puro de Belém com toque de guaraná natural.', price: 24, emoji: '🫐', family: 'lilac', badge: 'Regional', category: 'Tropicais' },
  { name: 'Manga Alphonso', subtitle: 'Manga importada · sorbet', description: 'Doçura intensa, textura sedosa e cor solar.', price: 22, emoji: '🥭', family: 'gold', badge: 'Premium', category: 'Tropicais' },
  { name: 'Lavanda & Limão Siciliano', subtitle: 'Floral · creme suave', description: 'Lavanda infusionada no creme com raspas de limão siciliano.', price: 26, emoji: '💜', family: 'lilac', badge: 'Edição Limitada', category: 'Especiais', new: true },
  { name: 'Matcha Cerimônia', subtitle: 'Chá verde · creme japonês', description: 'Matcha grau A levemente adoçado com xarope de cana.', price: 25, emoji: '🍵', family: 'green', badge: 'Artesanal', category: 'Especiais' },
  { name: 'Caramelo Flor de Sal', subtitle: 'Caramelo artesanal · flor de sal', description: 'Caramelo de panela com manteiga e flor de sal.', price: 24, emoji: '🧂', family: 'gold', badge: "Chef's Pick", category: 'Especiais' },
  { name: 'Coco & Limão Kaffir', subtitle: 'Leite de coco · vegano', description: 'Leite de coco artesanal com folhas de limão kaffir.', price: 22, emoji: '🥥', family: 'green', badge: 'Vegano', category: 'Veganos' },
  { name: 'Framboesa Selvagem', subtitle: 'Sorbet · sem lactose', description: 'Framboesas locais em um sorbet puro e refrescante.', price: 20, emoji: '🍓', family: 'lilac', badge: 'Vegano', category: 'Veganos', new: true },
  { name: 'Banana Caramelada', subtitle: 'Banana · amêndoas · vegano', description: 'Banana caramelada com amêndoas e canela do Ceilão.', price: 21, emoji: '🍌', family: 'gold', badge: 'Vegano', category: 'Veganos' },
]
