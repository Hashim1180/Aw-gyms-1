import { useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  Video,
  Brain,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
} from "lucide-react";
import DashboardPage from "./DashboardPage";
import ArsenalPage from "./ArsenalPage";
import MediaPage from "./MediaPage";
import IntelligencePage from "./IntelligencePage";
import NetworkPage from "./NetworkPage";

const navItems = [
  { path: "/admin", label: "METRICS", icon: LayoutDashboard, component: DashboardPage },
  { path: "/admin/arsenal", label: "ARSENAL", icon: Package, component: ArsenalPage },
  { path: "/admin/media", label: "MEDIA", icon: Video, component: MediaPage },
  { path: "/admin/intelligence", label: "INTELLIGENCE", icon: Brain, component: IntelligencePage },
  { path: "/admin/network", label: "NETWORK", icon: Users, component: NetworkPage },
];

export default function AdminShell() {
  const { user, isAuthenticated, isLoading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyber animate-pulse" />
          <span className="text-sm font-mono text-platinum">INITIALIZING SYSTEMS...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-void text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-industrial border-r border-white/5 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 text-white font-heading font-bold text-lg tracking-wider">
            <Shield className="w-5 h-5 text-cyber" />
            AW ADMIN
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber animate-pulse" />
            <span className="text-[10px] font-mono text-cyber tracking-wider">
              {user?.name || "ADMIN"} // ONLINE
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-wider transition-colors ${
                  isActive
                    ? "bg-cyber/10 text-cyber border-l-2 border-cyber"
                    : "text-platinum hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-wider text-platinum hover:text-energy transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-industrial/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gunmetal border border-white/5">
              <Activity className="w-3 h-3 text-cyber" />
              <span className="text-[10px] font-mono text-platinum">SYSTEM NORMAL</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <Routes>
              {navItems.map((item) => (
                <Route
                  key={item.path}
                  path={item.path === "/admin" ? "" : item.path.replace("/admin/", "")}
                  element={<item.component />}
                />
              ))}
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
