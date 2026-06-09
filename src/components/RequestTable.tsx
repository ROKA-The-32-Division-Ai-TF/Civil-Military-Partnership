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
            {requests.map((request) => {
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
      </div>
    </section>
  );
}
