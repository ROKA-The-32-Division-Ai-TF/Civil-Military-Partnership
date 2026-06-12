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
import { sidebarMenus, type OperationMode } from '../data';

interface SidebarProps {
  activeMenu: string;
  onMenuSelect: (menuId: string) => void;
  mode: OperationMode;
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

export function Sidebar({ activeMenu, onMenuSelect, mode }: SidebarProps) {
  const isMilitary = mode === 'military';

  return (
    <aside className="app-sidebar flex w-full shrink-0 flex-col border-b text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r-0">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-black leading-tight tracking-normal">여민군</p>
            <p className="app-sidebar-subtitle text-xs font-semibold">
              {isMilitary ? '군 지원 판단 운용 화면' : '세종시·군 협력 행정 플랫폼'}
            </p>
          </div>
        </div>
      </div>

      <nav className="grid grid-cols-3 gap-2 px-3 py-3 sm:grid-cols-6 lg:flex lg:flex-col lg:gap-1 lg:px-4 lg:py-5">
        {sidebarMenus.map((menu) => {
          const Icon = menuIcons[menu.id] ?? LayoutDashboard;
          const isActive = activeMenu === menu.id;

          return (
            <button
              key={menu.id}
              type="button"
              onClick={() => onMenuSelect(menu.id)}
              className={`app-sidebar-menu flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-center text-xs font-bold leading-tight transition sm:flex-col lg:min-h-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-3 lg:text-left lg:text-sm ${
                isActive ? 'is-active' : ''
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{menu.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 lg:block">
        <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/10">
          <p className="text-sm font-black text-white">여민군이란?</p>
          <p className="app-sidebar-subtitle mt-3 text-xs leading-6">
            {isMilitary
              ? '세종시에서 접수된 요청 중 군 지원 필요 건을 타당성, 안전, 가용 자원 기준으로 검토합니다.'
              : '시민 요청을 세종시가 접수하고, 필요한 경우 협력 군부대 지원 가능성을 함께 검토하는 행정 플랫폼입니다.'}
          </p>
          <div className="mt-4 grid gap-2 rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] p-3 text-xs font-bold text-blue-50">
            <span>{isMilitary ? '지원 타당성' : '세종시 접수'}</span>
            <span>{isMilitary ? '장병 안전' : '군 협력 검토'}</span>
            <span>{isMilitary ? '가용 자원' : '현장 공동 조치'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
