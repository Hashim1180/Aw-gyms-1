import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { Activity, MessageSquare, DollarSign, TrendingUp, ShoppingBag, Clock } from "lucide-react";

function StatCard({ title, value, icon: Icon, color, delay }: { title: string; value: string | number; icon: any; color: string; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, "")) || 0 : value;

  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numericValue * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [numericValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gunmetal/40 border border-white/5 p-6 hover:border-cyber/20 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono text-platinum tracking-wider">{title}</span>
        <div className={`w-8 h-8 ${color} bg-opacity-20 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
      <div className="text-3xl font-mono font-bold text-white">
        {typeof value === "string" && value.includes("PKR")
          ? `PKR ${displayValue.toLocaleString()}`
          : title === "CONVERSION RATE"
          ? `${displayValue}%`
          : displayValue.toLocaleString()}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: aiLogs } = trpc.aiLog.list.useQuery();
  const { data: contacts } = trpc.contact.list.useQuery();

  const recentActivity = [
    ...(aiLogs?.slice(0, 5).map((log) => ({
      type: "ai",
      message: `AI responded to: "${log.userMessage?.slice(0, 40)}..."`,
      time: new Date(log.createdAt).toLocaleTimeString(),
    })) || []),
    ...(contacts?.slice(0, 5).map((contact) => ({
      type: "contact",
      message: `New lead: ${contact.name || "Anonymous"} from ${contact.source}`,
      time: new Date(contact.createdAt).toLocaleTimeString(),
    })) || []),
  ].sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">CONTROL ROOM</h1>
        <p className="text-sm text-platinum">Real-time system metrics and intelligence overview</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gunmetal/40 border border-white/5 p-6 animate-pulse">
              <div className="h-4 bg-white/5 rounded mb-4 w-20" />
              <div className="h-8 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="TOTAL PRODUCTS" value={stats?.totalProducts || 0} icon={ShoppingBag} color="bg-cyber" delay={0} />
          <StatCard title="AI INTERACTIONS" value={stats?.totalAiLogs || 0} icon={MessageSquare} color="bg-blue-500" delay={0.1} />
          <StatCard title="CONVERSION RATE" value={`${stats?.conversionRate || 0}%`} icon={TrendingUp} color="bg-energy" delay={0.2} />
          <StatCard title="REVENUE" value={`PKR ${stats?.revenue || 0}`} icon={DollarSign} color="bg-green-500" delay={0.3} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gunmetal/30 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono text-white tracking-wider">LIVE ACTIVITY FEED</h3>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-cyber animate-pulse" />
              <span className="text-[10px] font-mono text-cyber">LIVE</span>
            </div>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide font-mono text-xs">
            {recentActivity.length === 0 ? (
              <div className="text-platinum/50 py-8 text-center">No activity recorded yet</div>
            ) : (
              recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-void/50 border border-white/5"
                >
                  <Clock className="w-3 h-3 text-platinum/50 shrink-0" />
                  <span className="text-platinum/50 shrink-0">{activity.time}</span>
                  <span className={`${activity.type === "ai" ? "text-cyber" : "text-energy"} shrink-0 text-[10px]`}>
                    [{activity.type.toUpperCase()}]
                  </span>
                  <span className="text-platinum truncate">{activity.message}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gunmetal/30 border border-white/5 p-6">
          <h3 className="text-xs font-mono text-white tracking-wider mb-4">SYSTEM STATUS</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-platinum">Database</span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyber" />
                <span className="text-[10px] font-mono text-cyber">ONLINE</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-platinum">AI Engine</span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyber animate-pulse" />
                <span className="text-[10px] font-mono text-cyber">ACTIVE</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-platinum">API Gateway</span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyber" />
                <span className="text-[10px] font-mono text-cyber">OPERATIONAL</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-platinum">WhatsApp Bot</span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="text-[10px] font-mono text-[#25D366]">CONNECTED</span>
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-xs font-mono text-white tracking-wider mb-3">QUICK ACTIONS</h3>
            <div className="space-y-2">
              <a href="/admin/arsenal" className="block w-full py-2 px-3 bg-cyber/10 border border-cyber/20 text-[10px] font-mono text-cyber text-center hover:bg-cyber/20 transition-colors">
                MANAGE PRODUCTS
              </a>
              <a href="/admin/media" className="block w-full py-2 px-3 bg-cyber/10 border border-cyber/20 text-[10px] font-mono text-cyber text-center hover:bg-cyber/20 transition-colors">
                MANAGE MEDIA
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
