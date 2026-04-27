import { Routes, Route } from 'react-router'
import { Suspense, lazy } from 'react'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

const AdminPanel = lazy(() => import('./admin/AdminShell'));

export default function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
