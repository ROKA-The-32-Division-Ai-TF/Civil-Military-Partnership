import {
  BarChart3,
  Bell,
  BrainCircuit,
  Building2,
  FileText,
  Inbox,
  LayoutDashboard,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { partnerInstitutions, sidebarMenus } from '../data';

interface SidebarProps {
  activeMenu: string;
  onMenuSelect: (menuId: string) => void;
}

const menuIcons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  requests: Inbox,
  analysis: BrainCircuit,
  resources: PackageCheck,
  cases: Search,
  documents: FileText,
  performance: BarChart3,
  alerts: Bell,
  settings: Settings,
};

export function Sidebar({ activeMenu, onMenuSelect }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white/[0.88] text-civicNavy shadow-panel backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0B2B4C,#1F7A5C)] text-white shadow-float">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">여민용비</p>
            <p className="text-xs font-semibold text-slate-500">Yeomin Yongbi AI</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:py-4">
        {sidebarMenus.map((menu) => {
          const Icon = menuIcons[menu.id] ?? LayoutDashboard;
          const isActive = activeMenu === menu.id;

          return (
            <button
              key={menu.id}
              type="button"
              onClick={() => onMenuSelect(menu.id)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-civicNavy text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-civicNavy'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{menu.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-slate-100 px-5 py-5 lg:block">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          협력기관
        </div>
        <div className="grid gap-2 text-sm text-slate-700">
          {partnerInstitutions.map((partner) => (
            <div
              key={partner}
              className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2 font-medium"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
