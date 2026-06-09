import {
  Activity,
  Boxes,
  CheckCircle2,
  CircleUserRound,
  Landmark,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ActionChecklist } from './components/ActionChecklist';
import { DocumentModal } from './components/DocumentModal';
import { MapBoard } from './components/MapBoard';
import { ProcessFlow } from './components/ProcessFlow';
import { RequestComposer } from './components/RequestComposer';
import { RequestTable } from './components/RequestTable';
import { ResourcePanel } from './components/ResourcePanel';
import { Sidebar } from './components/Sidebar';
import { SimilarCases } from './components/SimilarCases';
import { StatCard } from './components/StatCard';
import {
  buildDocumentDraft,
  collaborationRequests,
  processSteps,
  resourceRecommendations,
  similarCases,
  type Category,
  type CollaborationRequest,
  type RecommendationResource,
  type RequestDraftInput,
} from './data';

const stats = [
  {
    label: '진행 중 협업',
    value: '12건',
    caption: '세종시 부서와 협력기관이 처리 중',
    icon: Activity,
    color: '#1F7A5C',
  },
  {
    label: '완료된 협업',
    value: '28건',
    caption: '최근 분기 시민 요청 해결 실적',
    icon: CheckCircle2,
    color: '#2F6FDB',
  },
  {
    label: '지원 가능 자원',
    value: '156건',
    caption: '인력, 장비, 차량, 물품 통합 현황',
    icon: Boxes,
    color: '#0B2B4C',
  },
  {
    label: 'AI 추천 완료',
    value: '9건',
    caption: '유사사례 기반 추천 생성 완료',
    icon: Sparkles,
    color: '#B98535',
  },
];

const operatorModes = [
  {
    id: 'civil',
    label: '세종시 공무원',
    description: '요청 접수·부서 협의',
    icon: Landmark,
  },
  {
    id: 'liaison',
    label: '민군작전장교',
    description: '지원 타당성·자원 검토',
    icon: ShieldCheck,
  },
];

const sectionTargets: Record<string, string> = {
  dashboard: 'dashboard',
  requests: 'request-intake',
  analysis: 'analysis-panel',
  resources: 'resource-panel',
  cases: 'similar-cases',
  documents: 'analysis-panel',
  performance: 'process-flow',
  alerts: 'action-checklist',
  settings: 'dashboard',
};

const generatedPositions: Record<Category, Array<{ mapX: number; mapY: number }>> = {
  '환경·정화': [
    { mapX: 43, mapY: 64 },
    { mapX: 57, mapY: 55 },
  ],
  '복지·생활': [
    { mapX: 37, mapY: 42 },
    { mapX: 62, mapY: 45 },
  ],
  지역발전: [
    { mapX: 32, mapY: 70 },
    { mapX: 52, mapY: 66 },
  ],
  '안전·치안': [
    { mapX: 66, mapY: 48 },
    { mapX: 58, mapY: 34 },
  ],
  '교육·문화': [
    { mapX: 50, mapY: 74 },
    { mapX: 42, mapY: 36 },
  ],
  재난대응: [
    { mapX: 70, mapY: 76 },
    { mapX: 61, mapY: 80 },
  ],
};

const generatedAnalysis: Record<Category, {
  summary: string;
  resources: string[];
  partners: string[];
}> = {
  '환경·정화': {
    summary:
      '입력된 요청은 생활권 환경 정비와 배수 취약요소 개선이 결합된 건으로 분석됩니다. 현장 접근로와 토사·폐기물 처리 동선을 함께 확인하면 신속한 조치가 가능합니다.',
    resources: ['장비(굴삭기)', '차량(덤프)', '환경정비 인력'],
    partners: ['세종시 환경정책과', '세종시 건설과', '세종시 자원봉사센터'],
  },
  '복지·생활': {
    summary:
      '생활 불편 해소와 취약계층 지원 성격이 높은 요청입니다. 복지 부서의 대상자 확인과 자원봉사 인력 연계를 함께 진행하는 방식이 적합합니다.',
    resources: ['생활지원 물품', '정리·보수 인력', '소형 화물차'],
    partners: ['세종시 복지정책과', '세종시 자원봉사센터', '지역 사회복지기관'],
  },
  지역발전: {
    summary:
      '지역 편의시설 개선과 생활환경 정비가 포함된 요청입니다. 현장조사 후 시설 보수, 안내체계 개선, 주민 안내를 단계적으로 추진하는 것이 적합합니다.',
    resources: ['현장조사 인력', '정비 장비', '안내시설 자재'],
    partners: ['세종시 지역균형발전과', '읍면동 행정복지센터', '마을공동체 지원기관'],
  },
  '안전·치안': {
    summary:
      '시민 안전과 현장 위험요소 점검이 필요한 요청입니다. 위험 구간 표시, 순찰 동선 협의, 주민 안내를 우선 검토하는 것이 좋습니다.',
    resources: ['안전 점검 인력', '임시 안내물', '순찰 협조'],
    partners: ['세종시 안전정책과', '세종경찰청', '읍면동 행정복지센터'],
  },
  '교육·문화': {
    summary:
      '시민 참여형 교육·문화 지원 요청으로 분석됩니다. 참여자 규모, 이동 동선, 안전관리 요원을 사전에 확정하면 운영 안정성이 높아집니다.',
    resources: ['교육 운영 인력', '체험 교구', '안전관리 요원'],
    partners: ['세종시 교육지원 부서', '세종소방본부', '지역 교육기관'],
  },
  재난대응: {
    summary:
      '재난 예방 또는 초기 대응 성격이 높은 요청입니다. 장비 사전 배치, 현장 통제, 주민 안내 체계를 함께 준비해야 합니다.',
    resources: ['양수 장비', '현장 통제 인력', '주민 안내 채널'],
    partners: ['세종시 재난안전대책본부', '세종소방본부', '육군 제32보병사단'],
  },
};

const generatedResourceTemplates: Record<Category, Array<Omit<RecommendationResource, 'id'>>> = {
  '환경·정화': [
    {
      name: '현장 정비 인력 18명',
      owner: '세종시 자원봉사센터',
      availableDate: '협의 후 확정',
      detail: '생활 쓰레기 수거와 주변 환경정화 지원',
    },
    {
      name: '굴삭기 1대',
      owner: '세종시 건설과',
      availableDate: '협의 후 확정',
      detail: '토사 제거와 배수 흐름 개선 작업 지원',
    },
    {
      name: '폐기물 수거 차량 1대',
      owner: '세종시 환경정책과',
      availableDate: '협의 후 확정',
      detail: '현장 폐기물 반출과 임시 적치 지원',
    },
  ],
  '복지·생활': [
    {
      name: '생활지원 인력 12명',
      owner: '세종시 자원봉사센터',
      availableDate: '협의 후 확정',
      detail: '정리, 물품 이동, 생활 불편 해소 지원',
    },
    {
      name: '생활지원 꾸러미 20세트',
      owner: '지역 사회복지기관',
      availableDate: '협의 후 확정',
      detail: '대상자 생활 안정 물품 지원',
    },
    {
      name: '소형 화물차 1대',
      owner: '세종시 복지정책과',
      availableDate: '협의 후 확정',
      detail: '물품 운반과 폐기물 반출 보조',
    },
  ],
  지역발전: [
    {
      name: '현장조사반 5명',
      owner: '세종시 지역균형발전과',
      availableDate: '협의 후 확정',
      detail: '시설 개선 지점과 주민 동선 확인',
    },
    {
      name: '정비 장비 세트',
      owner: '읍면동 행정복지센터',
      availableDate: '협의 후 확정',
      detail: '소규모 보수와 환경 정비 지원',
    },
    {
      name: '안내시설 자재 1식',
      owner: '마을공동체 지원기관',
      availableDate: '협의 후 확정',
      detail: '임시 안내판과 방향 표식 설치',
    },
  ],
  '안전·치안': [
    {
      name: '안전 점검반 6명',
      owner: '세종시 안전정책과',
      availableDate: '협의 후 확정',
      detail: '위험요소 확인과 개선 필요사항 정리',
    },
    {
      name: '순찰 협조팀',
      owner: '세종경찰청',
      availableDate: '협의 후 확정',
      detail: '취약 시간대 순찰 동선 점검',
    },
    {
      name: '임시 안전 안내물 15개',
      owner: '읍면동 행정복지센터',
      availableDate: '협의 후 확정',
      detail: '주의 구간 표시와 우회 안내',
    },
  ],
  '교육·문화': [
    {
      name: '프로그램 운영 인력 8명',
      owner: '지역 교육기관',
      availableDate: '협의 후 확정',
      detail: '참여자 안내와 프로그램 운영 지원',
    },
    {
      name: '안전교육 지원팀',
      owner: '세종소방본부',
      availableDate: '협의 후 확정',
      detail: '체험형 안전교육 운영',
    },
    {
      name: '안전관리 요원 4명',
      owner: '읍면동 행정복지센터',
      availableDate: '협의 후 확정',
      detail: '참여자 동선과 행사장 안전관리',
    },
  ],
  재난대응: [
    {
      name: '양수 장비 2대',
      owner: '세종시 재난안전대책본부',
      availableDate: '즉시 검토',
      detail: '침수 우려 지점 사전 배치',
    },
    {
      name: '현장 통제 인력 12명',
      owner: '육군 제32보병사단',
      availableDate: '즉시 검토',
      detail: '물자 이동 보조와 접근 통제 지원',
    },
    {
      name: '주민 안내 채널 1식',
      owner: '읍면동 행정복지센터',
      availableDate: '즉시 검토',
      detail: '문자, 마을방송, 안내문 연계',
    },
  ],
};

function formatToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeOperator, setActiveOperator] = useState(operatorModes[0].id);
  const [requests, setRequests] = useState<CollaborationRequest[]>(collaborationRequests);
  const [recommendations, setRecommendations] =
    useState<Record<string, RecommendationResource[]>>(resourceRecommendations);
  const [selectedRequestId, setSelectedRequestId] = useState(
    collaborationRequests[0].id,
  );
  const [activeStepId, setActiveStepId] = useState(processSteps[0].id);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [resourceStatuses, setResourceStatuses] = useState<Record<string, 'requested'>>(
    {},
  );
  const [checklistState, setChecklistState] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const selectedRequest = useMemo(
    () =>
      requests.find((request) => request.id === selectedRequestId) ??
      requests[0] ??
      collaborationRequests[0],
    [requests, selectedRequestId],
  );

  const selectedResources = useMemo(
    () =>
      recommendations[selectedRequest.id] ??
      recommendations[collaborationRequests[0].id],
    [recommendations, selectedRequest.id],
  );

  const documentDraft = useMemo(
    () => buildDocumentDraft(selectedRequest),
    [selectedRequest],
  );

  const dynamicStats = useMemo(() => {
    const generatedCount = Math.max(0, requests.length - collaborationRequests.length);

    return stats.map((stat) => {
      if (stat.label === '진행 중 협업') {
        return { ...stat, value: `${12 + generatedCount}건` };
      }

      if (stat.label === '지원 가능 자원') {
        return { ...stat, value: `${156 + generatedCount * 3}건` };
      }

      if (stat.label === 'AI 추천 완료') {
        return { ...stat, value: `${9 + generatedCount}건` };
      }

      return stat;
    });
  }, [requests.length]);

  const handleSupportRequest = useCallback((resourceId: string) => {
    setResourceStatuses((current) => ({
      ...current,
      [resourceId]: 'requested',
    }));
  }, []);

  const handleMenuSelect = useCallback((menuId: string) => {
    setActiveMenu(menuId);

    if (menuId === 'documents') {
      setDocumentOpen(true);
    }

    const target = sectionTargets[menuId];
    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  const handleCreateRequest = useCallback((input: RequestDraftInput) => {
    const generatedCount = requests.length - collaborationRequests.length;
    const positionOptions = generatedPositions[input.category];
    const position = positionOptions[generatedCount % positionOptions.length];
    const analysis = generatedAnalysis[input.category];
    const requestId = `generated-${Date.now()}`;

    const generatedRequest: CollaborationRequest = {
      id: requestId,
      title: input.title.trim(),
      requester: input.requester.trim(),
      date: formatToday(),
      status: 'AI 분석 완료',
      category: input.category,
      location: input.location.trim(),
      priority: input.priority,
      aiSummary: `${analysis.summary} 요청 내용: ${input.detail.trim()}`,
      neededResources: analysis.resources,
      partners: analysis.partners,
      mapX: position.mapX,
      mapY: position.mapY,
    };

    const generatedResources = generatedResourceTemplates[input.category].map(
      (resource, index) => ({
        ...resource,
        id: `${requestId}-resource-${index + 1}`,
      }),
    );

    setRequests((current) => [generatedRequest, ...current]);
    setRecommendations((current) => ({
      ...current,
      [requestId]: generatedResources,
    }));
    setSelectedRequestId(requestId);
    setActiveMenu('analysis');
    window.requestAnimationFrame(() => {
      document.getElementById('analysis-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [requests.length]);

  const handleToggleChecklistItem = useCallback(
    (itemId: string) => {
      setChecklistState((current) => {
        const currentRequestState = current[selectedRequest.id] ?? {};

        return {
          ...current,
          [selectedRequest.id]: {
            ...currentRequestState,
            [itemId]: !currentRequestState[itemId],
          },
        };
      });
    },
    [selectedRequest.id],
  );

  const currentOperator =
    operatorModes.find((mode) => mode.id === activeOperator) ?? operatorModes[0];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FBFF_0%,#FBFCFA_38%,#F4F8F6_100%)] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar activeMenu={activeMenu} onMenuSelect={handleMenuSelect} />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header id="dashboard" className="scroll-mt-5 mb-6 overflow-hidden rounded-lg border border-white bg-white/90 shadow-panel backdrop-blur">
            <div className="h-1 bg-[linear-gradient(90deg,#0B2B4C_0%,#1F7A5C_52%,#B98535_100%)]" />
            <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-bold text-publicGreen">
                    공동 운용 콘솔
                  </span>
                  <span className="rounded-full border border-[#E7D8BB] bg-[#FFF8EA] px-3 py-1 text-xs font-bold text-[#8A641F]">
                    데모 모드
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-normal text-civicNavy sm:text-4xl">
                  여민용비
                  <span className="ml-2 align-middle text-xl font-bold text-slate-500">
                    與民龍飛
                  </span>
                </h1>
                <p className="mt-2 text-sm font-bold text-publicGreen">
                  AI 기반 민·관·군 협업 의사결정 플랫폼
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  시민 요청을 선택하면 AI가 유사사례, 필요 자원, 협업기관,
                  공문 초안을 한 화면에서 정리합니다.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {['요청 선택', '지원 자원 확인', '공문 생성'].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-porcelain px-3 py-2 text-sm font-bold text-civicNavy"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-publicGreen text-xs text-white">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-[#F8FAF8] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-publicGreen shadow-sm">
                    <CircleUserRound className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-civicNavy">
                      {currentOperator.label}
                    </p>
                    <p className="text-xs text-slate-500">{currentOperator.description}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white p-1">
                  {operatorModes.map((mode) => {
                    const ModeIcon = mode.icon;
                    const active = activeOperator === mode.id;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setActiveOperator(mode.id)}
                        className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-bold transition ${
                          active
                            ? 'bg-civicNavy text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-civicNavy'
                        }`}
                      >
                        <ModeIcon className="h-4 w-4" aria-hidden="true" />
                        {mode.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-white px-3 py-2">
                    <p className="font-bold text-civicNavy">승인 대기</p>
                    <p className="mt-1 text-slate-500">3건</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2">
                    <p className="font-bold text-civicNavy">오늘 추천</p>
                    <p className="mt-1 text-slate-500">9건</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dynamicStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="grid min-w-0 gap-6">
              <div id="request-intake" className="scroll-mt-5">
                <RequestComposer onCreateRequest={handleCreateRequest} />
              </div>
              <MapBoard
                requests={requests}
                selectedRequestId={selectedRequest.id}
                onSelectRequest={setSelectedRequestId}
              />
              <div id="process-flow" className="scroll-mt-5">
                <ProcessFlow
                  steps={processSteps}
                  activeStepId={activeStepId}
                  onStepSelect={setActiveStepId}
                />
              </div>
              <RequestTable
                requests={requests}
                selectedRequestId={selectedRequest.id}
                onSelectRequest={setSelectedRequestId}
              />
              <div id="similar-cases" className="scroll-mt-5">
                <SimilarCases request={selectedRequest} cases={similarCases} />
              </div>
            </div>

            <aside className="grid min-w-0 gap-6 self-start xl:sticky xl:top-6">
              <div id="analysis-panel" className="scroll-mt-5">
                <AnalysisPanel
                  request={selectedRequest}
                  onOpenDocument={() => setDocumentOpen(true)}
                />
              </div>
              <div id="resource-panel" className="scroll-mt-5">
                <ResourcePanel
                  resources={selectedResources}
                  statuses={resourceStatuses}
                  onRequestSupport={handleSupportRequest}
                />
              </div>
              <div id="action-checklist" className="scroll-mt-5">
                <ActionChecklist
                  completedItems={checklistState[selectedRequest.id] ?? {}}
                  onToggleItem={handleToggleChecklistItem}
                />
              </div>
            </aside>
          </section>
        </main>
      </div>

      <DocumentModal
        open={documentOpen}
        request={selectedRequest}
        draft={documentDraft}
        onClose={() => setDocumentOpen(false)}
      />
    </div>
  );
}

export default App;
