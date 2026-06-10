import {
  BarChart3,
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
  settings: Settings,
};

export function Sidebar({ activeMenu, onMenuSelect }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#173E70] bg-[linear-gradient(180deg,#072C55_0%,#052342_52%,#041A32_100%)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r-0">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-black leading-tight tracking-normal">여민군</p>
            <p className="text-xs font-semibold text-blue-100">시민과 군이 함께 만드는 세종</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:px-4 lg:py-5 [&::-webkit-scrollbar]:hidden">
        {sidebarMenus.map((menu) => {
          const Icon = menuIcons[menu.id] ?? LayoutDashboard;
          const isActive = activeMenu === menu.id;

          return (
            <button
              key={menu.id}
              type="button"
              onClick={() => onMenuSelect(menu.id)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold transition ${
                isActive
                  ? 'bg-[#1E63B6] text-white shadow-lg shadow-blue-950/20'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{menu.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 lg:block">
        <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/10">
          <p className="text-sm font-black text-white">여민군이란?</p>
          <p className="mt-3 text-xs leading-6 text-blue-100">
            시민의 요청을 기반으로 민·관·군이 함께 협력하여 지역문제를 해결하는 협업 플랫폼입니다.
          </p>
          <div className="mt-4 grid gap-2 rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] p-3 text-xs font-bold text-blue-50">
            <span>세종시 접수</span>
            <span>AI 협업 추천</span>
            <span>민·관·군 공동 조치</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
