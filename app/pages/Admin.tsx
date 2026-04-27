import { useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Package, Film, CalendarDays, MessageSquare, Settings,
  LogOut, Plus, Trash2, Edit, X, ChevronLeft, Star, Users,
  TrendingUp, DollarSign, ShoppingBag
} from 'lucide-react';

type Tab = 'dashboard' | 'products' | 'videos' | 'appointments' | 'messages' | 'settings';

export default function Admin() {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-serif mb-4">Admin Access Required</h2>
          <Link to="/login" className="px-6 py-3 bg-gold text-black rounded-sm hover:bg-white transition-colors">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-serif mb-4">Admin Privileges Required</h2>
          <p className="text-white/40 mb-6">You need admin access to view this dashboard.</p>
          <Link to="/" className="px-6 py-3 border border-gold text-gold rounded-sm hover:bg-gold hover:text-black transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-gold" />
            <span className="text-lg font-bold text-white tracking-wider">
              AW <span className="text-gold">CMS</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products' as Tab, label: 'Products', icon: Package },
            { id: 'videos' as Tab, label: 'Videos', icon: Film },
            { id: 'appointments' as Tab, label: 'Appointments', icon: CalendarDays },
            { id: 'messages' as Tab, label: 'AI Chat Logs', icon: MessageSquare },
            { id: 'settings' as Tab, label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-gold/20 text-gold'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar || ''} alt={user.name || ''} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-white text-sm">{user.name}</p>
              <p className="text-white/40 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-sm text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/40 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-white font-medium capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">AW Gyms Management System</span>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'videos' && <VideosTab />}
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

function DashboardTab() {
  const { data: products } = trpc.product.list.useQuery();
  const { data: videos } = trpc.video.list.useQuery();
  const { data: appointments } = trpc.appointment.list.useQuery(undefined, { retry: false });
  const { data: messages } = trpc.chat.list.useQuery(undefined, { retry: false });

  const totalRevenue = products?.reduce((sum, p) => sum + parseFloat(p.price), 0) || 0;

  const stats = [
    { label: 'Total Products', value: products?.length || 0, icon: Package, color: 'text-gold' },
    { label: 'Total Videos', value: videos?.length || 0, icon: Film, color: 'text-blue-400' },
    { label: 'Appointments', value: appointments?.length || 0, icon: CalendarDays, color: 'text-green-400' },
    { label: 'AI Conversations', value: messages?.length || 0, icon: MessageSquare, color: 'text-purple-400' },
    { label: 'Inventory Value', value: `PKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Featured Items', value: products?.filter(p => p.featured).length || 0, icon: Star, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <TrendingUp className="w-4 h-4 text-white/20" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-white/40 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
          <h3 className="text-white font-medium mb-4">Recent Products</h3>
          <div className="space-y-3">
            {products?.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-sm">
                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-sm" />
                <div className="flex-1">
                  <p className="text-white text-sm">{product.name}</p>
                  <p className="text-gold text-xs">PKR {parseFloat(product.price).toLocaleString()}</p>
                </div>
                {product.featured && <Star className="w-4 h-4 text-gold" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
          <h3 className="text-white font-medium mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {appointments?.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-sm">
                <Users className="w-8 h-8 text-white/20" />
                <div className="flex-1">
                  <p className="text-white text-sm">{apt.name}</p>
                  <p className="text-white/40 text-xs">{apt.service} — {apt.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-sm ${
                  apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                  'bg-white/10 text-white/40'
                }`}>
                  {apt.status}
                </span>
              </div>
            )) || <p className="text-white/40 text-sm">No appointments yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const { data: products, refetch } = trpc.product.list.useQuery();
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'equipment',
    featured: false,
    inStock: true,
  });

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => { refetch(); setIsAdding(false); resetForm(); },
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => { refetch(); setEditing(null); resetForm(); },
  });

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', image: '', category: 'equipment', featured: false, inStock: true });
  };

  const startEdit = (product: NonNullable<typeof products>[number]) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image: product.image,
      category: product.category,
      featured: !!product.featured,
      inStock: !!product.inStock,
    });
  };

  const handleSubmit = () => {
    if (editing) {
      updateProduct.mutate({ id: editing, ...form });
    } else {
      createProduct.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-medium">Products</h2>
        <button
          onClick={() => { setIsAdding(true); setEditing(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-sm hover:bg-white transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {(isAdding || editing) && (
        <div className="p-6 bg-white/[0.02] border border-gold/20 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">{editing ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={() => { setIsAdding(false); setEditing(null); }} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
            <input placeholder="Price (e.g. 45000.00)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none">
              <option value="equipment" className="bg-[#111]">Equipment</option>
              <option value="supplements" className="bg-[#111]">Supplements</option>
              <option value="cardio" className="bg-[#111]">Cardio</option>
            </select>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none resize-none" />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-white/60 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-white/60 text-sm">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-gold" />
              In Stock
            </label>
          </div>
          <button onClick={handleSubmit} className="px-6 py-2 bg-gold text-black rounded-sm hover:bg-white transition-colors">
            {editing ? 'Update' : 'Create'}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-sm">
              <th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: NonNullable<typeof products>[number]) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-sm" />
                    <div>
                      <p className="text-white text-sm">{product.name}</p>
                      {product.featured && <span className="text-gold text-xs">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-white/60 text-sm">{product.category}</td>
                <td className="py-3 px-4 text-gold text-sm">PKR {parseFloat(product.price).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-sm ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => startEdit(product)} className="p-2 text-white/40 hover:text-gold transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteProduct.mutate({ id: product.id })} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VideosTab() {
  const { data: videos, refetch } = trpc.video.list.useQuery();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', url: '', thumbnail: '', category: 'promo', featured: false });

  const createVideo = trpc.video.create.useMutation({
    onSuccess: () => { refetch(); setIsAdding(false); setForm({ title: '', description: '', url: '', thumbnail: '', category: 'promo', featured: false }); },
  });

  const deleteVideo = trpc.video.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-medium">Videos</h2>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-sm hover:bg-white transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-white/[0.02] border border-gold/20 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Add New Video</h3>
            <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
            <input placeholder="Video URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
            <input placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none">
              <option value="promo" className="bg-[#111]">Promo</option>
              <option value="workout" className="bg-[#111]">Workout</option>
              <option value="ambience" className="bg-[#111]">Ambience</option>
            </select>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none resize-none" />
          <label className="flex items-center gap-2 text-white/60 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold" />
            Featured
          </label>
          <button onClick={() => createVideo.mutate(form)} className="px-6 py-2 bg-gold text-black rounded-sm hover:bg-white transition-colors">Create</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos?.map((video: NonNullable<typeof videos>[number]) => (
          <div key={video.id} className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden">
            <video src={video.url} className="w-full aspect-video object-cover" muted />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white text-sm font-medium">{video.title}</h4>
                  <p className="text-white/40 text-xs">{video.category}</p>
                </div>
                <button onClick={() => deleteVideo.mutate({ id: video.id })} className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const { data: appointments, refetch } = trpc.appointment.list.useQuery(undefined, { retry: false });

  const updateStatus = trpc.appointment.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteAppointment = trpc.appointment.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-medium">Appointments</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-sm">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Service</th>
              <th className="text-left py-3 px-4">Date & Time</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((apt: NonNullable<typeof appointments>[number]) => (
              <tr key={apt.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4">
                  <p className="text-white text-sm">{apt.name}</p>
                  <p className="text-white/40 text-xs">{apt.email}</p>
                </td>
                <td className="py-3 px-4 text-white/60 text-sm">{apt.service}</td>
                <td className="py-3 px-4 text-white/60 text-sm">{apt.date} at {apt.time}</td>
                <td className="py-3 px-4">
                  <select
                    value={apt.status || 'pending'}
                    onChange={(e) => updateStatus.mutate({ id: apt.id, status: e.target.value as any })}
                    className="bg-transparent text-sm text-white border border-white/10 rounded-sm px-2 py-1 focus:border-gold focus:outline-none"
                  >
                    <option value="pending" className="bg-[#111]">Pending</option>
                    <option value="confirmed" className="bg-[#111]">Confirmed</option>
                    <option value="completed" className="bg-[#111]">Completed</option>
                    <option value="cancelled" className="bg-[#111]">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => deleteAppointment.mutate({ id: apt.id })} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )) || <tr><td colSpan={5} className="py-8 text-center text-white/40">No appointments yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesTab() {
  const { data: messages, refetch } = trpc.chat.list.useQuery(undefined, { retry: false });
  const deleteMessage = trpc.chat.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-medium">AI Chat Conversations</h2>
      <div className="space-y-4">
        {messages?.map((msg: NonNullable<typeof messages>[number]) => (
          <div key={msg.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-white text-sm font-medium">{msg.name || 'Anonymous'}</p>
                  <p className="text-white/40 text-xs">{msg.email || 'No email'} • {msg.phone || 'No phone'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-sm">{msg.intent}</span>
                <button onClick={() => deleteMessage.mutate({ id: msg.id })} className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="p-3 bg-white/5 rounded-sm">
                <p className="text-white/40 text-xs mb-1">User:</p>
                <p className="text-white text-sm">{msg.message}</p>
              </div>
              <div className="p-3 bg-gold/5 rounded-sm">
                <p className="text-gold/60 text-xs mb-1">AI Response:</p>
                <p className="text-white/80 text-sm">{msg.response}</p>
              </div>
            </div>
          </div>
        )) || <p className="text-white/40 text-center py-8">No chat messages yet</p>}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { data: allSettings, refetch } = trpc.settings.getAll.useQuery();
  const setSetting = trpc.settings.set.useMutation({ onSuccess: () => refetch() });
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-medium">Site Settings</h2>
      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
        <h3 className="text-white font-medium">Add/Update Setting</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder="Key (e.g. whatsapp_number)" value={key} onChange={(e) => setKey(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
          <input placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm focus:border-gold focus:outline-none" />
        </div>
        <button onClick={() => setSetting.mutate({ key, value })} className="px-6 py-2 bg-gold text-black rounded-sm hover:bg-white transition-colors">Save Setting</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-sm">
              <th className="text-left py-3 px-4">Key</th>
              <th className="text-left py-3 px-4">Value</th>
            </tr>
          </thead>
          <tbody>
            {allSettings?.map((setting: NonNullable<typeof allSettings>[number]) => (
              <tr key={setting.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4 text-white text-sm">{setting.key}</td>
                <td className="py-3 px-4 text-white/60 text-sm">{setting.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
