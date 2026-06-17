import { useAuth } from '../../context/AuthContext';
import { RefreshCcw, ShieldAlert, CreditCard, Archive } from 'lucide-react';

export default function AccountsPage() {
  const { adminAccounts, updateAdminAccountStatus } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Account review</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Managed portfolios</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-accent/90">
            <RefreshCcw size={18} />
            Refresh balances
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/95 text-slate-400">
              <tr>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminAccounts.map((account) => (
                <tr key={account.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 font-semibold text-white">{account.id}</td>
                  <td className="px-6 py-4">{account.owner}</td>
                  <td className="px-6 py-4 text-white">${account.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 capitalize">{account.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        account.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : account.status === 'review'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-red-500/10 text-red-300'
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => updateAdminAccountStatus(account.id, 'active')}
                        className="inline-flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10"
                      >
                        <ShieldAlert size={14} />
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAdminAccountStatus(account.id, 'review')}
                        className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent transition hover:bg-brand-accent/20"
                      >
                        <Archive size={14} />
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
