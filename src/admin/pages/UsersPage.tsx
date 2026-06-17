import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Lock, ShieldCheck, UserPlus } from 'lucide-react';

export default function UsersPage() {
  const { adminUsers, toggleAdminUserStatus, updateAdminUserRole } = useAuth();

  const activeUsers = useMemo(
    () => adminUsers.filter((user) => user.status === 'active'),
    [adminUsers],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">User management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Accounts & roles</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-accent/90">
            <UserPlus size={18} />
            Add user
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-950/95 text-slate-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((account) => (
                <tr key={account.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-semibold">{account.name}</td>
                  <td className="px-6 py-4 text-slate-300">{account.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={account.role}
                      onChange={(event) => updateAdminUserRole(account.id, event.target.value as any)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
                    >
                      <option value="admin">Admin</option>
                      <option value="support">Support</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        account.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : account.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-red-500/10 text-red-300'
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{account.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleAdminUserStatus(account.id)}
                      className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10"
                    >
                      {account.status === 'active' ? <Lock size={14} /> : <CheckCircle2 size={14} />}
                      {account.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Summary</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/90 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active</p>
              <p className="mt-3 text-3xl font-semibold text-white">{activeUsers.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pending verification</p>
              <p className="mt-3 text-3xl font-semibold text-white">{adminUsers.filter((user) => user.status === 'pending').length}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admins</p>
              <p className="mt-3 text-3xl font-semibold text-white">{adminUsers.filter((user) => user.role === 'admin').length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
