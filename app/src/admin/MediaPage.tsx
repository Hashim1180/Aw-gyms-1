import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Play,
  Eye,
  EyeOff,
} from "lucide-react";

const sectionOptions = ["hero", "atmosphere", "ai", "footer", "promo"];

export default function MediaPage() {
  const utils = trpc.useUtils();
  const { data: videos, isLoading } = trpc.video.list.useQuery();
  
  const createMutation = trpc.video.create.useMutation({
    onSuccess: () => {
      utils.video.list.invalidate();
      setShowForm(false);
      setFormData({ title: "", url: "", section: "hero", active: true, sortOrder: 0 });
    },
  });
  
  const deleteMutation = trpc.video.delete.useMutation({
    onSuccess: () => utils.video.list.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    section: "hero" as const,
    active: true,
    sortOrder: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">MEDIA CMS</h1>
          <p className="text-sm text-platinum">Manage background videos and visual assets</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyber/20 border border-cyber/30 text-cyber text-xs font-mono hover:bg-cyber/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD MEDIA
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
            <h3 className="text-xs font-mono text-white tracking-wider mb-4">NEW MEDIA PROTOCOL</h3>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">TITLE *</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">SECTION *</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value as any })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                >
                  {sectionOptions.map((s) => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono text-platinum block mb-1.5">VIDEO URL *</label>
                <div className="flex gap-2">
                  <input
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/videos/23268.mp4"
                    className="flex-1 bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                  />
                  <div className="px-3 py-2 bg-gunmetal border border-white/10 text-platinum flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span className="text-[10px] font-mono">Use /videos/ folder</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-platinum block mb-1.5">SORT ORDER</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full bg-void text-white text-sm px-3 py-2 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 accent-cyber"
                />
                <label htmlFor="active" className="text-xs text-platinum">ACTIVE</label>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-cyber/20 border border-cyber/30 text-cyber text-xs font-mono hover:bg-cyber/30 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  ADD MEDIA
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

      <div className="bg-gunmetal/20 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">TITLE</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">SECTION</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">URL</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">STATUS</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-6 h-6 text-cyber animate-spin mx-auto" />
                  </td>
                </tr>
              ) : videos?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-platinum/50 text-sm font-mono">
                    NO MEDIA FOUND — ADD VIDEOS
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {videos?.map((video) => (
                    <motion.tr
                      key={video.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono text-platinum">#{video.id}</td>
                      <td className="px-4 py-3 text-sm text-white">{video.title}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono border border-cyber/30 text-cyber bg-cyber/10 rounded-sm">
                          {video.section}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-platinum truncate max-w-[200px]">{video.url}</td>
                      <td className="px-4 py-3">
                        {video.active ? (
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3 h-3 text-cyber" />
                            <span className="text-[10px] font-mono text-cyber">VISIBLE</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <EyeOff className="w-3 h-3 text-platinum/50" />
                            <span className="text-[10px] font-mono text-platinum/50">HIDDEN</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${video.title}"?`)) {
                              deleteMutation.mutate({ id: video.id });
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
