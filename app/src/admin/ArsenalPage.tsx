import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Trash2,
  Save,
  X,
  ImagePlus,
  Loader2,
  Search,
} from "lucide-react";

export default function ArsenalPage() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.product.list.useQuery();
  
  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      setShowForm(false);
      setFormData({ name: "", description: "", price: 0, category: "equipment", imageUrl: "", stock: 0, featured: false });
    },
  });
  
  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "equipment" as const,
    imageUrl: "",
    stock: 0,
    featured: false,
  });

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const categoryColors: Record<string, string> = {
    supplements: "text-energy border-energy/30 bg-energy/10",
    equipment: "text-cyber border-cyber/30 bg-cyber/10",
    gear: "text-platinum border-white/10 bg-white/5",
    accessories: "text-white border-white/20 bg-white/10",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">ARSENAL CMS</h1>
          <p className="text-sm text-platinum">Manage products, inventory, and catalog items</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyber/20 border border-cyber/30 text-cyber text-xs font-mono hover:bg-cyber/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          FORGE ITEM
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-gunmetal/30 border border-white/5 p-6 overflow-hidden"
          >
            <h3 className="text-xs font-mono text-white tracking-wider mb-4">NEW PRODUCT PROTOCOL</h3>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">NAME *</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">CATEGORY *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                >
                  <option value="supplements">Supplements</option>
                  <option value="equipment">Equipment</option>
                  <option value="gear">Gear</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">PRICE (PKR) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">STOCK</label>
                <input
                  type="number"
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono text-platinum block mb-1.5">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono text-platinum block mb-1.5">IMAGE URL</label>
                <div className="flex gap-2">
                  <input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/images/24947.jpg"
                    className="flex-1 bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                  />
                  <div className="px-3 py-2 bg-gunmetal border border-white/10 text-platinum flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <span className="text-[10px] font-mono">Use /images/ folder</span>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-cyber"
                />
                <label htmlFor="featured" className="text-xs text-platinum">FEATURED PRODUCT</label>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-cyber/20 border border-cyber/30 text-cyber text-xs font-mono hover:bg-cyber/30 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  FORGE ITEM
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 px-6 py-2 bg-gunmetal border border-white/10 text-platinum text-xs font-mono hover:bg-white/5 transition-colors"
                >
                  <X className="w-3 h-3" />
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-platinum/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search arsenal..."
            className="w-full sm:w-80 bg-gunmetal/30 text-white text-sm pl-10 pr-4 py-2.5 border border-white/5 focus:border-cyber/30 focus:outline-none font-mono"
          />
        </div>
      </div>

      <div className="bg-gunmetal/20 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">ITEM</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">CATEGORY</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">PRICE</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">STOCK</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">STATUS</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Loader2 className="w-6 h-6 text-cyber animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-platinum/50 text-sm font-mono">
                    ARSENAL EMPTY — FORGE NEW ITEMS
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredProducts?.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, backgroundColor: "rgba(57, 255, 20, 0.1)" }}
                      animate={{ opacity: 1, backgroundColor: "transparent" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono text-platinum">#{product.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} className="w-8 h-8 object-contain bg-void rounded" />
                          )}
                          <div>
                            <div className="text-sm text-white">{product.name}</div>
                            <div className="text-[10px] text-platinum/50 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-mono border rounded-sm ${categoryColors[product.category] || "text-platinum border-white/10"}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-white">PKR {product.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-mono text-platinum">{product.stock}</td>
                      <td className="px-4 py-3">
                        {product.featured ? (
                          <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber" />
                            <span className="text-[10px] font-mono text-cyber">FEATURED</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-platinum/50">STANDARD</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Dismantle "${product.name}"?`)) {
                              deleteMutation.mutate({ id: product.id });
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-platinum/50 hover:text-energy transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
