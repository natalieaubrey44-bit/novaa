import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Flag, EyeOff, Search } from 'lucide-react';

export default function TransactionsPage() {
  const { adminTransactions, flagAdminTransaction } = useAuth();

  const pendingItems = useMemo(
    () => adminTransactions.filter((transaction) => transaction.status === 'pending').length,
    [adminTransactions],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Transaction monitoring</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Review flagged flows</h1>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            <Search size={16} />
            {pendingItems} pending
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/95 text-slate-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {adminTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-white">{transaction.date}</td>
                  <td className="px-6 py-4">{transaction.user}</td>
                  <td className="px-6 py-4">{transaction.account}</td>
                  <td className="px-6 py-4 text-white">${transaction.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 capitalize">{transaction.risk}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        transaction.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : transaction.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-red-500/10 text-red-300'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => flagAdminTransaction(transaction.id)}
                      className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent transition hover:bg-brand-accent/20"
                    >
                      <AlertTriangle size={14} />
                      Flag
                    </button>
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
