import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  categoryLegend,
  type CollaborationRequest,
  type SimilarCase,
} from '../data';

interface SimilarCasesProps {
  request: CollaborationRequest;
  cases: SimilarCase[];
}

export function SimilarCases({ request, cases }: SimilarCasesProps) {
  const [query, setQuery] = useState('');

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cases
      .filter((item) => {
        const sameCategory = item.category === request.category;
        const queryMatch =
          !normalizedQuery ||
          `${item.title} ${item.agency} ${item.result} ${item.resources.join(' ')}`
            .toLowerCase()
            .includes(normalizedQuery);

        return sameCategory || queryMatch;
      })
      .sort((a, b) => {
        if (a.category === request.category && b.category !== request.category) {
          return -1;
        }

        if (a.category !== request.category && b.category === request.category) {
          return 1;
        }

        return b.matchScore - a.matchScore;
      })
      .slice(0, 4);
  }, [cases, query, request.category]);

  return (
    <section className="rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            Case Search
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">유사사례 검색</h2>
          <p className="mt-1 text-sm text-slate-500">
            선택 요청과 같은 유형의 과거 사례를 우선 표시합니다.
          </p>
        </div>
        <span className="w-fit rounded-full px-3 py-1 text-xs font-bold" style={{
          backgroundColor: categoryLegend[request.category].bg,
          color: categoryLegend[request.category].color,
        }}>
          {request.category}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 focus-within:border-publicGreen focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
        <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          placeholder="키워드 검색: 배수, 안전, 행사, 장비"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filteredCases.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-slate-200 bg-porcelain p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold leading-6 text-civicNavy">{item.title}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {item.agency} · {item.year}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-publicGreen ring-1 ring-emerald-100">
                {item.matchScore}%
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.result}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.resources.map((resource) => (
                <span
                  key={resource}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200"
                >
                  {resource}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
