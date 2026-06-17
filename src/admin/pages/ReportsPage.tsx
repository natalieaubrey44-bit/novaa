import { BarChart3, LineChart, PieChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Reporting</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Financial and risk reports</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-accent/90">
            <BarChart3 size={18} />
            Export report
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Liquidity trend',
              value: '↑ 24%',
              description: 'Quarterly cash position improved across primary operating accounts.',
              icon: LineChart,
            },
            {
              title: 'Compliance score',
              value: '98.2%',
              description: 'Transaction monitoring coverage remains above internal threshold.',
              icon: PieChart,
            },
            {
              title: 'Risk exposure',
              value: 'Low',
              description: 'Only 4 high-risk events pending review for the current cycle.',
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-accent/10 text-brand-accent">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        <h2 className="text-xl font-semibold text-white">Latest report insights</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Daily active sessions</p>
            <p className="mt-3 text-3xl font-semibold text-white">1,274</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">New account approvals</p>
            <p className="mt-3 text-3xl font-semibold text-white">32</p>
          </div>
        </div>
      </div>
    </div>
  );
}
