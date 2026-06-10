import {
  BrainCircuit,
  ChevronRight,
  FileText,
  Network,
  Sparkles,
} from 'lucide-react';
import type { CollaborationRequest, RecommendationResource } from '../data';

type AICommand = 'brief' | 'resources' | 'document';

interface AICommandBarProps {
  request: CollaborationRequest;
  resources: RecommendationResource[];
  onCommand: (command: AICommand) => void;
}

const commandItems = [
  {
    id: 'brief',
    label: '상황 브리핑',
    detail: '위치·우선순위',
    icon: BrainCircuit,
  },
  {
    id: 'resources',
    label: '자원 추천',
    detail: '인력·장비 매칭',
    icon: Network,
  },
  {
    id: 'document',
    label: '문서 초안',
    detail: '공문·계획서',
    icon: FileText,
  },
] as const;

export function AICommandBar({
  request,
  resources,
  onCommand,
}: AICommandBarProps) {
  const primaryResource = resources[0]?.name ?? request.neededResources[0] ?? '자원 검토';

  return (
    <section className="mb-5 overflow-hidden rounded-lg border border-[#C8DAFF] bg-white shadow-panel">
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563EB,#1F7A5C)] text-white shadow-lg shadow-blue-900/15">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-publicGreen/20" />
            <Sparkles className="relative h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-publicGreen">
                AI 실행 중
              </p>
              <span className="rounded-full bg-[#EAF4EF] px-2.5 py-1 text-[11px] font-black text-publicGreen">
                {request.category}
              </span>
              <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-[11px] font-black text-[#2563EB]">
                우선순위 {request.priority}
              </span>
            </div>
            <h2 className="mt-2 truncate text-base font-black text-civicNavy">
              {request.title}
            </h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
              추천 자원: {primaryResource} · 협력 흐름: 세종시 판단 후 공동 조치 검토
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[480px]">
          {commandItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCommand(item.id)}
                className="group flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-[#FBFCFA] px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#8CB4FF] hover:bg-white hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] ring-1 ring-blue-100 group-hover:bg-[#EEF3FF]">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-civicNavy">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                    {item.detail}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-[#2563EB]" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
