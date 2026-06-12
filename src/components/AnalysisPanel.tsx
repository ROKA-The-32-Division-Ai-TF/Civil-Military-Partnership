import { CheckCircle2, FileText, Network, Sparkles, Target } from 'lucide-react';
import { categoryLegend, type CollaborationRequest } from '../data';

interface AnalysisPanelProps {
  request: CollaborationRequest;
  onOpenDocument: () => void;
}

const priorityStyle: Record<CollaborationRequest['priority'], string> = {
  긴급: 'bg-red-100 text-red-700',
  높음: 'bg-amber-100 text-amber-700',
  보통: 'bg-emerald-100 text-emerald-700',
};

export function AnalysisPanel({ request, onOpenDocument }: AnalysisPanelProps) {
  const palette = categoryLegend[request.category];
  const aiResults = [
    {
      label: '유형 분류',
      value: request.category,
      detail: '요청 성격 확인',
      icon: Target,
    },
    {
      label: '자원 추출',
      value: `${request.neededResources.length}개`,
      detail: request.neededResources[0],
      icon: Network,
    },
    {
      label: '판단 상태',
      value: '완료',
      detail: `우선순위 ${request.priority}`,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="mode-panel rounded-lg border p-5 shadow-panel backdrop-blur">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="mode-accent-text text-xs font-semibold uppercase tracking-[0.16em]">
            AI 공동판단
          </p>
          <h2 className="mode-title-text mt-2 text-lg font-bold leading-snug">
            {request.title}
          </h2>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: palette.bg, color: palette.color }}
        >
          {request.category}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <dt className="mode-subtext">요청 기관</dt>
          <dd className="mode-body-text font-semibold">{request.requester}</dd>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <dt className="mode-subtext">요청 일자</dt>
          <dd className="mode-body-text font-semibold">{request.date}</dd>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <dt className="mode-subtext">위치</dt>
          <dd className="mode-body-text font-semibold">{request.location}</dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
        {aiResults.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="mode-card-soft rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF4EF] text-publicGreen">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="mode-subtext block text-xs font-bold leading-4">
                    {item.label}
                  </span>
                  <span className="mode-title-text block text-sm font-black leading-5">
                    {item.value}
                  </span>
                </span>
              </div>
              <p className="mode-subtext mt-2 text-xs font-semibold leading-4">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mode-card-soft mt-5 rounded-lg border p-4">
        <p className="mode-title-text mb-2 text-sm font-bold">AI 분석 요약</p>
        <p className="mode-body-text text-sm leading-6">{request.aiSummary}</p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="mode-title-text text-sm font-bold">우선순위</p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyle[request.priority]}`}>
            {request.priority}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mode-title-text text-sm font-bold">필요 자원</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {request.neededResources.map((resource) => (
            <span
              key={resource}
              className="rounded-full border border-[#DDEBE3] bg-[#F8FCFA] px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {resource}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mode-title-text text-sm font-bold">협업 가능 기관</p>
        <div className="mt-3 grid gap-2">
          {request.partners.map((partner) => (
            <div
              key={partner}
              className="mode-card-soft rounded-lg border px-3 py-2 text-sm font-medium"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <button
          type="button"
          onClick={onOpenDocument}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-publicGreen px-4 py-3 text-sm font-bold text-white shadow-float transition hover:bg-emerald-800"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          AI 추천 결과 보기
        </button>
        <button
          type="button"
          onClick={onOpenDocument}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D7C298] bg-white px-4 py-3 text-sm font-bold text-civicNavy transition hover:border-signalAmber hover:text-[#8A641F]"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          공문 생성
        </button>
      </div>
    </section>
  );
}
