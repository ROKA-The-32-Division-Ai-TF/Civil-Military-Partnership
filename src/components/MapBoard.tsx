import {
  Layers3,
  LocateFixed,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { categoryLegend, type CollaborationRequest } from '../data';
import type { AICompanionMessage } from './AICompanion';

interface MapBoardProps {
  requests: CollaborationRequest[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
  onExplain?: (message: AICompanionMessage) => void;
}

const GOOGLE_MAP_URL =
  'https://www.google.com/maps?q=%EC%84%B8%EC%A2%85%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EC%8B%9C&z=11&output=embed';

function markerPosition(request: CollaborationRequest) {
  return {
    left: `${request.mapX}%`,
    top: `${request.mapY}%`,
  };
}

export function MapBoard({
  requests,
  selectedRequestId,
  onSelectRequest,
  onExplain,
}: MapBoardProps) {
  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? requests[0];
  const selectedPalette = categoryLegend[selectedRequest.category];

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-civicNavy">세종특별자치시 현장 지도</h2>
          <p className="mt-1 text-sm text-slate-500">
            Google 지도 위에서 요청 위치와 공동 조치 흐름을 확인합니다.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-[#DDEBE3] bg-[#F4FAF7] px-3 py-1 text-xs font-bold text-publicGreen">
          <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
          Google 지도
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-[#D8E1DA] bg-[#EEF4F1] shadow-inner">
          <iframe
            title="Google 지도 기반 세종특별자치시 현장 지도"
            src={GOOGLE_MAP_URL}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_34%,rgba(11,43,76,0.10)_100%)]" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/80" />

          <div className="pointer-events-none absolute inset-0">
            {requests.map((request) => {
              const palette = categoryLegend[request.category];
              const selected = selectedRequestId === request.id;

              return (
                <button
                  key={request.id}
                  type="button"
                  aria-label={`${request.location} ${request.category} 요청 선택`}
                  onClick={() => onSelectRequest(request.id)}
                  className="pointer-events-auto group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={markerPosition(request)}
                >
                  <span
                    className={`absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                      selected ? 'animate-ping opacity-25' : 'opacity-10 group-hover:opacity-20'
                    }`}
                    style={{ backgroundColor: palette.color }}
                  />
                  <span
                    className={`relative flex items-center justify-center rounded-full border-[3px] border-white text-white shadow-lg ring-2 ring-white/90 transition ${
                      selected ? 'h-12 w-12 scale-110' : 'h-9 w-9 group-hover:scale-110'
                    }`}
                    style={{ backgroundColor: palette.color }}
                  >
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className={`pointer-events-none absolute left-1/2 top-12 min-w-40 -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-left text-xs text-slate-700 shadow-lg backdrop-blur ${
                      selected ? 'block' : 'hidden group-hover:block'
                    }`}
                  >
                    <strong className="block text-civicNavy">{request.category}</strong>
                    {request.location}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white bg-white/95 p-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-bold text-civicNavy">
              <Layers3 className="h-4 w-4 text-publicGreen" aria-hidden="true" />
              협업 레이어
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-publicGreen" />
                민간 요청 위치
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-civicNavy" />
                세종시 현장 판단
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-signalAmber" />
                군 지원 가능 자원
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onExplain?.({
                title: '현재 지도 범위 확인',
                body:
                  '좋습니다. 지금 보이는 세종시 권역에서 요청 위치, 접근 동선, 현장 위험도를 함께 보겠습니다. 우선은 선택 현장의 안전 통제와 지원 자원부터 확인하면 됩니다.',
                chips: ['지도 확인', '동선', '안전'],
              })
            }
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white bg-white/95 px-3 py-2 text-xs font-black text-civicNavy shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:text-publicGreen"
          >
            <Sparkles className="h-3.5 w-3.5 text-publicGreen" aria-hidden="true" />
            현재 범위 분석
          </button>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-lg border border-white bg-white/[0.96] p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-publicGreen">선택 현장</p>
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
            <h3 className="text-sm font-bold text-civicNavy">현장 조치 흐름</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-publicGreen" />
                <span>요청기관이 위치와 현장 상황을 제공</span>
              </div>
              <div className="flex items-start gap-2">
                <Route className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6FDB]" />
                <span>세종시가 접근 동선과 안전조치를 확정</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#B98535]" />
                <span>협력 군부대가 인력·장비 지원 가능 범위를 검토</span>
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
