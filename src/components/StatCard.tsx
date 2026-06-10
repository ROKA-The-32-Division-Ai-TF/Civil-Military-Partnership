import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  color,
  onClick,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black" style={{ color }}>{label}</p>
          <p className="mt-2 whitespace-nowrap text-3xl font-black tracking-normal text-slate-950">{value}</p>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
          style={{ backgroundColor: color, boxShadow: `0 16px 28px ${color}33` }}
        >
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold leading-5 text-slate-600">{caption}</p>
    </>
  );

  const className =
    'rounded-lg border bg-white p-5 text-left shadow-panel backdrop-blur transition';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100`}
        style={{ borderColor: `${color}55` }}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={className} style={{ borderColor: `${color}55` }}>
      {content}
    </div>
  );
}
