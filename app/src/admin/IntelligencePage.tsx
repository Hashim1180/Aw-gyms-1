import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { Brain, MessageSquare, TrendingUp, Filter } from "lucide-react";

export default function IntelligencePage() {
  const { data: aiLogs, isLoading } = trpc.aiLog.list.useQuery();
  const { data: stats } = trpc.aiLog.stats.useQuery();
  const [filter, setFilter] = useState("all");

  const filteredLogs = aiLogs?.filter((log) => {
    if (filter === "all") return true;
    if (filter === "converted") return log.converted;
    return log.intent === filter;
  });

  const intentColors: Record<string, string> = {
    product_inquiry: "text-cyber border-cyber/30 bg-cyber/10",
    pricing: "text-energy border-energy/30 bg-energy/10",
    general: "text-platinum border-white/10 bg-white/5",
    support: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    sales: "text-green-400 border-green-400/30 bg-green-400/10",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">INTELLIGENCE CENTER</h1>
        <p className="text-sm text-platinum">AI conversation logs and training data analysis</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gunmetal/40 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono text-platinum tracking-wider">TOTAL INTERACTIONS</span>
            <MessageSquare className="w-4 h-4 text-cyber" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{stats?.total || 0}</div>
        </div>
        <div className="bg-gunmetal/40 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono text-platinum tracking-wider">CONVERTED</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{stats?.converted || 0}</div>
        </div>
        <div className="bg-gunmetal/40 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono text-platinum tracking-wider">CONVERSION RATE</span>
            <Brain className="w-4 h-4 text-energy" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{stats?.conversionRate || 0}%</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-platinum" />
        <div className="flex gap-2 flex-wrap">
          {["all", "product_inquiry", "pricing", "sales", "converted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-mono border transition-colors ${
                filter === f
                  ? "border-cyber/50 bg-cyber/20 text-cyber"
                  : "border-white/10 text-platinum hover:border-white/20"
              }`}
            >
              {f.toUpperCase().replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gunmetal/20 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">SESSION</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">USER MESSAGE</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">AI RESPONSE</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">INTENT</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">CONVERTED</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-platinum tracking-wider">TIME</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-platinum/50 text-sm font-mono">
                    LOADING INTELLIGENCE DATA...
                  </td>
                </tr>
              ) : filteredLogs?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-platinum/50 text-sm font-mono">
                    NO LOGS MATCHING FILTER
                  </td>
                </tr>
              ) : (
                filteredLogs?.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-mono text-platinum">
                      {log.sessionId.slice(0, 16)}...
                    </td>
                    <td className="px-4 py-3 text-xs text-white max-w-[200px] truncate">{log.userMessage || "—"}</td>
                    <td className="px-4 py-3 text-xs text-platinum max-w-[250px] truncate">{log.aiResponse || "—"}</td>
                    <td className="px-4 py-3">
                      {log.intent && (
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-mono border rounded-sm ${intentColors[log.intent] || "text-platinum border-white/10"}`}>
                          {log.intent}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.converted ? (
                        <span className="text-[10px] font-mono text-green-400">YES</span>
                      ) : (
                        <span className="text-[10px] font-mono text-platinum/50">NO</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[10px] font-mono text-platinum">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
