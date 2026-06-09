import {
  BarChart3,
  Bell,
  BrainCircuit,
  FileText,
  Inbox,
  LayoutDashboard,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { sidebarMenus } from '../data';

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
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white text-civicNavy lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-civicNavy text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight">여민용비</p>
            <p className="text-xs font-semibold text-slate-500">Yeomin Yongbi AI</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible">
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
                  : 'text-slate-600 hover:bg-[#F4F8F6] hover:text-civicNavy'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{menu.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-slate-100 p-4 lg:block">
        <div className="rounded-lg bg-[#F4F8F6] p-3">
          <p className="text-xs font-bold text-publicGreen">협력 네트워크</p>
          <p className="mt-1 text-sm font-bold text-civicNavy">6개 기관 연결</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            세종시 중심으로 요청과 자원을 한 화면에서 조율합니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
