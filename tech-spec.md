# Tech Spec — AW GYMS (Luxury Fitness Universe)

## 1. Development Environment

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| Vite | 6.x | Build tool & dev server |
| TypeScript | 5.7+ | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | latest | Pre-built accessible components |

---

## 2. Dependencies Map

### Core Framework
- `react` (^19.0.0) + `react-dom` (^19.0.0)
- `react-router-dom` (^7.5.0) — Client-side routing (Main Site + Admin)

### Animation & Motion
- `gsap` (^3.12.0) + `ScrollTrigger` (included) — Scroll-driven animations, pin, scrub
- `lenis` (^1.2.0) — Buttery smooth scroll with momentum
- `splitting` (^1.0.0) — Character-level text splitting for reveals
- `three` (^0.172.0) — WebGL fluid distortion grid in Hero

### Backend & Auth
- `@trpc/server` + `@trpc/client` + `@trpc/react-query` + `@trpc/tanstack-react-query` — Type-safe APIs
- `@tanstack/react-query` (^5.75.0) — Server state management
- `drizzle-orm` (^0.42.0) — Type-safe SQL
- `better-sqlite3` (^11.9.0) — SQLite driver
- `drizzle-kit` (^0.31.0) — Migrations & schema management
- `bcryptjs` (^3.0.0) — Password hashing
- `jose` (^6.0.0) — JWT signing/verification (Better Auth alternative)

### UI Components
- `lucide-react` — Iconography
- `framer-motion` (^12.0.0) — Micro-interactions (AI chat bubble, card hovers)
- `react-dropzone` (^14.3.0) — Admin image uploads
- `recharts` (^2.15.0) — Admin dashboard charts

### Utilities
- `zod` (^3.25.0) — Schema validation (tRPC inputs)
- `clsx` + `tailwind-merge` — Conditional class merging
- `date-fns` (^4.1.0) — Date formatting in admin/logs

---

## 3. Component Inventory

### 3.1 shadcn/ui Components (Built-in)
| Component | Usage |
|-----------|-------|
| Button | CTAs, form submits |
| Input | Forms (contact, admin login, product add) |
| Textarea | AI training prompts, chat input |
| Card | Product cards, admin stat cards |
| Table | Admin product/videos tables |
| Dialog | Confirmation modals (delete product) |
| Tabs | Admin dashboard navigation |
| Badge | Product categories, AI status indicators |
| Separator | Section dividers |
| ScrollArea | Admin conversation logs |
| Skeleton | Loading states for products |
| Toast | Success/error notifications |

### 3.2 Custom Components (Main Site)

| Component | Purpose | Complexity |
|-----------|---------|------------|
| `FluidCanvas` | Three.js WebGL distortion grid reacting to mouse | **High** |
| `PunchCard` | 3D CSS flip card with scroll-driven animation + flash | **High** |
| `TextReveal` | Terminal decode scramble effect on scroll | **Medium** |
| `VideoSection` | Background video with intersection-observer pause/play | **Medium** |
| `SketchfabEmbed` | Responsive iframe wrapper for 3D models | **Low** |
| `ProductGrid` | Animated product cards with hover line draw | **Medium** |
| `CyberCursor` | Custom cursor with green glow ring on hoverables | **Medium** |
| `AIChatWidget` | Floating bubble → expanded chat panel | **High** |
| `Navigation` | Fixed top nav with scroll-aware visibility | **Low** |
| `WhatsAppButton` | Fixed WhatsApp CTA with pulse animation | **Low** |

### 3.3 Custom Components (Admin Panel)

| Component | Purpose | Complexity |
|-----------|---------|------------|
| `AdminShell` | Layout: sidebar + content area | **Low** |
| `StatCard` | Animated number count-up card | **Medium** |
| `TerminalFeed` | Auto-scrolling activity log | **Medium** |
| `ProductTable` | CRUD table with inline actions | **Medium** |
| `VideoTable` | CRUD table for background videos | **Medium** |
| `ImageUploader` | Drag-and-drop with progress + preview | **Medium** |
| `ConversationLog` | AI chat history viewer | **Low** |
| `TrainingHub` | System prompt editor | **Low** |
| `LoginForm` | Admin authentication gate | **Low** |

---

## 4. Animation Implementation Plan

| Animation | Library / Tool | Implementation Approach | Complexity |
|-----------|---------------|------------------------|------------|
| **Lenis Smooth Scroll** | `lenis` | Global instance in App.tsx, integrate with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` | Low |
| **Hero Text Reveal** | `gsap` + `splitting` | Split into chars, `gsap.from(chars, {y: 100%, stagger: 0.05, duration: 0.8})` on mount | Medium |
| **Hero Scroll Blur-Out** | `gsap` + `ScrollTrigger` | `scrub: true`, animate `filter: blur()` + `scale` as user scrolls past hero | Low |
| **WebGL Fluid Distortion** | `three` | Custom ShaderMaterial on PlaneGeometry. Uniforms: `u_time`, `u_mouse`, `u_distortion`. Mouse position via React ref. | **High** |
| **Punch Card 3D Flip** | `gsap` + `ScrollTrigger` | `pin: true`, `scrub: true`, rotate `.card-wrapper` Y: 0→180. At 90°, trigger flash overlay timeline. | **High** |
| **Green Flash Overlay** | `gsap` | Fullscreen div, `opacity: 0→0.8→0` over 0.1s at flip midpoint | Low |
| **Terminal Text Decode** | Custom + `gsap` | Split chars, cycle through random glyphs for 5 frames (setInterval), then gsap snap to final. Stagger 0.03s. | Medium |
| **Video Heat Haze** | WebGL (reuse FluidCanvas) | ScrollTrigger drives `u_distortion` uniform 0→1. Fragment shader adds green tint to highlights. | Medium |
| **Product Card Hover** | `gsap` / CSS | `scale(1.05)` on image, `::after` pseudo-element width 0→100% in Cyber Green | Low |
| **AI Chat Expand** | `framer-motion` | `AnimatePresence`, `height: auto`, `y: 20→0`, `opacity: 0→1` | Low |
| **AI Typing Indicator** | CSS animation | Three dots with `animation-delay` stagger | Low |
| **Cyber Cursor** | Custom React + `framer-motion` | `useEffect` mousemove listener, `motion.div` follows with spring physics. Scale on `:hover` detection. | Medium |
| **Admin Number Count-Up** | `gsap` | `gsap.to(target, {innerText: value, duration: 1.5, snap: {innerText: 1}})` | Low |
| **Row Add Flash** | `framer-motion` | `initial={{backgroundColor: '#39ff14'}}` → `animate={{backgroundColor: 'transparent'}}` on new row | Low |
| **Row Remove Shrink** | `framer-motion` | `exit={{height: 0, opacity: 0}}` with `AnimatePresence` | Low |
| **Navigation Scroll Hide** | Custom hook | `useScrollDirection` hook. Hide on scroll down, show on scroll up after 100px threshold. | Low |
| **Sketchfab Hover Speed** | PostMessage API | `postMessage({type: 'viewer.setCameraAutoRotateSpeed', speed: 5}, '*')` on mouseenter. Reset on leave. | Low |

---

## 5. State & Logic Plan

### 5.1 Global State (Zustand Store — `useAppStore`)

```typescript
interface AppState {
  // AI Chat
  isChatOpen: boolean;
  chatMessages: Array<{role: 'user'|'ai', text: string, timestamp: number}>;
  isAiTyping: boolean;
  
  // Navigation
  scrollDirection: 'up' | 'down';
  currentSection: string;
  
  // Admin
  isAdmin: boolean;
  adminTab: 'metrics' | 'arsenal' | 'media' | 'intelligence' | 'network';
  aiEnabled: boolean;
  
  // Actions
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  loginAdmin: (token: string) => void;
  logoutAdmin: () => void;
  setAdminTab: (tab: string) => void;
  toggleAi: () => void;
}
```

### 5.2 AI Chat Logic
- **Rule-based response engine** (no external API needed for MVP):
  - Map keywords → responses (e.g., "protein" → "Our Gold Standard Whey delivers 24g per serving.").
  - Include sales conversion flow: Recommend product → Ask to connect on WhatsApp.
  - Simulate typing delay: 800ms–2000ms random.

### 5.3 Server State (tRPC + React Query)

| Router | Endpoints | Purpose |
|--------|-----------|---------|
| `auth` | `login`, `logout`, `me` | Admin authentication |
| `product` | `list`, `create`, `update`, `delete` | Product CMS |
| `video` | `list`, `create`, `update`, `delete` | Video CMS |
| `contact` | `list`, `create` | Leads from WhatsApp/form |
| `aiLog` | `list`, `create` | AI conversation storage |
| `dashboard` | `stats` | Aggregated metrics |

---

## 6. Backend Architecture

### 6.1 Database Schema (SQLite + Drizzle)

```typescript
// users — Admin accounts
const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'superadmin'] }).default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// products — Arsenal
const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  category: text('category').notNull(), // 'supplements' | 'equipment' | 'gear'
  imageUrl: text('image_url'),
  stock: integer('stock').default(0),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// videos — Media CMS
const videos = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  url: text('url').notNull(), // path to file in /public/videos
  section: text('section').notNull(), // 'hero' | 'atmosphere' | 'ai' | 'footer'
  active: integer('active', { mode: 'boolean' }).default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// contacts — Leads / Network
const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  phone: text('phone'),
  email: text('email'),
  message: text('message'),
  source: text('source').default('website'), // 'website' | 'whatsapp' | 'ai'
  status: text('status').default('new'), // 'new' | 'contacted' | 'converted'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// aiLogs — Intelligence
const aiLogs = sqliteTable('ai_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull(),
  userMessage: text('user_message'),
  aiResponse: text('ai_response'),
  intent: text('intent'), // 'product_inquiry' | 'pricing' | 'general'
  converted: integer('converted', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

### 6.2 API Design (tRPC)

| Procedure | Input (Zod) | Output | Auth |
|-----------|-------------|--------|------|
| `auth.login` | `{email: string, password: string}` | `{token: string, user: {id, name, email}}` | Public |
| `auth.me` | — | `{id, name, email, role}` | JWT |
| `product.list` | — | `Product[]` | Public (read) |
| `product.create` | `{name, price, category, imageUrl, ...}` | `Product` | Admin JWT |
| `product.delete` | `{id: number}` | `{success: boolean}` | Admin JWT |
| `video.list` | — | `Video[]` | Public (read) |
| `video.create` | `{title, url, section}` | `Video` | Admin JWT |
| `contact.create` | `{name?, phone?, email?, message?}` | `Contact` | Public |
| `aiLog.create` | `{sessionId, userMessage, aiResponse, intent}` | `AiLog` | Public |
| `dashboard.stats` | — | `{users, interactions, conversionRate, revenue}` | Admin JWT |

### 6.3 Auth Flow
1. Admin navigates to `/admin` → Unauthenticated → Redirected to `/admin/login`
2. Login form POSTs to `auth.login` → Server validates password with `bcrypt.compare` → Issues JWT (signed with `jose`, 24h expiry)
3. JWT stored in `httpOnly` cookie via Hono cookie middleware
4. All admin tRPC procedures use `middleware` to verify JWT via `jose.jwtVerify`
5. Logout clears cookie

---

## 7. Project File Structure

```
/mnt/agents/output/app/
├── public/
│   ├── videos/              # Uploaded MP4s (23268-23275.mp4)
│   ├── images/              # Uploaded JPGs (24947-24953.jpg)
│   └── favicon.ico
│
├── src/
│   ├── main.tsx             # Entry: Lenis + Router + QueryClient
│   ├── App.tsx              # Route definitions
│   ├── index.css            # Tailwind + global styles + custom cursor hide
│   │
│   ├── components/ui/       # shadcn/ui components (auto-installed)
│   │
│   ├── sections/            # Main site page sections
│   │   ├── Hero.tsx
│   │   ├── Atmosphere.tsx   # Video + PunchCard
│   │   ├── Intelligence.tsx # AI showcase + Sketchfab
│   │   ├── Arsenal.tsx      # Product grid
│   │   └── Nexus.tsx        # Footer / Contact
│   │
│   ├── components/          # Reusable custom components
│   │   ├── FluidCanvas.tsx      # Three.js WebGL
│   │   ├── PunchCard.tsx        # 3D flip card
│   │   ├── TextReveal.tsx       # Terminal decode
│   │   ├── VideoBackground.tsx  # Intersection-observer video
│   │   ├── SketchfabEmbed.tsx   # 3D model iframe
│   │   ├── ProductCard.tsx      # Animated product card
│   │   ├── CyberCursor.tsx      # Custom cursor
│   │   ├── AIChatWidget.tsx     # Floating chat
│   │   ├── Navigation.tsx       # Top nav
│   │   └── WhatsAppButton.tsx   # Fixed WA CTA
│   │
│   ├── admin/               # Admin panel (lazy-loaded)
│   │   ├── AdminShell.tsx
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ArsenalPage.tsx
│   │   ├── MediaPage.tsx
│   │   ├── IntelligencePage.tsx
│   │   ├── NetworkPage.tsx
│   │   └── components/
│   │       ├── StatCard.tsx
│   │       ├── TerminalFeed.tsx
│   │       ├── ProductTable.tsx
│   │       ├── VideoTable.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── ConversationLog.tsx
│   │       └── TrainingHub.tsx
│   │
│   ├── hooks/
│   │   ├── useLenis.ts
│   │   ├── useScrollDirection.ts
│   │   ├── useMousePosition.ts
│   │   └── useAuth.ts
│   │
│   ├── store/
│   │   └── useAppStore.ts   # Zustand
│   │
│   ├── lib/
│   │   ├── utils.ts         # cn() helper
│   │   ├── aiEngine.ts      # Rule-based AI responses
│   │   └── constants.ts     # WhatsApp number, colors, etc.
│   │
│   ├── server/              # tRPC + Drizzle backend
│   │   ├── db/
│   │   │   ├── index.ts     # Drizzle client
│   │   │   └── schema.ts    # All table definitions
│   │   ├── routers/
│   │   │   ├── auth.ts
│   │   │   ├── product.ts
│   │   │   ├── video.ts
│   │   │   ├── contact.ts
│   │   │   ├── aiLog.ts
│   │   │   └── dashboard.ts
│   │   ├── trpc.ts          # Context + middleware
│   │   └── api.ts           # Hono app + tRPC handler
│   │
│   └── types/
│       └── index.ts
│
├── server.ts                # Vite dev server plugin (hono/dev)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. Environment Variables

```env
# .env
DATABASE_URL=./db.sqlite
JWT_SECRET=aw-gyms-super-secret-key-2024
ADMIN_EMAIL=admin@awgyms.com
ADMIN_PASSWORD_HASH=$2a$10$...  # Pre-seeded admin
```

---

## 9. Tailwind Configuration Extensions

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'base-void': '#070707',
        'industrial': '#0f1012',
        'gunmetal': '#1a1b1f',
        'concrete': '#2a2d35',
        'platinum': '#c0c0c0',
        'cyber': '#39ff14',
        'energy': '#ff4d00',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'typing': 'typing 1.5s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #39ff14' },
          '50%': { boxShadow: '0 0 20px #39ff14, 0 0 40px #39ff14' },
        },
        typing: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
};
```

---

## 10. Build & Deployment

```bash
# Development
npm run dev          # Vite dev server with tRPC API

# Production build
npm run build        # Vite builds frontend → dist/
                     # tRPC API bundled into serverless handler

# Database
npm run db:push      # Drizzle push schema to SQLite
npm run db:seed      # Seed default admin + sample products
```

---

## 11. Performance Checklist

| Concern | Solution |
|---------|----------|
| Video memory | IntersectionObserver pauses off-screen videos |
| WebGL cleanup | `loseContext()` on component unmount / scroll past |
| Image sizes | Product images served at 800px max, WebP where possible |
| Bundle size | Admin panel lazy-loaded via `React.lazy()` + `Suspense` |
| Font loading | `font-display: swap` on Google Fonts link |
| Animation jank | GSAP `will-change: transform` on animated elements |
| Reduced motion | Respect `prefers-reduced-motion` — disable WebGL, flips, scramble |

---

## 12. Implementation Order

1. **Project scaffold** — Init Vite + React + Tailwind + shadcn/ui
2. **Backend foundation** — Drizzle schema, tRPC routers, SQLite setup, seed data
3. **Admin auth** — Login page, JWT middleware, protected routes
4. **Admin dashboard shell** — Sidebar, tabs, layout
5. **Admin CRUD** — Products + Videos tables, forms, uploads
6. **Main site scaffold** — Navigation, routing, Lenis smooth scroll
7. **Hero section** — Video bg + Three.js fluid canvas + text reveal
8. **Atmosphere section** — Punch card flip + scroll pinning
9. **Intelligence section** — Sketchfab embed + glitch text
10. **Arsenal section** — Product grid from API + hover animations
11. **Nexus footer** — Contact + WhatsApp integration
12. **AI Chat** — Floating widget + rule engine + store
13. **Global polish** — Cyber cursor, nav scroll hide, toast notifications
14. **Build + Deploy**
