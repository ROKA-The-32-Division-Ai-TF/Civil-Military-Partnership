import { MapPin } from 'lucide-react';
import { categoryLegend, type CollaborationRequest } from '../data';

interface MapBoardProps {
  requests: CollaborationRequest[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
}

export function MapBoard({
  requests,
  selectedRequestId,
  onSelectRequest,
}: MapBoardProps) {
  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? requests[0];

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-civicNavy">
            세종특별자치시 협업 현황 지도
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            접수 위치와 협업 유형을 한눈에 확인합니다.
          </p>
        </div>
        <div className="rounded-full border border-[#E7D8BB] bg-[#FFF8EA] px-3 py-1 text-xs font-bold text-[#8A641F]">
          시연 데이터
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_190px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#E6E0D5] bg-[linear-gradient(135deg,#FCFBF7_0%,#FFFFFF_52%,#EEF8F4_100%)]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 720 480"
            role="img"
            aria-label="세종시 협업 현황을 표현한 추상 지도"
          >
            <defs>
              <linearGradient id="river" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#D7ECFF" />
                <stop offset="100%" stopColor="#8FD3F4" />
              </linearGradient>
              <linearGradient id="district" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F2F7F3" />
              </linearGradient>
            </defs>
            <path
              d="M116 76 C182 42 256 60 304 100 C356 142 408 118 478 98 C556 76 636 110 654 176 C674 252 606 318 548 356 C480 402 414 414 344 396 C276 378 238 430 166 392 C90 352 70 278 88 212 C104 154 62 112 116 76 Z"
              fill="url(#district)"
              stroke="#D8CFBE"
              strokeWidth="2"
            />
            <path
              d="M78 296 C152 268 226 272 304 292 C400 316 478 318 640 260"
              fill="none"
              stroke="url(#river)"
              strokeWidth="22"
              strokeLinecap="round"
              opacity="0.82"
            />
            <path
              d="M120 136 L292 102 L438 132 L604 164"
              fill="none"
              stroke="#E4DAC8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10 12"
            />
            <path
              d="M212 360 C260 284 308 224 384 170 C432 136 498 128 586 134"
              fill="none"
              stroke="#E4DAC8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="12 12"
            />
            <circle cx="354" cy="238" r="82" fill="#FFFFFF" opacity="0.82" />
            <circle cx="354" cy="238" r="52" fill="#EAF4EF" opacity="0.92" />
            <circle
              cx="354"
              cy="238"
              r="68"
              fill="none"
              stroke="#B98535"
              strokeWidth="2"
              opacity="0.72"
            />
            <text x="306" y="233" fill="#1F7A5C" fontSize="18" fontWeight="700">
              행정중심권
            </text>
            <text x="260" y="320" fill="#0369A1" fontSize="15" fontWeight="700">
              금강 생활권
            </text>
            <text x="138" y="146" fill="#475569" fontSize="14" fontWeight="700">
              북부 농촌권
            </text>
            <text x="505" y="376" fill="#475569" fontSize="14" fontWeight="700">
              남부 대응권
            </text>
          </svg>

          {requests.map((request) => {
            const palette = categoryLegend[request.category];
            const selected = selectedRequestId === request.id;

            return (
              <button
                key={request.id}
                type="button"
                aria-label={`${request.location} ${request.category} 요청 선택`}
                onClick={() => onSelectRequest(request.id)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${request.mapX}%`, top: `${request.mapY}%` }}
              >
                <span
                  className={`absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                    selected ? 'opacity-30' : 'opacity-15 group-hover:opacity-25'
                  }`}
                  style={{ backgroundColor: palette.color }}
                />
                <span
                  className={`relative flex items-center justify-center rounded-full border-4 border-white text-white shadow-lg transition ${
                    selected ? 'h-11 w-11 scale-110' : 'h-9 w-9 group-hover:scale-110'
                  }`}
                  style={{ backgroundColor: palette.color }}
                >
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-12 hidden min-w-36 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 shadow-lg group-hover:block">
                  <strong className="block text-civicNavy">{request.category}</strong>
                  {request.location}
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white bg-white/[0.92] p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-publicGreen">선택 상황</p>
                <p className="mt-1 text-sm font-bold text-civicNavy">
                  {selectedRequest.title}
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-bold text-publicGreen">
                {selectedRequest.status}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#E6E0D5] bg-[#FBFAF6] p-4">
          <h3 className="text-sm font-bold text-civicNavy">카테고리 범례</h3>
          <div className="mt-4 grid gap-3">
            {Object.entries(categoryLegend).map(([category, palette]) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  const firstMatch = requests.find(
                    (request) => request.category === category,
                  );
                  if (firstMatch) {
                    onSelectRequest(firstMatch.id);
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-white bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: palette.color }}
                />
                <span className="truncate">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
