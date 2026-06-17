import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, CreditCard, FileText, Bell, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const {
    adminUsers,
    adminAccounts,
    adminTransactions,
    auditLogs,
  } = useAuth();

  const flaggedTransactions = useMemo(
    () => adminTransactions.filter((item) => item.status === 'flagged').length,
    [adminTransactions],
  );

  const reviewAccounts = useMemo(
    () => adminAccounts.filter((account) => account.status !== 'active').length,
    [adminAccounts],
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.9)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin summary</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Daily operations snapshot</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor account health, review user activity, and resolve flagged workflows from a single secure command center.
              </p>
            </div>
            <div className="inline-flex items-center rounded-3xl bg-brand-accent/10 px-4 py-3 text-sm font-semibold text-brand-accent">
              <ShieldCheck size={18} />
              Live secure view
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Active users',
                value: adminUsers.length,
                icon: Users,
                accent: 'text-sky-300',
              },
              {
                label: 'Managed accounts',
                value: adminAccounts.length,
                icon: CreditCard,
                accent: 'text-emerald-300',
              },
              {
                label: 'Recent issues',
                value: reviewAccounts,
                icon: TrendUp,
                accent: 'text-amber-300',
              },
              {
                label: 'Flagged transactions',
                value: flaggedTransactions,
                icon: Bell,
                accent: 'text-red-300',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.label}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                    </div>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 ${item.accent}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Audit activity</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Recent review log</h2>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-slate-400">
                Updated now
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-sm font-semibold text-white">{log.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{log.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">{log.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Operations queue</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Pending verification requests</p>
                <p className="mt-3 text-2xl font-semibold text-white">{adminUsers.filter((user) => user.status === 'pending').length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">High-risk transaction alerts</p>
                <p className="mt-3 text-2xl font-semibold text-white">{adminTransactions.filter((item) => item.risk === 'high').length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
