import {
  BrainCircuit,
  ChevronRight,
  FileText,
  Network,
  Sparkles,
} from 'lucide-react';
import type { CollaborationRequest, RecommendationResource } from '../data';
import type { AICompanionMessage } from './AICompanion';

type AICommand = 'brief' | 'resources' | 'document';

interface AICommandBarProps {
  request: CollaborationRequest;
  resources: RecommendationResource[];
  message: AICompanionMessage;
  onCommand: (command: AICommand) => void;
}

const commandItems = [
  {
    id: 'brief',
    label: '브리핑',
    detail: '상황 확인',
    icon: BrainCircuit,
  },
  {
    id: 'resources',
    label: '자원',
    detail: '추천 보기',
    icon: Network,
  },
  {
    id: 'document',
    label: '문서',
    detail: '초안 열기',
    icon: FileText,
  },
] as const;

export function AICommandBar({
  request,
  resources,
  message,
  onCommand,
}: AICommandBarProps) {
  const primaryResource = resources[0]?.name ?? request.neededResources[0] ?? '자원 검토';

  return (
    <section className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="grid gap-3 p-3.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF4EF] text-publicGreen ring-1 ring-emerald-100">
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-publicGreen" />
            <Sparkles className="relative h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-publicGreen">
                AI 판단 보조
              </p>
              <span className="rounded-full bg-[#EAF4EF] px-2 py-0.5 text-[11px] font-black text-publicGreen">
                {request.category}
              </span>
              <span className="rounded-full bg-[#EEF3FF] px-2 py-0.5 text-[11px] font-black text-[#2563EB]">
                {request.priority}
              </span>
            </div>
            <h2 className="mt-1 truncate text-sm font-black text-civicNavy">
              {request.title}
            </h2>
            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
              {message.title} · {message.body}
            </p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-400">
              추천 자원: {primaryResource}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[390px]">
          {commandItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCommand(item.id)}
                className="group flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-[#FBFCFA] px-3 py-2 text-left transition hover:border-[#8CB4FF] hover:bg-white"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] ring-1 ring-blue-100 group-hover:bg-[#EEF3FF]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-civicNavy">
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
