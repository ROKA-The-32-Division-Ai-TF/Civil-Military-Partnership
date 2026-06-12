import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileText,
  Landmark,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { categoryLegend, type CollaborationRequest } from '../data';
import type { AICompanionMessage } from './AICompanion';

export type OperationMode = 'civil' | 'military';

interface ExperienceConsoleProps {
  mode: OperationMode;
  requests: CollaborationRequest[];
  selectedRequest: CollaborationRequest;
  onModeChange: (mode: OperationMode) => void;
  onSelectRequest: (requestId: string) => void;
  onOpenRequests: () => void;
  onOpenMap: () => void;
  onOpenDocuments: () => void;
  onExplain?: (message: AICompanionMessage) => void;
}

const modeProfiles: Record<
  OperationMode,
  {
    label: string;
    title: string;
    description: string;
    operator: string;
    focus: string[];
    icon: LucideIcon;
  }
> = {
  civil: {
    label: '민간용',
    title: '세종시 시민협업 화면',
    description:
      '시민 요청을 접수하고 AI가 담당부서, 협력기관, 필요 자원, 행정문서 초안을 한 번에 정리합니다.',
    operator: '세종시 공무원',
    focus: ['요청 접수', '담당부서 검토', '협업체계 설계'],
    icon: Landmark,
  },
  military: {
    label: '군용',
    title: '군 협력 판단 화면',
    description:
      '지원 필요성, 임무 영향, 장병 안전, 투입 가능 자원을 AI가 구조화해 민군작전 판단을 돕습니다.',
    operator: '민군작전장교',
    focus: ['지원 타당성', '가용 자원', '장병 안전'],
    icon: ShieldCheck,
  },
};

const aiPipeline = [
  ['1', '시민 요청 접수', 'NLP', '요청 내용 자동 분류'],
  ['2', '행정기관 검토', '추천 알고리즘', '협업 필요성 분석'],
  ['3', '협력기관 추천', 'RAG·벡터 검색', '기관·지원방안 추천'],
  ['4', '자원 추천', 'AI 추천 모델', '인력·장비·소요시간 산출'],
  ['5', '협업 수행', '생성형 AI', '공문·계획서 자동 작성'],
  ['6', '결과 관리', '데이터 분석', '성과 데이터 축적'],
];

const impactMetrics: Array<[string, string, string, LucideIcon]> = [
  ['협력기관 선정', '수시간~수일', '수분 이내', Clock3],
  ['유사사례 검색', '개별 검색', '즉시 조회', Network],
  ['공문 작성', '30분~1시간', '5분 이내', FileText],
  ['자원계획 수립', '담당자 경험', 'AI 추천 기반', BrainCircuit],
];

export function ExperienceConsole({
  mode,
  requests,
  selectedRequest,
  onModeChange,
  onSelectRequest,
  onOpenRequests,
  onOpenMap,
  onOpenDocuments,
  onExplain,
}: ExperienceConsoleProps) {
  const profile = modeProfiles[mode];
  const ProfileIcon = profile.icon;
  const selectedPalette = categoryLegend[selectedRequest.category];

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
        <div className="relative overflow-hidden bg-[#071F3A] p-5 text-white sm:p-7">
          <div className="ai-scan-surface absolute inset-0 opacity-45" />
          <div className="relative z-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-emerald-100">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  실시간 AI 협업 설계
                </div>
                <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                  여민군 AI 협업관제센터
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-blue-100">
                  지역사회 문제가 접수되면 AI가 유형을 분류하고, 유사사례·협력기관·필요 자원·문서 초안까지 하나의 협업 구조로 설계합니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/15 bg-white/10 p-1">
                {(['civil', 'military'] as const).map((item) => {
                  const itemProfile = modeProfiles[item];
                  const ItemIcon = itemProfile.icon;
                  const active = mode === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        onModeChange(item);
                        onExplain?.({
                          title: `${itemProfile.label} 화면으로 전환`,
                          body: `${itemProfile.operator} 관점에서 ${itemProfile.focus.join(', ')}을 먼저 보도록 화면을 바꿨습니다.`,
                          chips: [itemProfile.label, itemProfile.operator, '관점 전환'],
                        });
                      }}
                      className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black transition ${
                        active
                          ? 'bg-white text-civicNavy shadow-lg'
                          : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" aria-hidden="true" />
                      {itemProfile.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-white/15 bg-white/[0.08] p-4 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-publicGreen">
                    <ProfileIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-100">{profile.operator}</p>
                    <h3 className="mt-1 text-xl font-black">{profile.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                      {profile.description}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2 text-sm font-bold text-blue-50">
                  {profile.focus.map((item) => (
                    <span key={item} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['접수 요청', '128건', '세종 전 권역'],
                ['AI 설계', '6단계', '분류·추천·문서화'],
                ['문서 초안', '5분 이내', '공문·계획·보고'],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-lg border border-white/15 bg-white/[0.08] p-4">
                  <p className="text-xs font-bold text-blue-100">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-100">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onOpenRequests}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-civicNavy transition hover:bg-blue-50"
              >
                시민 요청 접수
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenMap}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                AI 협업 설계 보기
                <Radar className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenDocuments}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                문서 자동화
                <FileText className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#F8FCFA] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-publicGreen">
                세종 실시간 보드
              </p>
              <h3 className="mt-2 text-xl font-black text-civicNavy">세종 지역문제 스캔</h3>
            </div>
            <span className="rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-black text-publicGreen">
              실시간 분석
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {requests.slice(0, 5).map((request) => {
              const palette = categoryLegend[request.category];
              const selected = request.id === selectedRequest.id;

              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => {
                    onSelectRequest(request.id);
                    onExplain?.({
                      title: `${request.location} 요청 분석`,
                      body: `${request.category} 유형으로 분류했습니다. 유사사례, 협력기관, 필요 자원, 문서 초안을 이어서 설계합니다.`,
                      chips: [request.category, request.priority, 'AI 설계'],
                    });
                  }}
                  className={`grid gap-3 rounded-lg border p-3 text-left transition sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center ${
                    selected
                      ? 'border-publicGreen bg-white shadow-md'
                      : 'border-slate-200 bg-white/70 hover:border-publicGreen/50 hover:bg-white'
                  }`}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: palette.color }}
                  >
                    <Radar className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-5 text-civicNavy">
                      {request.title}
                    </span>
                    <span className="mt-1 block text-xs font-semibold leading-4 text-slate-500">
                      {request.location} · {request.requester}
                    </span>
                  </span>
                  <span
                    className="w-fit rounded-full px-2.5 py-1 text-xs font-black"
                    style={{
                      backgroundColor: palette.bg,
                      color: palette.color,
                    }}
                  >
                    {request.priority}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: selectedPalette.color }}
              >
                <BrainCircuit className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black text-publicGreen">AI 현재 판단</p>
                <p className="mt-1 text-sm font-bold leading-6 text-civicNavy">
                  {selectedRequest.category} 요청입니다. AI가 협업 필요성, 기관 역할, 군 지원 가능 자원, 행정문서 초안을 함께 설계하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-publicGreen">
                  AI 업무 흐름
                </p>
                <h3 className="mt-2 text-xl font-black text-civicNavy">
                  요청부터 결과 관리까지 6단계 자동화
                </h3>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                기획서 기반 서비스 흐름
              </p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {aiPipeline.map(([step, title, tech, detail]) => (
                <button
                  key={step}
                  type="button"
                  onClick={() =>
                    onExplain?.({
                      title: `${title} 단계`,
                      body: `${tech} 기술로 ${detail}을 수행합니다. 이 단계의 결과는 다음 협업 판단으로 이어집니다.`,
                      chips: [`${step}단계`, tech, '자동화'],
                    })
                  }
                  className="rounded-lg border border-slate-200 bg-[#FBFCFA] p-3 text-left transition hover:border-publicGreen/50 hover:bg-white hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF4EF] text-sm font-black text-publicGreen">
                    {step}
                  </span>
                  <p className="mt-3 text-sm font-black leading-5 text-civicNavy">{title}</p>
                  <p className="mt-1 text-[11px] font-black text-[#2563EB]">{tech}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-[#FBFCFA] p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-publicGreen" aria-hidden="true" />
              <h3 className="text-base font-black text-civicNavy">기대효과 비교</h3>
            </div>
            <div className="mt-4 grid gap-2">
              {impactMetrics.map(([label, before, after, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    onExplain?.({
                      title: `${label} 개선 효과`,
                      body: `기존 방식은 ${before} 수준이지만, 여민군 적용 시 ${after}으로 단축하거나 고도화할 수 있습니다.`,
                      chips: [label as string, before as string, after as string],
                    })
                  }
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-publicGreen/50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#2563EB]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-civicNavy">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      기존 {before} → <strong className="text-publicGreen">{after}</strong>
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
