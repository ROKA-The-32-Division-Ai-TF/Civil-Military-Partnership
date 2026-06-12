import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileText,
  Landmark,
  Layers3,
  Network,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { categoryLegend, type CollaborationRequest, type OperationMode } from '../data';
import type { AICompanionMessage } from './AICompanion';

interface ExperienceConsoleProps {
  mode: OperationMode;
  requests: CollaborationRequest[];
  selectedRequest: CollaborationRequest;
  onSelectRequest: (requestId: string) => void;
  onOpenPrimary: () => void;
  onOpenMap: () => void;
  onOpenDocuments: () => void;
  onExplain?: (message: AICompanionMessage) => void;
}

interface ModeProfile {
  label: string;
  eyebrow: string;
  heroTitle: string;
  title: string;
  description: string;
  operator: string;
  focus: string[];
  icon: LucideIcon;
  boardTitle: string;
  boardCaption: string;
  aiLabel: string;
  aiSummary: string;
  primaryAction: string;
  mapAction: string;
  documentAction: string;
}

const modeProfiles: Record<OperationMode, ModeProfile> = {
  sejong: {
    label: '세종시용',
    eyebrow: '시민 요청 기반 AI 협업 설계',
    heroTitle: '여민군 AI 협업관제센터',
    title: '세종시 협업담당관 화면',
    description:
      '시민 요청을 접수하면 AI가 담당부서, 협력기관, 필요 자원, 문서 초안까지 행정 흐름으로 정리합니다.',
    operator: '세종시 협업담당관',
    focus: ['시민 요청 접수', '담당부서 검토', '공문 자동화'],
    icon: Landmark,
    boardTitle: '세종 지역문제 스캔',
    boardCaption: '접수된 요청을 AI가 유형별로 정리합니다',
    aiLabel: 'AI 협업 설계',
    aiSummary:
      '세종시가 접수와 조정을 맡고, 필요한 경우 협력 군부대의 지원 가능 범위를 함께 검토하는 흐름으로 설계했습니다.',
    primaryAction: '시민 요청 접수',
    mapAction: 'AI 협업 설계 보기',
    documentAction: '문서 자동화',
  },
  military: {
    label: '군용',
    eyebrow: '지원 타당성 기반 AI 작전 판단',
    heroTitle: '여민군 AI 지원판단센터',
    title: '군 지원 판단 화면',
    description:
      '접수된 공공지원 요청을 지원 타당성, 장병 안전, 임무 영향, 가용 자원 기준으로 재정렬합니다.',
    operator: '민군작전장교',
    focus: ['지원 타당성', '가용 자원', '장병 안전'],
    icon: ShieldCheck,
    boardTitle: '지원 판단 큐',
    boardCaption: '승인 전 검토가 필요한 요청을 우선 표시합니다',
    aiLabel: 'AI 지원 판단',
    aiSummary:
      '군용 화면은 요청 자체보다 지원 가능 여부, 현장 위험도, 투입 규모, 임무 영향 확인에 초점을 맞춰 판단 순서를 재구성합니다.',
    primaryAction: '지원 검토 열기',
    mapAction: '현장 접근 분석',
    documentAction: '지원계획서 검토',
  },
};

const metricCards: Record<OperationMode, Array<[string, string, string, LucideIcon]>> = {
  sejong: [
    ['접수 요청', '128건', '세종 전 권역', Landmark],
    ['AI 설계', '6단계', '분류·추천·문서화', BrainCircuit],
    ['문서 초안', '5분 이내', '공문·계획·보고', FileText],
  ],
  military: [
    ['지원 판단 큐', '15건', '승인 전 검토', Target],
    ['가용 자원', '42건', '인력·장비 후보', Truck],
    ['안전 확인', '3단계', '현장·동선·임무', ShieldCheck],
  ],
};

const pipelineByMode: Record<OperationMode, Array<[string, string, string, string]>> = {
  sejong: [
    ['1', '시민 요청 접수', 'NLP', '요청 내용 자동 분류'],
    ['2', '행정기관 검토', '추천 알고리즘', '협업 필요성 분석'],
    ['3', '협력기관 추천', 'RAG·벡터 검색', '기관·지원방안 추천'],
    ['4', '자원 추천', 'AI 추천 모델', '인력·장비·소요시간 산출'],
    ['5', '문서 자동화', '생성형 AI', '공문·계획서 자동 작성'],
    ['6', '결과 관리', '데이터 분석', '성과 데이터 축적'],
  ],
  military: [
    ['1', '지원 요청 확인', 'NLP', '요청 목적·범위 구조화'],
    ['2', '타당성 검토', '규칙·사례 분석', '군 지원 필요도 판단'],
    ['3', '위험도 판단', '현장 리스크 모델', '장병 안전 요소 점검'],
    ['4', '가용 자원 확인', 'AI 매칭', '인력·장비·시간대 비교'],
    ['5', '지원계획 작성', '생성형 AI', '역할·동선·통제 초안 작성'],
    ['6', '결과 환류', '데이터 분석', '지원 이력과 기준 축적'],
  ],
};

const impactMetrics: Record<OperationMode, Array<[string, string, string, LucideIcon]>> = {
  sejong: [
    ['협력기관 선정', '수시간~수일', '수분 이내', Clock3],
    ['유사사례 검색', '개별 검색', '즉시 조회', Network],
    ['공문 작성', '30분~1시간', '5분 이내', FileText],
    ['자원계획 수립', '담당자 경험', 'AI 추천 기반', BrainCircuit],
  ],
  military: [
    ['지원 타당성', '수기 판단', '기준별 자동 정리', ShieldCheck],
    ['위험요소 확인', '개별 검토', '체크포인트 즉시 표시', Target],
    ['가용 자원 비교', '전화 확인', '후보 자원 목록화', Truck],
    ['지원계획 초안', '반복 작성', '5분 이내 생성', FileText],
  ],
};

export function ExperienceConsole({
  mode,
  requests,
  selectedRequest,
  onSelectRequest,
  onOpenPrimary,
  onOpenMap,
  onOpenDocuments,
  onExplain,
}: ExperienceConsoleProps) {
  const profile = modeProfiles[mode];
  const ProfileIcon = profile.icon;
  const selectedPalette = categoryLegend[selectedRequest.category];
  const pipeline = pipelineByMode[mode];
  const metrics = metricCards[mode];
  const impacts = impactMetrics[mode];

  return (
    <section className="mode-landing overflow-hidden rounded-lg border shadow-panel">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)]">
        <div className="mode-hero-panel relative overflow-hidden p-5 sm:p-7">
          <div className="ai-scan-surface absolute inset-0 opacity-55" />
          <div className="relative z-10">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="mode-eyebrow inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {profile.eyebrow}
                </div>
                <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                  {profile.heroTitle}
                </h2>
                <p className="mode-hero-copy mt-3 max-w-2xl text-sm font-medium leading-7">
                  {profile.description}
                </p>
              </div>
              <div className="mode-badge rounded-lg border px-3 py-2 text-sm font-black">
                {profile.label}
              </div>
            </div>

            <div className="mode-hero-card mt-6 rounded-lg border p-4 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mode-icon-box flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <ProfileIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mode-muted text-xs font-bold">{profile.operator}</p>
                    <h3 className="mt-1 text-xl font-black">{profile.title}</h3>
                    <p className="mode-hero-copy mt-2 max-w-2xl text-sm leading-6">
                      {profile.boardCaption}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2 text-sm font-bold">
                  {profile.focus.map((item) => (
                    <span key={item} className="mode-pill rounded-lg border px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {metrics.map(([label, value, detail, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    onExplain?.({
                      title: `${label} 확인`,
                      body: `${profile.label} 화면 기준으로 ${detail} 항목을 먼저 보여줍니다. 선택 요청의 다음 조치와 연결해 판단합니다.`,
                      chips: [profile.label, label, value],
                    })
                  }
                  className="mode-metric-card rounded-lg border p-4 text-left transition"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <p className="mt-3 text-xs font-bold">{label}</p>
                  <p className="mt-1 text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold">{detail}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onOpenPrimary}
                className="mode-primary-action inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black transition"
              >
                {profile.primaryAction}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenMap}
                className="mode-secondary-action inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-black transition"
              >
                {profile.mapAction}
                <Radar className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenDocuments}
                className="mode-secondary-action inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-black transition"
              >
                {profile.documentAction}
                <FileText className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mode-live-board p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mode-live-eyebrow text-xs font-black uppercase tracking-[0.16em]">
                {profile.aiLabel}
              </p>
              <h3 className="mt-2 text-xl font-black">{profile.boardTitle}</h3>
            </div>
            <span className="mode-status-pill rounded-full px-3 py-1 text-xs font-black">
              실시간 분석
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {requests.slice(0, 5).map((request, index) => {
              const palette = categoryLegend[request.category];
              const selected = request.id === selectedRequest.id;
              const militaryRank = ['검토 1순위', '검토 2순위', '검토 3순위', '대기', '대기'][index];

              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => {
                    onSelectRequest(request.id);
                    onExplain?.({
                      title: `${request.location} ${mode === 'military' ? '지원 판단' : '요청 분석'}`,
                      body:
                        mode === 'military'
                          ? `${request.category} 요청을 지원 타당성, 현장 위험도, 가용 자원 기준으로 다시 정렬했습니다.`
                          : `${request.category} 유형으로 분류했습니다. 유사사례, 협력기관, 필요 자원, 문서 초안을 이어서 설계합니다.`,
                      chips: [request.category, request.priority, profile.label],
                    });
                  }}
                  className={`mode-live-item grid gap-3 rounded-lg border p-3 text-left transition sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center ${
                    selected ? 'is-selected' : ''
                  }`}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: palette.color }}
                  >
                    {mode === 'military' ? (
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Radar className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-5">
                      {request.title}
                    </span>
                    <span className="mt-1 block text-xs font-semibold leading-4">
                      {request.location} · {request.requester}
                    </span>
                  </span>
                  <span
                    className="w-fit rounded-full px-2.5 py-1 text-xs font-black"
                    style={{
                      backgroundColor: mode === 'military' ? 'rgba(132, 204, 22, 0.14)' : palette.bg,
                      color: mode === 'military' ? '#A3E635' : palette.color,
                    }}
                  >
                    {mode === 'military' ? militaryRank : request.priority}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mode-ai-summary mt-5 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: selectedPalette.color }}
              >
                {mode === 'military' ? (
                  <Route className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="text-xs font-black">{profile.aiLabel}</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  {selectedRequest.category} 요청입니다. {profile.aiSummary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mode-flow-section border-t p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mode-live-eyebrow text-xs font-black uppercase tracking-[0.16em]">
                  AI 업무 흐름
                </p>
                <h3 className="mt-2 text-xl font-black">
                  {mode === 'military'
                    ? '지원 판단부터 결과 환류까지 6단계'
                    : '요청부터 결과 관리까지 6단계 자동화'}
                </h3>
              </div>
              <p className="mode-subtext text-sm font-semibold">
                {mode === 'military' ? '군용 지원 판단 흐름' : '기획서 기반 서비스 흐름'}
              </p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {pipeline.map(([step, title, tech, detail]) => (
                <button
                  key={step}
                  type="button"
                  onClick={() =>
                    onExplain?.({
                      title: `${title} 단계`,
                      body: `${tech} 기준으로 ${detail}을 수행합니다. 이 단계의 결과는 다음 협업 판단으로 이어집니다.`,
                      chips: [`${step}단계`, tech, profile.label],
                    })
                  }
                  className="mode-flow-card rounded-lg border p-3 text-left transition"
                >
                  <span className="mode-step-number flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black">
                    {step}
                  </span>
                  <p className="mt-3 text-sm font-black leading-5">{title}</p>
                  <p className="mt-1 text-[11px] font-black">{tech}</p>
                  <p className="mt-2 text-xs leading-5">{detail}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mode-impact-panel rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <h3 className="text-base font-black">판단 효과 비교</h3>
            </div>
            <div className="mt-4 grid gap-2">
              {impacts.map(([label, before, after, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    onExplain?.({
                      title: `${label} 개선 효과`,
                      body: `기존 방식은 ${before} 수준이지만, 여민군 적용 시 ${after}으로 정리됩니다.`,
                      chips: [label, before, after],
                    })
                  }
                  className="mode-impact-card grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border p-3 text-left transition"
                >
                  <span className="mode-impact-icon flex h-9 w-9 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{label}</span>
                    <span className="mt-1 block text-xs leading-5">
                      기존 {before} → <strong>{after}</strong>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
