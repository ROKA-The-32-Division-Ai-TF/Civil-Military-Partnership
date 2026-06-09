import { FileText, Sparkles } from 'lucide-react';
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

  return (
    <section className="rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            AI 판단 보조
          </p>
          <h2 className="mt-2 text-lg font-bold leading-snug text-civicNavy">
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
          <dt className="text-slate-500">요청 기관</dt>
          <dd className="font-semibold text-slate-800">{request.requester}</dd>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <dt className="text-slate-500">요청 일자</dt>
          <dd className="font-semibold text-slate-800">{request.date}</dd>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <dt className="text-slate-500">위치</dt>
          <dd className="font-semibold text-slate-800">{request.location}</dd>
        </div>
      </dl>

      <div className="mt-5 rounded-lg border border-[#DDEBE3] bg-[#F4FAF7] p-4">
        <p className="mb-2 text-sm font-bold text-civicNavy">AI 분석 요약</p>
        <p className="text-sm leading-6 text-slate-700">{request.aiSummary}</p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-civicNavy">우선순위</p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyle[request.priority]}`}>
            {request.priority}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-civicNavy">필요 자원</p>
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
        <p className="text-sm font-bold text-civicNavy">협업 가능 기관</p>
        <div className="mt-3 grid gap-2">
          {request.partners.map((partner) => (
            <div
              key={partner}
              className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2 text-sm font-medium text-slate-700"
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
