import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, CreditCard, FileText, Bell, TrendingUp, Shield } from 'lucide-react';

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
      <section className="grid gap-6 xl:grid-cols-[1fr]">
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
