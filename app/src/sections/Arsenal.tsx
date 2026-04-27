import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trpc } from "@/providers/trpc";
import { Package, Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const fallbackProducts = [
  { id: 1, name: "Rogue Hex Dumbbells", description: "Premium hex dumbbells 2.5-50kg", price: 2500, category: "equipment" as const, imageUrl: "/images/24947.jpg", stock: 50, featured: true },
  { id: 2, name: "Heavy-Duty Bench Press", description: "Adjustable bench with spotter arms", price: 35000, category: "equipment" as const, imageUrl: "/images/24948.jpg", stock: 15, featured: true },
  { id: 3, name: "Gold Standard Whey", description: "24g protein, 5.5g BCAAs per serving", price: 8500, category: "supplements" as const, imageUrl: "/images/24949.jpg", stock: 200, featured: true },
  { id: 4, name: "Kevin Levrone Gold Creatine", description: "Enhanced strength & power", price: 4200, category: "supplements" as const, imageUrl: "/images/24950.jpg", stock: 150, featured: false },
  { id: 5, name: "EVA Gym Floor Mats", description: "1m x 1m x 15mm interlocking tiles", price: 1200, category: "gear" as const, imageUrl: "/images/24951.jpg", stock: 500, featured: false },
  { id: 6, name: "Freemotion Treadmill", description: "Commercial grade with iFit", price: 185000, category: "equipment" as const, imageUrl: "/images/24952.jpg", stock: 8, featured: true },
  { id: 7, name: "Elliptical Bike", description: "Magnetic resistance, heart rate monitor", price: 42000, category: "equipment" as const, imageUrl: "/images/24953.jpg", stock: 12, featured: false },
];

function ProductCard({ product, index }: { product: typeof fallbackProducts[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const categoryColors: Record<string, string> = {
    supplements: "text-energy",
    equipment: "text-cyber",
    gear: "text-platinum",
    accessories: "text-white",
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-gunmetal/40 border border-white/5 overflow-hidden hover:border-cyber/20 transition-all duration-500"
      data-hoverable
    >
      <div className="relative aspect-square overflow-hidden bg-void">
        <img
          src={product.imageUrl || "/images/24947.jpg"}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
        />
        {product.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-cyber/20 border border-cyber/30">
            <span className="text-[9px] font-mono text-cyber tracking-wider">FEATURED</span>
          </div>
        )}
      </div>

      <div className="p-4 relative">
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber group-hover:w-full transition-all duration-500" />
        
        <span className={`text-[9px] font-mono tracking-wider uppercase ${categoryColors[product.category] || "text-platinum"}`}>
          {product.category}
        </span>
        <h3 className="text-sm font-heading font-semibold text-white mt-1 mb-1">{product.name}</h3>
        <p className="text-[11px] text-platinum/60 leading-relaxed mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-mono font-semibold text-white">
            PKR {product.price.toLocaleString()}
          </span>
          <span className="text-[9px] font-mono text-platinum/50">
            STOCK: {product.stock}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Arsenal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: apiProducts, isLoading } = trpc.product.list.useQuery();
  
  const products = apiProducts && apiProducts.length > 0 ? apiProducts : fallbackProducts;

  return (
    <section
      ref={sectionRef}
      id="arsenal"
      className="relative min-h-screen w-full py-32 bg-void"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <span className="text-cyber text-[10px] font-mono tracking-[0.3em] uppercase mb-4 block">
            // ARSENAL_03
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
            THE <span className="text-gradient-cyber">ARSENAL</span>
          </h2>
          <p className="text-platinum text-sm max-w-lg mx-auto leading-relaxed">
            Premium equipment and supplements engineered for those who refuse mediocrity.
            Every item in our catalog is battle-tested and protocol-approved.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyber animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product as any} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-gunmetal/50 border border-white/5">
            <Package className="w-4 h-4 text-cyber" />
            <span className="text-xs font-mono text-platinum">
              {products.length} ITEMS IN CATALOG
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
