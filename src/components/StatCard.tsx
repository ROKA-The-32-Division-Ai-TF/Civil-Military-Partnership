import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, caption, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 whitespace-nowrap text-3xl font-bold tracking-normal text-civicNavy">{value}</p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}16`, color }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-5 text-slate-500">{caption}</p>
    </div>
  );
}
