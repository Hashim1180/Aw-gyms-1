import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import {
  Users,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Trash2,
  Search,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: "NEW", color: "text-cyber border-cyber/30 bg-cyber/10", icon: Clock },
  contacted: { label: "CONTACTED", color: "text-blue-400 border-blue-400/30 bg-blue-400/10", icon: Phone },
  converted: { label: "CONVERTED", color: "text-green-400 border-green-400/30 bg-green-400/10", icon: CheckCircle },
  closed: { label: "CLOSED", color: "text-platinum border-white/10 bg-white/5", icon: XCircle },
};

const sourceConfig: Record<string, string> = {
  website: "text-cyber",
  whatsapp: "text-[#25D366]",
  ai: "text-energy",
  form: "text-blue-400",
};

export default function NetworkPage() {
  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();
  
  const updateMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => utils.contact.list.invalidate(),
  });
  
  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => utils.contact.list.invalidate(),
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = contacts?.filter((c) => {
    const matchesSearch = 
      (c.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (c.phone || "").includes(search) ||
      (c.email?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">NETWORK // LEADS</h1>
        <p className="text-sm text-platinum">Contact management and lead tracking system</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = contacts?.filter((c) => c.status === key).length || 0;
          return (
            <div key={key} className="bg-gunmetal/40 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-platinum tracking-wider">{config.label}</span>
                <config.icon className={`w-4 h-4 ${config.color.split(" ")[0]}`} />
              </div>
              <div className="text-2xl font-mono font-bold text-white">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-platinum/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-gunmetal/30 text-white text-sm pl-10 pr-4 py-2.5 border border-white/5 focus:border-cyber/30 focus:outline-none font-mono"
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "converted", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-[10px] font-mono border transition-colors ${
                statusFilter === s
                  ? "border-cyber/50 bg-cyber/20 text-cyber"
                  : "border-white/10 text-platinum hover:border-white/20"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gunmetal/20 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">NAME</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">CONTACT</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">MESSAGE</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">SOURCE</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">STATUS</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">ACTIONS</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Loader2 className="w-6 h-6 text-cyber animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-platinum/50 text-sm font-mono">
                    NO LEADS IN NETWORK
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered?.map((contact) => {
                    const statusKey = contact.status || "new";
                    const sourceKey = contact.source || "website";
                    const status = statusConfig[statusKey] || statusConfig.new;
                    return (
                      <motion.tr
                        key={contact.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gunmetal border border-white/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-platinum" />
                            </div>
                            <div>
                              <div className="text-sm text-white">{contact.name || "Anonymous"}</div>
                              <div className="text-[10px] text-platinum/50">
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {contact.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-platinum">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-1.5 text-xs text-platinum">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-platinum max-w-[200px] truncate">
                          {contact.message || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono ${sourceConfig[sourceKey] || "text-platinum"}`}>
                            {sourceKey.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-mono border rounded-sm ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={statusKey}
                            onChange={(e) => updateMutation.mutate({ id: contact.id, status: e.target.value as any })}
                            className="bg-void text-white text-[10px] font-mono px-2 py-1 border border-white/10 focus:border-cyber/30 focus:outline-none"
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="converted">CONVERTED</option>
                            <option value="closed">CLOSED</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm("Delete this lead?")) {
                                deleteMutation.mutate({ id: contact.id });
                              }
                            }}
                            className="text-platinum/50 hover:text-energy transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
