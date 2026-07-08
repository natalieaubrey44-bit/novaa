import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NovaaLogo from "../../components/NovaaLogo";
import Footer from "../../components/layout/Footer";

const ADMIN_NAV = [
  { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "users", label: "Users", href: "/admin/users", icon: Users },
  {
    id: "accounts",
    label: "Accounts",
    href: "/admin/accounts",
    icon: CreditCard,
  },
  {
    id: "transactions",
    label: "Transactions",
    href: "/admin/transactions",
    icon: FileText,
  },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: BarChart3 },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminShell() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const activeHref = ADMIN_NAV.find(
    (item) =>
      location.pathname === item.href ||
      location.pathname.startsWith(`${item.href}/`),
  )?.href;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:top-0 lg:left-0 lg:h-screen gap-8 border-r border-white/10 bg-brand-navy px-6 py-8 overflow-visible">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <NovaaLogo className="text-2xl text-white" iconSize={32} />
              <div>
                <h1 className="text-xl font-bold">Novaa Admin</h1>
                <p className="text-sm text-slate-400">Management console</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Signed in as
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <span className="mt-3 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {user?.role === "admin" ? "Admin" : user?.role}
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === activeHref;
              const isHovered = hovered === item.id;
              const isVisualActive = isActive || isHovered;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onPointerEnter={() => setHovered(item.id)}
                  onPointerLeave={() =>
                    setHovered((prev) => (prev === item.id ? null : prev))
                  }
                  className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all ${
                    isVisualActive
                      ? "bg-brand-accent text-slate-950 shadow-[0_12px_30px_-18px_rgba(16,185,129,0.8)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>

          {/* Token Status */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <div className="text-left">
                <p className="text-slate-400 text-[10px] font-medium">
                  Session
                </p>
                <p className="text-slate-200 font-medium">Secure</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 lg:ml-80 overflow-hidden">
          <header className="border-b border-white/10 bg-slate-950/90 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Administrator access</p>
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Control center
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-slate-300">
                  <ShieldCheck size={16} />
                  Secure admin session
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-slate-300">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
