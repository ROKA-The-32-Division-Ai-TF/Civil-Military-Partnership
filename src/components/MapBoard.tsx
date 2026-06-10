import { MapPin, Navigation, Route, Waves } from 'lucide-react';
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
  const selectedPalette = categoryLegend[selectedRequest.category];

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-civicNavy">
            세종특별자치시 협업 현황 지도
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            대민지원 협업 가능 요청만 표시하는 시연용 상황지도입니다.
          </p>
        </div>
        <div className="rounded-full border border-[#DDEBE3] bg-[#F4FAF7] px-3 py-1 text-xs font-bold text-publicGreen">
          로컬 더미 데이터
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_210px]">
        <div className="relative min-h-[470px] overflow-hidden rounded-lg border border-[#D8E1DA] bg-[#F8FBF8] shadow-inner">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 760 520"
            role="img"
            aria-label="세종시 민관군 협업 현황을 표현한 지도형 상황판"
          >
            <defs>
              <pattern
                id="map-grid"
                width="36"
                height="36"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M36 0H0V36"
                  fill="none"
                  stroke="#EAF0EA"
                  strokeWidth="1"
                />
              </pattern>
              <linearGradient id="river-blue" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#DFF3FF" />
                <stop offset="100%" stopColor="#91D5F6" />
              </linearGradient>
              <filter id="soft-map-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="12"
                  floodColor="#0B2B4C"
                  floodOpacity="0.10"
                  stdDeviation="14"
                />
              </filter>
            </defs>

            <rect width="760" height="520" fill="#FBFCFA" />
            <rect width="760" height="520" fill="url(#map-grid)" opacity="0.9" />

            <path
              d="M354 26L440 58L510 126L488 202L552 274L526 360L446 448L318 488L234 434L202 336L246 270L214 178L262 88Z"
              fill="#FFFFFF"
              stroke="#C9D8CA"
              strokeWidth="3"
              filter="url(#soft-map-shadow)"
            />

            <g stroke="#FFFFFF" strokeWidth="3">
              <path
                d="M354 26L440 58L510 126L456 166L382 154L316 104L262 88Z"
                fill="#EEF7F2"
              />
              <path
                d="M262 88L316 104L382 154L368 236L286 254L214 178Z"
                fill="#F7F3E6"
              />
              <path
                d="M382 154L456 166L488 202L470 278L386 286L368 236Z"
                fill="#EDF6FF"
              />
              <path
                d="M214 178L286 254L282 338L202 336L246 270Z"
                fill="#F2F7EF"
              />
              <path
                d="M286 254L386 286L402 364L318 488L234 434L202 336L282 338Z"
                fill="#FFF9EA"
              />
              <path
                d="M470 278L552 274L526 360L446 448L402 364L386 286Z"
                fill="#EEF2FF"
              />
              <path
                d="M386 286L470 278L446 448L318 488L402 364Z"
                fill="#EEF8F5"
              />
            </g>

            <path
              d="M118 350C198 320 270 316 350 344C438 374 518 390 682 330"
              fill="none"
              stroke="url(#river-blue)"
              strokeLinecap="round"
              strokeWidth="26"
              opacity="0.88"
            />
            <path
              d="M118 350C198 320 270 316 350 344C438 374 518 390 682 330"
              fill="none"
              stroke="#5FB7DD"
              strokeLinecap="round"
              strokeWidth="3"
              strokeDasharray="7 10"
              opacity="0.7"
            />

            <path
              d="M346 42C356 122 360 196 382 256C404 316 404 398 380 476"
              fill="none"
              stroke="#E1C891"
              strokeLinecap="round"
              strokeWidth="7"
            />
            <path
              d="M232 406C292 350 360 296 432 232C472 196 508 164 548 128"
              fill="none"
              stroke="#E1C891"
              strokeLinecap="round"
              strokeWidth="6"
              strokeDasharray="12 12"
            />
            <path
              d="M270 124C346 166 424 206 516 250"
              fill="none"
              stroke="#D7DEE4"
              strokeLinecap="round"
              strokeWidth="5"
            />

            <g fill="#31465A" fontFamily="Pretendard, Apple SD Gothic Neo, sans-serif">
              <text x="345" y="84" fontSize="13" fontWeight="700">전의면</text>
              <text x="284" y="168" fontSize="13" fontWeight="700">전동면</text>
              <text x="422" y="194" fontSize="13" fontWeight="700">연동면</text>
              <text x="246" y="310" fontSize="13" fontWeight="700">장군면</text>
              <text x="348" y="330" fontSize="13" fontWeight="700">행정중심권</text>
              <text x="450" y="348" fontSize="13" fontWeight="700">부강면</text>
              <text x="334" y="430" fontSize="13" fontWeight="700">금남면</text>
              <text x="190" y="365" fontSize="12" fontWeight="700" fill="#3981A7">금강</text>
              <text x="376" y="126" fontSize="11" fontWeight="700" fill="#9A7431">BRT 축</text>
              <text x="476" y="232" fontSize="11" fontWeight="700" fill="#9A7431">주요 도로</text>
            </g>

            <g transform="translate(36 34)">
              <circle cx="20" cy="20" r="18" fill="#FFFFFF" stroke="#D8E1DA" />
              <path d="M20 8L26 26L20 23L14 26Z" fill="#0B2B4C" />
              <text x="16" y="48" fill="#64748B" fontSize="10" fontWeight="700">N</text>
            </g>

            <g transform="translate(48 468)">
              <path d="M0 0H92" stroke="#334155" strokeWidth="3" />
              <path d="M0 -6V6M46 -6V6M92 -6V6" stroke="#334155" strokeWidth="2" />
              <text x="0" y="22" fill="#64748B" fontSize="11" fontWeight="700">0</text>
              <text x="70" y="22" fill="#64748B" fontSize="11" fontWeight="700">10km</text>
            </g>
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
                  className={`absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                    selected ? 'opacity-25' : 'opacity-10 group-hover:opacity-20'
                  }`}
                  style={{ backgroundColor: palette.color }}
                />
                <span
                  className={`relative flex items-center justify-center rounded-full border-[3px] border-white text-white shadow-lg ring-2 ring-white/80 transition ${
                    selected ? 'h-12 w-12 scale-110' : 'h-9 w-9 group-hover:scale-110'
                  }`}
                  style={{ backgroundColor: palette.color }}
                >
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                {selected ? (
                  <span className="pointer-events-none absolute left-1/2 top-12 min-w-40 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 shadow-lg">
                    <strong className="block text-civicNavy">{request.category}</strong>
                    {request.location}
                  </span>
                ) : null}
                {!selected ? (
                  <span className="pointer-events-none absolute left-1/2 top-11 hidden min-w-36 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 shadow-lg group-hover:block">
                    <strong className="block text-civicNavy">{request.category}</strong>
                    {request.location}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white bg-white/[0.94] p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-publicGreen">선택 요청</p>
                <p className="mt-1 truncate text-sm font-bold text-civicNavy">
                  {selectedRequest.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedRequest.requester} · {selectedRequest.location}
                </p>
              </div>
              <span
                className="w-fit rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: selectedPalette.bg,
                  color: selectedPalette.color,
                }}
              >
                {selectedRequest.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-[#D8E1DA] bg-[#FBFCFA] p-4">
            <h3 className="text-sm font-bold text-civicNavy">지도 레이어</h3>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-sky-500" aria-hidden="true" />
                하천·침수 취약축
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-[#B98535]" aria-hidden="true" />
                주요 이동·지원 동선
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-civicNavy" aria-hidden="true" />
                읍면별 지원 위치
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#D8E1DA] bg-[#FBFCFA] p-4">
            <h3 className="text-sm font-bold text-civicNavy">표시 유형</h3>
            <div className="mt-4 grid gap-2">
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
                  className="flex items-center gap-2 rounded-lg border border-white bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#DDEBE3] hover:shadow-md"
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
      </div>
    </section>
  );
}
