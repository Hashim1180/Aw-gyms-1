import { useState } from 'react';
import { trpc } from '@/providers/trpc';
import { ShoppingCart, Eye, Plus, Minus, X } from 'lucide-react';
import { useAppStore } from '../hooks/useStore';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export default function Products() {
  const { data: products, isLoading } = trpc.product.list.useQuery();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<number | null>(null);
  const setChatOpen = useAppStore((s) => s.setChatOpen);

  const categories = ['all', 'equipment', 'supplements', 'cardio'];

  const filtered = selectedCategory === 'all'
    ? products
    : products?.filter((p: { category: string }) => p.category === selectedCategory);

  const addToCart = (product: NonNullable<typeof products>[number]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  const handleCheckout = () => {
    const message = `Hello AW Gyms! I'd like to order:\n${cart.map((item) => `- ${item.name} x${item.quantity} (PKR ${parseFloat(item.price) * item.quantity})`).join('\n')}\n\nTotal: PKR ${cartTotal.toLocaleString()}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923497814918?text=${encoded}`, '_blank');
  };

  return (
    <section id="products" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-up text-gold text-sm tracking-[0.4em] uppercase mb-4">
            Curated Selection
          </p>
          <h2 className="fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Premium <span className="text-gradient-gold">Equipment</span>
          </h2>
          <p className="fade-up text-white/50 max-w-xl mx-auto">
            Every piece in our collection is selected for uncompromising quality,
            performance, and aesthetic excellence.
          </p>
        </div>

        {/* Category Filter */}
        <div className="fade-up flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 text-sm tracking-wider uppercase transition-all duration-300 rounded-sm ${
                selectedCategory === cat
                  ? 'bg-gold text-black'
                  : 'border border-white/10 text-white/60 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cart Button */}
        <div className="fade-up flex justify-end mb-8">
          <button
            onClick={() => setCartOpen(true)}
            className="relative px-5 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-sm flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">Cart ({cart.length})</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-black text-xs rounded-full flex items-center justify-center font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 animate-pulse h-96 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered?.map((product: NonNullable<typeof products>[number], i: number) => (
              <div
                key={product.id}
                className="fade-up group relative bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all duration-500 rounded-sm overflow-hidden"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setQuickView(product.id)}
                      className="p-3 bg-white/10 backdrop-blur text-white hover:bg-gold hover:text-black transition-all rounded-sm"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-3 bg-white/10 backdrop-blur text-white hover:bg-gold hover:text-black transition-all rounded-sm"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                  {product.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-black text-xs font-bold tracking-wider uppercase">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-gold/60 text-xs tracking-wider uppercase mb-2">{product.category}</p>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-white/40 text-sm line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gold text-xl font-bold">PKR {parseFloat(product.price).toLocaleString()}</p>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="text-xs text-white/40 hover:text-gold transition-colors tracking-wider uppercase"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111] border-l border-white/10 h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white text-xl font-serif">Your Cart</h3>
              <button onClick={() => setCartOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-white/40 text-center py-12">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-sm">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm" />
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium">{item.name}</h4>
                        <p className="text-gold text-sm">PKR {parseFloat(item.price).toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-white/60 hover:text-gold">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-white/60 hover:text-gold">
                            <Plus className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-white/40 hover:text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between text-white mb-6">
                    <span className="text-white/60">Total</span>
                    <span className="text-xl font-bold text-gold">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gold text-black font-semibold tracking-wider uppercase text-sm hover:bg-white transition-colors rounded-sm"
                  >
                    Order via WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setQuickView(null)} />
          <div className="relative bg-[#111] border border-white/10 max-w-2xl w-full rounded-sm overflow-hidden">
            {(() => {
              const product = products?.find((p: { id: number }) => p.id === quickView);
              if (!product) return null;
              return (
                <div className="grid md:grid-cols-2">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="p-8">
                    <button
                      onClick={() => setQuickView(null)}
                      className="absolute top-4 right-4 text-white/60 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <p className="text-gold text-xs tracking-wider uppercase mb-2">{product.category}</p>
                    <h3 className="text-white text-2xl font-serif font-bold mb-4">{product.name}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">{product.description}</p>
                    <p className="text-gold text-3xl font-bold mb-6">PKR {parseFloat(product.price).toLocaleString()}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { addToCart(product); setQuickView(null); }}
                        className="flex-1 py-3 bg-gold text-black font-semibold tracking-wider uppercase text-sm hover:bg-white transition-colors rounded-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => { setQuickView(null); setChatOpen(true); }}
                        className="px-4 py-3 border border-white/20 text-white hover:border-gold hover:text-gold transition-all rounded-sm"
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
