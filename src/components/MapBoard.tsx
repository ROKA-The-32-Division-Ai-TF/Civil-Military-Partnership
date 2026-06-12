import {
  ExternalLink,
  Layers3,
  LocateFixed,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { categoryLegend, type CollaborationRequest } from '../data';
import type { AICompanionMessage } from './AICompanion';

interface MapBoardProps {
  requests: CollaborationRequest[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
  onExplain?: (message: AICompanionMessage) => void;
}

function googleMapUrl(request: CollaborationRequest) {
  const query =
    request.lat && request.lng
      ? `${request.lat},${request.lng}`
      : `${request.location} 세종특별자치시`;

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
}

function googleMapLink(request: CollaborationRequest) {
  const query =
    request.lat && request.lng
      ? `${request.lat},${request.lng}`
      : `${request.location} 세종특별자치시`;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
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
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(false);
  }, [selectedRequest.id]);

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-civicNavy">세종특별자치시 Google 현장지도</h2>
          <p className="mt-1 text-sm text-slate-500">
            현장을 선택하면 Google 지도가 해당 위치로 이동합니다. 지도 안에서 직접 드래그와 확대·축소가 가능합니다.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-[#DDEBE3] bg-[#F4FAF7] px-3 py-1 text-xs font-bold text-publicGreen">
          <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
          Google 지도
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="relative h-[380px] overflow-hidden rounded-lg border border-[#D8E1DA] bg-[#EDF5F1] shadow-inner sm:h-[500px] lg:h-[520px]">
            <iframe
              key={selectedRequest.id}
              title={`${selectedRequest.location} Google 지도`}
              src={googleMapUrl(selectedRequest)}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#EDF5F1]">
                <div className="mx-6 max-w-sm rounded-lg border border-[#D8E1DA] bg-white/95 p-5 text-center shadow-panel">
                  <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-[#EAF4EF]" />
                  <p className="mt-3 text-sm font-bold text-civicNavy">
                    Google 지도를 불러오는 중입니다
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    선택 현장의 위치와 접근 동선을 곧 표시합니다.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-3 rounded-lg border border-[#D8E1DA] bg-[#FBFCFA] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold text-publicGreen">선택 현장</p>
                  <span
                    className="w-fit rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: selectedPalette.bg,
                      color: selectedPalette.color,
                    }}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold leading-5 text-civicNavy">
                  {selectedRequest.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {selectedRequest.requester} · {selectedRequest.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={googleMapLink(selectedRequest)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-civicNavy transition hover:border-publicGreen hover:text-publicGreen"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-publicGreen" aria-hidden="true" />
                  큰 지도
                </a>
                <button
                  type="button"
                  onClick={() =>
                    onExplain?.({
                      title: 'Google 지도 기준 현장 확인',
                      body:
                        '선택 현장을 Google 지도에서 확인합니다. 현장 접근로, 작업 공간, 장비 진입 가능성을 먼저 확인한 뒤 군 지원 검토로 넘기면 됩니다.',
                      chips: ['Google 지도', '접근로', '군 지원 검토'],
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-civicNavy px-3 py-2 text-xs font-black text-white transition hover:bg-[#12395F]"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  현장 분석
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-[#D8E1DA] bg-[#FBFCFA] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-civicNavy">
              <Layers3 className="h-4 w-4 text-publicGreen" aria-hidden="true" />
              협업 판단 기준
            </h3>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-publicGreen" />
                시민 요청 위치
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-civicNavy" />
                세종시 현장 판단
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-signalAmber" />
                협력 군부대 자원
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#D8E1DA] bg-[#FBFCFA] p-4">
            <h3 className="text-sm font-bold text-civicNavy">현장 조치 흐름</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-publicGreen" />
                <span>시민·읍면동 요청 위치 확인</span>
              </div>
              <div className="flex items-start gap-2">
                <Route className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6FDB]" />
                <span>세종시가 접근 동선과 안전조치 확정</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#B98535]" />
                <span>협력 군부대가 인력·장비 지원 범위 검토</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#D8E1DA] bg-[#FBFCFA] p-4">
            <h3 className="text-sm font-bold text-civicNavy">현장 선택</h3>
            <div className="mt-4 grid max-h-[330px] gap-2 overflow-y-auto pr-1">
              {requests.map((request) => {
                const palette = categoryLegend[request.category];
                const selected = selectedRequestId === request.id;

                return (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => onSelectRequest(request.id)}
                    className={`rounded-lg border px-3 py-2.5 text-left transition ${
                      selected
                        ? 'border-publicGreen bg-[#F4FAF7] shadow-sm'
                        : 'border-white bg-white hover:border-[#DDEBE3] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: palette.color }}
                      >
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-5 text-civicNavy">
                          {request.location}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold leading-4 text-slate-500">
                          {request.category} · {request.priority}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
