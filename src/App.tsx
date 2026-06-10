import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  CircleUserRound,
  Landmark,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { AIOperationPanel } from './components/AIOperationPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ActionChecklist } from './components/ActionChecklist';
import { DocumentModal } from './components/DocumentModal';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { JointActionPlan } from './components/JointActionPlan';
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
    caption: '세종시와 협력 군부대가 처리 중',
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
    caption: '대민지원 인력, 장비, 차량, 물자',
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

const viewMeta: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: '업무 홈',
    description: '세종시 대민지원 요청을 선택하고 다음 조치를 바로 실행합니다.',
  },
  requests: {
    title: '협업 요청 관리',
    description: '새 요청을 입력하거나 기존 요청을 검색합니다.',
  },
  analysis: {
    title: 'AI 상황지도',
    description: '선택 요청의 위치, 필요 자원, 군 협력 필요성을 확인합니다.',
  },
  resources: {
    title: '자원 요청',
    description: '추천 자원을 요청하고 실행 준비 상태를 체크합니다.',
  },
  cases: {
    title: '유사사례 검색',
    description: '과거 사례를 확인해 판단 근거를 빠르게 확보합니다.',
  },
  documents: {
    title: '공문·계획서 작성',
    description: '협조공문, 지원계획서, 결과보고서 초안을 확인합니다.',
  },
  performance: {
    title: '성과 보기',
    description: '협업 절차와 성과 지표를 확인합니다.',
  },
  alerts: {
    title: '알림 센터',
    description: '실행 전 확인해야 할 조치와 회신 상태를 점검합니다.',
  },
  settings: {
    title: '시스템 설정',
    description: '운용자 관점과 화면 상태를 조정합니다.',
  },
};

const generatedPositions: Record<Category, Array<{ mapX: number; mapY: number }>> = {
  재난복구: [
    { mapX: 61, mapY: 73 },
    { mapX: 50, mapY: 34 },
  ],
  환경정화: [
    { mapX: 55, mapY: 47 },
    { mapX: 44, mapY: 55 },
  ],
  '시설·물자': [
    { mapX: 66, mapY: 57 },
    { mapX: 42, mapY: 18 },
  ],
  농촌지원: [
    { mapX: 33, mapY: 63 },
    { mapX: 38, mapY: 31 },
  ],
  '교육·체험': [
    { mapX: 53, mapY: 66 },
    { mapX: 58, mapY: 40 },
  ],
  행사지원: [
    { mapX: 47, mapY: 26 },
    { mapX: 49, mapY: 50 },
  ],
};

const generatedAnalysis: Record<Category, {
  summary: string;
  resources: string[];
  partners: string[];
}> = {
  재난복구: {
    summary:
      '입력된 요청은 재난 이후 응급 복구 대민지원 건으로 분석됩니다. 세종시 현장 확인, 장비 접근로, 안전 통제 범위를 먼저 정리한 뒤 협력 군부대의 인력·장비 지원 가능성을 검토하는 방식이 적합합니다.',
    resources: ['복구 장비', '현장 정비 인력', '운반 차량', '안전 통제선'],
    partners: ['세종특별자치시 재난관리부서', '협력 군부대'],
  },
  환경정화: {
    summary:
      '입력된 요청은 하천·생활권 환경정화 대민지원 건으로 분석됩니다. 현장 범위가 넓거나 단기간 집중 정비가 필요한 경우 세종시 수거 체계와 협력 군부대 정비 인력을 함께 배치할 수 있습니다.',
    resources: ['환경정비 인력', '폐기물 수거 차량', '안전 안내물'],
    partners: ['세종특별자치시 환경관리부서', '협력 군부대'],
  },
  '시설·물자': {
    summary:
      '입력된 요청은 재난 대비 물자 또는 시설 응급 조치가 필요한 건으로 분석됩니다. 세종시가 배치 지점과 우선순위를 지정하고 협력 군부대가 운반·적재·현장 보조를 검토하는 구조가 적합합니다.',
    resources: ['물자 운반 차량', '적재 인력', '응급 보수 자재'],
    partners: ['세종특별자치시 재난관리부서', '협력 군부대'],
  },
  농촌지원: {
    summary:
      '입력된 요청은 농번기 단기 인력 지원 성격의 대민지원 건입니다. 대상 농가, 작업 시간, 안전 수칙을 세종시가 확정한 뒤 협력 군부대의 제한적 일손돕기를 검토할 수 있습니다.',
    resources: ['일손돕기 인력', '소형 운반 차량', '작업 안전용품'],
    partners: ['세종특별자치시 농업지원부서', '협력 군부대'],
  },
  '교육·체험': {
    summary:
      '입력된 요청은 시민 대상 재난안전 교육·체험 지원 건으로 분석됩니다. 세종시가 교육 목적과 대상자를 관리하고 협력 군부대는 물자 전시, 안전 안내, 체험 보조 범위에서 참여하는 방식이 적합합니다.',
    resources: ['교육 보조 인력', '재난 대비 물자 전시', '안전 안내 요원'],
    partners: ['세종특별자치시 안전교육부서', '협력 군부대'],
  },
  행사지원: {
    summary:
      '입력된 요청은 공공·보훈행사 운영을 위한 제한적 현장 지원 건으로 분석됩니다. 세종시가 행사 운영을 주관하고 협력 군부대는 물자 설치, 정리, 동선 안내 보조 범위에서 참여할 수 있습니다.',
    resources: ['행사용 물자', '설치 보조 인력', '동선 안내 표지'],
    partners: ['세종특별자치시 행사·보훈업무부서', '협력 군부대'],
  },
};

const generatedResourceTemplates: Record<Category, Array<Omit<RecommendationResource, 'id'>>> = {
  재난복구: [
    {
      name: '응급 복구 인력 18명',
      owner: '협력 군부대',
      availableDate: '즉시 검토',
      detail: '토사 정리, 마대 적재, 현장 정비 보조',
    },
    {
      name: '복구 장비 1식',
      owner: '세종특별자치시 재난관리부서',
      availableDate: '협의 후 확정',
      detail: '배수로 정비와 응급 복구 장비 지원',
    },
    {
      name: '운반 차량 1대',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '복구 물자와 현장 폐기물 이동 보조',
    },
  ],
  환경정화: [
    {
      name: '환경정비 인력 20명',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '하천변 부유물과 생활폐기물 수거 지원',
    },
    {
      name: '폐기물 수거 차량 1대',
      owner: '세종특별자치시 환경관리부서',
      availableDate: '협의 후 확정',
      detail: '수거물 반출과 임시 적치장 이동',
    },
    {
      name: '현장 안전물품 1식',
      owner: '세종특별자치시 환경관리부서',
      availableDate: '협의 후 확정',
      detail: '작업 장갑, 마대, 안내 표지 지원',
    },
  ],
  '시설·물자': [
    {
      name: '물자 운반 차량 2대',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '예방 물자와 응급 보수 자재 운반',
    },
    {
      name: '적재 인력 12명',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '모래주머니, 제설 자재, 임시 물자 적재',
    },
    {
      name: '응급 보수 자재',
      owner: '세종특별자치시 재난관리부서',
      availableDate: '협의 후 확정',
      detail: '현장별 사전 배치 물자 지원',
    },
  ],
  농촌지원: [
    {
      name: '일손돕기 인력 16명',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '고령농가 단기 작업 보조',
    },
    {
      name: '소형 운반 차량 1대',
      owner: '세종특별자치시 농업지원부서',
      availableDate: '협의 후 확정',
      detail: '작업 도구와 수확물 이동 보조',
    },
    {
      name: '작업 안전용품 30세트',
      owner: '세종특별자치시 농업지원부서',
      availableDate: '협의 후 확정',
      detail: '장갑, 팔토시, 현장 안내물 지원',
    },
  ],
  '교육·체험': [
    {
      name: '교육 보조 인력 8명',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '체험 부스 안내와 참여자 안전 보조',
    },
    {
      name: '재난 대비 물자 전시 세트',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '시민 체험용 전시 물자와 설명 보조',
    },
    {
      name: '교육장 운영 지원',
      owner: '세종특별자치시 안전교육부서',
      availableDate: '협의 후 확정',
      detail: '참여자 접수, 동선 관리, 사전 안내',
    },
  ],
  행사지원: [
    {
      name: '행사 설치 보조 인력 12명',
      owner: '협력 군부대',
      availableDate: '협의 후 확정',
      detail: '행사장 물자 설치와 종료 후 정리 지원',
    },
    {
      name: '행사용 물자 1식',
      owner: '세종특별자치시 행사·보훈업무부서',
      availableDate: '협의 후 확정',
      detail: '의자, 천막, 안내 표식 설치',
    },
    {
      name: '동선 안내 표지 20개',
      owner: '세종특별자치시 행사·보훈업무부서',
      availableDate: '협의 후 확정',
      detail: '참여자 이동 동선과 안전 구역 안내',
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
  const page = viewMeta[activeMenu] ?? viewMeta.dashboard;

  const resetDemo = () => {
    setRequests(collaborationRequests);
    setRecommendations(resourceRecommendations);
    setSelectedRequestId(collaborationRequests[0].id);
    setResourceStatuses({});
    setChecklistState({});
    setActiveMenu('dashboard');
  };

  const dashboardView = (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
                선택 요청
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-civicNavy">
                {selectedRequest.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {selectedRequest.requester} · {selectedRequest.location} · {selectedRequest.date}
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-bold text-publicGreen">
              {selectedRequest.status}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                title: 'AI 분석',
                detail: '위치·위험도·군 협력 필요성 확인',
                action: '분석',
                target: 'analysis',
              },
              {
                title: '자원 요청',
                detail: '인력·장비 지원 상태 변경',
                action: '요청',
                target: 'resources',
              },
              {
                title: '문서 작성',
                detail: '협조공문·계획서 초안 생성',
                action: '작성',
                target: 'documents',
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveMenu(item.target)}
                className="group rounded-lg border border-slate-200 bg-porcelain p-4 text-left transition hover:-translate-y-0.5 hover:border-publicGreen hover:bg-white hover:shadow-md"
              >
                <span className="block text-sm font-bold text-civicNavy">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-publicGreen">
                  {item.action}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>

        </section>

        <AIOperationPanel request={selectedRequest} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dynamicStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <JointActionPlan request={selectedRequest} />

      <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
              요청 목록
            </p>
            <h2 className="mt-2 text-lg font-bold text-civicNavy">최근 요청</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveMenu('requests')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-civicNavy transition hover:border-publicGreen hover:text-publicGreen"
          >
            전체 보기
          </button>
        </div>
        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {requests.slice(0, 6).map((request) => (
            <button
              key={request.id}
              type="button"
              onClick={() => setSelectedRequestId(request.id)}
              className={`rounded-lg border p-3 text-left transition ${
                selectedRequest.id === request.id
                  ? 'border-publicGreen bg-[#F4FAF7]'
                  : 'border-slate-200 bg-porcelain hover:bg-white'
              }`}
            >
              <span className="block text-sm font-bold text-civicNavy">{request.title}</span>
              <span className="mt-1 block text-xs text-slate-500">
                {request.requester} · {request.status}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const requestView = (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <RequestComposer onCreateRequest={handleCreateRequest} />
      <RequestTable
        requests={requests}
        selectedRequestId={selectedRequest.id}
        onSelectRequest={setSelectedRequestId}
      />
    </div>
  );

  const analysisView = (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <MapBoard
          requests={requests}
          selectedRequestId={selectedRequest.id}
          onSelectRequest={setSelectedRequestId}
        />
        <AnalysisPanel request={selectedRequest} onOpenDocument={() => setDocumentOpen(true)} />
      </div>
      <JointActionPlan request={selectedRequest} />
    </div>
  );

  const resourceView = (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <ResourcePanel
        resources={selectedResources}
        statuses={resourceStatuses}
        onRequestSupport={handleSupportRequest}
      />
      <ActionChecklist
        completedItems={checklistState[selectedRequest.id] ?? {}}
        onToggleItem={handleToggleChecklistItem}
      />
    </div>
  );

  const performanceView = (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <ProcessFlow
        steps={processSteps}
        activeStepId={activeStepId}
        onStepSelect={setActiveStepId}
      />
      <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
          성과 지표
        </p>
        <h2 className="mt-2 text-lg font-bold text-civicNavy">성과 요약</h2>
        <div className="mt-5 grid gap-3">
          {[
            ['평균 분석 시간', '2분 10초'],
            ['문서 작성 절감', '약 70%'],
            ['협업 만족도', '92점'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-porcelain p-4">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-civicNavy">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const alertView = (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
          알림
        </p>
        <h2 className="mt-2 text-lg font-bold text-civicNavy">오늘 확인할 알림</h2>
        <div className="mt-5 grid gap-3">
          {[
            ['협업기관 회신 대기', '추천 자원 1건의 지원 가능 여부 확인이 필요합니다.'],
            ['안전조치 확인', '현장 통제선과 장비 접근로 확인 항목이 남아 있습니다.'],
            ['문서 검토', '지원계획서 초안 확인 후 PDF 내보내기를 진행할 수 있습니다.'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-porcelain p-4">
              <p className="text-sm font-bold text-civicNavy">{title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>
      <ActionChecklist
        completedItems={checklistState[selectedRequest.id] ?? {}}
        onToggleItem={handleToggleChecklistItem}
      />
    </div>
  );

  const settingsView = (
    <section className="max-w-3xl rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
        설정
      </p>
      <h2 className="mt-2 text-xl font-bold text-civicNavy">운용 환경 설정</h2>
      <div className="mt-5 grid gap-4">
        <div className="rounded-lg border border-slate-200 bg-porcelain p-4">
          <p className="text-sm font-bold text-civicNavy">운용자 화면</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {operatorModes.map((mode) => {
              const ModeIcon = mode.icon;
              const active = activeOperator === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveOperator(mode.id)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                    active
                      ? 'border-civicNavy bg-white text-civicNavy shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-publicGreen'
                  }`}
                >
                  <ModeIcon className="h-5 w-5" />
                  <span>
                    <span className="block text-sm font-bold">{mode.label}</span>
                    <span className="text-xs">{mode.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-porcelain p-4">
          <p className="text-sm font-bold text-civicNavy">화면 상태</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            생성한 요청, 체크리스트, 지원 요청 상태를 초기 상태로 되돌립니다.
          </p>
          <button
            type="button"
            onClick={resetDemo}
            className="mt-4 rounded-lg bg-civicNavy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12395F]"
          >
            화면 초기화
          </button>
        </div>
      </div>
    </section>
  );

  const activeView =
    activeMenu === 'requests'
      ? requestView
      : activeMenu === 'analysis'
        ? analysisView
        : activeMenu === 'resources'
          ? resourceView
          : activeMenu === 'cases'
            ? <SimilarCases request={selectedRequest} cases={similarCases} />
            : activeMenu === 'documents'
              ? <DocumentWorkspace request={selectedRequest} draft={documentDraft} />
              : activeMenu === 'performance'
                ? performanceView
                : activeMenu === 'alerts'
                  ? alertView
                  : activeMenu === 'settings'
                    ? settingsView
                    : dashboardView;

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar activeMenu={activeMenu} onMenuSelect={handleMenuSelect} />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-publicGreen">
                여민군 통합 관제
              </p>
              <h1 className="mt-1 text-2xl font-bold text-civicNavy">{page.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{page.description}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-porcelain px-3 py-2">
                <CircleUserRound className="h-5 w-5 text-publicGreen" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-civicNavy">{currentOperator.label}</p>
                  <p className="text-xs text-slate-500">{currentOperator.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMenu('requests')}
                className="rounded-lg bg-civicNavy px-4 py-3 text-sm font-bold text-white transition hover:bg-[#12395F]"
              >
                새 요청 접수
              </button>
            </div>
          </header>

          {activeView}
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
