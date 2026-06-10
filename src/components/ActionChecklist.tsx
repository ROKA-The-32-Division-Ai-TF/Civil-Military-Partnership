import { CheckCircle2, Circle, ClipboardCheck } from 'lucide-react';

interface ActionChecklistProps {
  completedItems: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
}

const checklistItems = [
  {
    id: 'site',
    label: '현장 위치 확인',
    detail: '요청 위치와 접근 동선을 확인합니다.',
  },
  {
    id: 'safety',
    label: '안전조치 검토',
    detail: '통제선, 장비 접근, 참여자 안전교육을 확인합니다.',
  },
  {
    id: 'partner',
    label: '협업기관 회신 확인',
    detail: '추천 기관의 지원 가능 여부를 기록합니다.',
  },
  {
    id: 'document',
    label: '공문 초안 검토',
    detail: 'AI 생성 문서를 담당자가 최종 확인합니다.',
  },
];

export function ActionChecklist({ completedItems, onToggleItem }: ActionChecklistProps) {
  const completedCount = checklistItems.filter((item) => completedItems[item.id]).length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <section className="rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            실행 준비
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">실행 체크리스트</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4EF] text-publicGreen">
          <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>진행률</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-publicGreen transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {checklistItems.map((item) => {
          const checked = Boolean(completedItems[item.id]);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleItem(item.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                checked
                  ? 'border-[#DDEBE3] bg-[#F4FAF7]'
                  : 'border-slate-200 bg-porcelain hover:border-publicGreen/50'
              }`}
            >
              {checked ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-publicGreen" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              )}
              <span>
                <span className="block text-sm font-bold text-civicNavy">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {item.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
