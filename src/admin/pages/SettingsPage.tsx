import { Shield, Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Platform configuration</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-accent/90">
            <Settings size={18} />
            Save settings
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Security</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-sm font-semibold text-white">Two-factor enforcement</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Require all administrators to authenticate with MFA for access to the management console.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-sm font-semibold text-white">Audit logging</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enable system-wide audit logs for all admin actions across users, accounts, and transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">System status</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-sm font-semibold text-white">API integrations</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Connected to payment gateway, risk service, and reporting APIs.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-sm font-semibold text-white">Incident response</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Review the latest security events and escalation workflows in the control center.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
