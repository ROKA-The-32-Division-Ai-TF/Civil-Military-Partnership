import { CheckCircle2, Send } from 'lucide-react';
import type { RecommendationResource } from '../data';

interface ResourcePanelProps {
  resources: RecommendationResource[];
  statuses: Record<string, 'requested'>;
  onRequestSupport: (resourceId: string) => void;
}

export function ResourcePanel({
  resources,
  statuses,
  onRequestSupport,
}: ResourcePanelProps) {
  return (
    <section className="mode-panel rounded-lg border p-5 shadow-panel backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="mode-accent-text text-xs font-semibold uppercase tracking-[0.16em]">
            AI 추천
          </p>
          <h2 className="mode-title-text mt-2 text-lg font-bold">지원 가능 자원</h2>
        </div>
        <span className="rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-bold text-publicGreen">
          {resources.length}건
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {resources.map((resource) => {
          const isRequested = statuses[resource.id] === 'requested';

          return (
            <article
              key={resource.id}
              className="mode-card-soft rounded-lg border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="mode-title-text font-bold">{resource.name}</h3>
                  <p className="mode-body-text mt-1 text-sm">{resource.detail}</p>
                </div>
                {isRequested ? (
                  <CheckCircle2
                    className="h-5 w-5 shrink-0 text-publicGreen"
                    aria-hidden="true"
                  />
                ) : null}
              </div>

              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="mode-subtext">보유기관</dt>
                  <dd className="mode-body-text text-right font-semibold">{resource.owner}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="mode-subtext">지원 가능일</dt>
                  <dd className="mode-body-text font-semibold">{resource.availableDate}</dd>
                </div>
              </dl>

              <button
                type="button"
                disabled={isRequested}
                onClick={() => onRequestSupport(resource.id)}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                  isRequested
                    ? 'cursor-default bg-[#EAF4EF] text-publicGreen'
                    : 'app-primary-button text-white shadow-sm'
                }`}
              >
                {isRequested ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                {isRequested ? '지원 요청 완료' : '지원 요청'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
