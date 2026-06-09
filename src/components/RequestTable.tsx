import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { categoryLegend, type CollaborationRequest } from '../data';

interface RequestTableProps {
  requests: CollaborationRequest[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
}

export function RequestTable({
  requests,
  selectedRequestId,
  onSelectRequest,
}: RequestTableProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  const statuses = useMemo(
    () => ['전체', ...Array.from(new Set(requests.map((request) => request.status)))],
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return requests.filter((request) => {
      const queryMatch =
        !normalizedQuery ||
        `${request.title} ${request.requester} ${request.location} ${request.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      const statusMatch = statusFilter === '전체' || request.status === statusFilter;

      return queryMatch && statusMatch;
    });
  }, [query, requests, statusFilter]);

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            Request Queue
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">최근 협업 요청</h2>
        </div>
        <span className="rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-bold text-publicGreen">
          선택 즉시 분석
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 focus-within:border-publicGreen focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="요청 제목, 기관, 위치 검색"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-bold text-civicNavy outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-100">
        <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="bg-[#F8FAF8] text-slate-500">
              <th className="border-b border-slate-200 px-3 py-3 font-semibold">요청 제목</th>
              <th className="border-b border-slate-200 px-3 py-3 font-semibold">요청 기관</th>
              <th className="border-b border-slate-200 px-3 py-3 font-semibold">요청 일자</th>
              <th className="border-b border-slate-200 px-3 py-3 font-semibold">진행 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => {
              const selected = selectedRequestId === request.id;
              const palette = categoryLegend[request.category];

              return (
                <tr
                  key={request.id}
                  onClick={() => onSelectRequest(request.id)}
                  className={`cursor-pointer transition ${
                    selected ? 'bg-[#F0F8F4]' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="border-b border-slate-100 px-3 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: palette.color }}
                      />
                      <span className="font-semibold text-civicNavy">{request.title}</span>
                    </div>
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4 text-slate-700">
                    {request.requester}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4 text-slate-700">
                    {request.date}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                      {request.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredRequests.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
            조건에 맞는 협업 요청이 없습니다.
          </div>
        ) : null}
      </div>
    </section>
  );
}
