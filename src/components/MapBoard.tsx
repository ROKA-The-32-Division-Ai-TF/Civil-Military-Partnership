import { Layers3, MapPin, Route, Satellite, ShieldCheck, UsersRound } from 'lucide-react';
import type { PointerEvent } from 'react';
import { useRef, useState } from 'react';
import { categoryLegend, type CollaborationRequest } from '../data';

interface MapBoardProps {
  requests: CollaborationRequest[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
}

const MAP_WIDTH = 760;
const MAP_HEIGHT = 520;
const MAP_ZOOM = 11;
const MAP_CENTER = { lat: 36.56, lng: 127.285 };
const TILE_SIZE = 256;

function projectToPixel(lat: number, lng: number, zoom: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;

  return {
    x: ((lng + 180) / 360) * scale,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      scale,
  };
}

const centerPixel = projectToPixel(MAP_CENTER.lat, MAP_CENTER.lng, MAP_ZOOM);
const topLeftPixel = {
  x: centerPixel.x - MAP_WIDTH / 2,
  y: centerPixel.y - MAP_HEIGHT / 2,
};

const mapTiles = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 5 }, (_, column) => {
    const tileX = Math.floor(topLeftPixel.x / TILE_SIZE) + column;
    const tileY = Math.floor(topLeftPixel.y / TILE_SIZE) + row;

    return {
      id: `${tileX}-${tileY}`,
      url: `https://tile.openstreetmap.org/${MAP_ZOOM}/${tileX}/${tileY}.png`,
      x: tileX * TILE_SIZE - topLeftPixel.x,
      y: tileY * TILE_SIZE - topLeftPixel.y,
    };
  }),
).flat();

function getMarkerPosition(request: CollaborationRequest) {
  if (typeof request.lat !== 'number' || typeof request.lng !== 'number') {
    return {
      left: request.mapX,
      top: request.mapY,
    };
  }

  const pixel = projectToPixel(request.lat, request.lng, MAP_ZOOM);

  return {
    left: ((pixel.x - topLeftPixel.x) / MAP_WIDTH) * 100,
    top: ((pixel.y - topLeftPixel.y) / MAP_HEIGHT) * 100,
  };
}

function clampPan(value: number) {
  return Math.max(-180, Math.min(180, value));
}

export function MapBoard({
  requests,
  selectedRequestId,
  onSelectRequest,
}: MapBoardProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? requests[0];
  const selectedPalette = categoryLegend[selectedRequest.category];

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = dragState.current;
    if (!current || current.pointerId !== event.pointerId) {
      return;
    }

    setPan({
      x: clampPan(current.originX + event.clientX - current.startX),
      y: clampPan(current.originY + event.clientY - current.startY),
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
      setDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-civicNavy">세종특별자치시 현장 지도</h2>
          <p className="mt-1 text-sm text-slate-500">
            실제 지도 위에서 요청 위치와 공동 조치 흐름을 확인합니다.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-[#DDEBE3] bg-[#F4FAF7] px-3 py-1 text-xs font-bold text-publicGreen">
          <Satellite className="h-3.5 w-3.5" aria-hidden="true" />
          지도 연동
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div
          className={`relative min-h-[520px] overflow-hidden rounded-lg border border-[#D8E1DA] bg-[#EEF4F1] shadow-inner ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label="OpenStreetMap 기반 세종특별자치시 현장 지도"
            preserveAspectRatio="none"
          >
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#EAF1EE" />
            <g transform={`translate(${pan.x} ${pan.y})`}>
              {mapTiles.map((tile) => (
                <image
                  key={tile.id}
                  href={tile.url}
                  x={tile.x}
                  y={tile.y}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  preserveAspectRatio="none"
                />
              ))}
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_34%,rgba(11,43,76,0.10)_100%)]" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/80" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
          >
            {requests.map((request) => {
              const palette = categoryLegend[request.category];
              const selected = selectedRequestId === request.id;
              const position = getMarkerPosition(request);

              return (
                <button
                  key={request.id}
                  type="button"
                  aria-label={`${request.location} ${request.category} 요청 선택`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onSelectRequest(request.id)}
                  className="pointer-events-auto group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${position.left}%`, top: `${position.top}%` }}
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

          <div
            className="absolute left-4 top-4 rounded-lg border border-white bg-white/95 p-3 shadow-lg backdrop-blur"
            onPointerDown={(event) => event.stopPropagation()}
          >
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

          <div
            className="absolute bottom-4 left-4 right-4 rounded-lg border border-white bg-white/[0.96] p-4 shadow-lg backdrop-blur"
            onPointerDown={(event) => event.stopPropagation()}
          >
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

          <div className="absolute right-4 top-4 hidden rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-500 shadow-sm sm:block">
            © OpenStreetMap contributors
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
