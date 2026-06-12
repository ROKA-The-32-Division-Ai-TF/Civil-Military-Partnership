import {
  ArrowRight,
  Bell,
  Bot,
  ChevronDown,
  CheckCircle2,
  ClipboardCheck,
  CircleUserRound,
  Handshake,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { AICommandBar } from './components/AICommandBar';
import type { AICompanionMessage } from './components/AICompanion';
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
  categoryLegend,
  collaborationRequests,
  processSteps,
  resourceRecommendations,
  sidebarMenus,
  similarCases,
  type Category,
  type CollaborationRequest,
  type RecommendationResource,
  type RequestDraftInput,
} from './data';

const stats = [
  {
    label: '전체 요청 건수',
    value: '128건',
    caption: '이번 달 +18건 (14.1%↑)',
    icon: ClipboardCheck,
    color: '#2563EB',
  },
  {
    label: '진행 중인 협업',
    value: '27건',
    caption: '이번 달 +7건 (35.0%↑)',
    icon: Handshake,
    color: '#2F9E44',
  },
  {
    label: '완료된 협업',
    value: '96건',
    caption: '이번 달 +11건 (12.9%↑)',
    icon: CheckCircle2,
    color: '#7C3AED',
  },
  {
    label: '군 협력 검토',
    value: '15건',
    caption: '안전·임무 범위 확인 중',
    icon: ShieldCheck,
    color: '#EA7A12',
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
    title: '민군협력 상황지도',
    description: '선택 요청의 위치, 필요 자원, 군 지원 검토 범위를 확인합니다.',
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
  const [aiCompanion, setAiCompanion] = useState<AICompanionMessage>({
    title: '요청을 선택하면 바로 정리합니다',
    body:
      '현장 성격, 세종시 조치, 협력 군부대 검토 범위, 문서 초안을 순서대로 정리합니다.',
    chips: ['요청 확인', '자원 추천', '문서 준비'],
  });

  const triggerAI = useCallback((message: AICompanionMessage) => {
    setAiCompanion(message);
  }, []);

  const explainRequest = useCallback(
    (request: CollaborationRequest, source = '요청 선택') => {
      triggerAI({
        title: `${source}: ${request.category}`,
        body: `${request.location} 현장입니다. 세종시는 통제와 행정 조정을 맡고, 협력 군부대는 인력·장비 지원 가능 범위를 검토하면 됩니다.`,
        chips: [request.priority, request.category, '군 협력 검토'],
      });
    },
    [triggerAI],
  );

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
      if (stat.label === '전체 요청 건수') {
        return { ...stat, value: `${128 + generatedCount}건` };
      }

      if (stat.label === '진행 중인 협업') {
        return { ...stat, value: `${27 + generatedCount}건` };
      }

      if (stat.label === '군 협력 검토') {
        return { ...stat, value: `${15 + generatedCount}건` };
      }

      return stat;
    });
  }, [requests.length]);

  const handleSupportRequest = useCallback(
    (resourceId: string) => {
      const resource = selectedResources.find((item) => item.id === resourceId);

      setResourceStatuses((current) => ({
        ...current,
        [resourceId]: 'requested',
      }));

      if (resource) {
        triggerAI({
          title: '좋아요, 자원 요청 넣었습니다',
          body: `"${resource.name}"은 지금 요청 완료 상태입니다. 다음은 지원 가능일, 이동 동선, 현장 안전 통제만 확인하면 됩니다.`,
          chips: ['자원 확정', resource.owner, '실행 준비'],
          tone: 'success',
        });
      }
    },
    [selectedResources, triggerAI],
  );

  const handleMenuSelect = useCallback((menuId: string) => {
    setActiveMenu(menuId);
    const menuLabel =
      sidebarMenus.find((menu) => menu.id === menuId)?.label ?? '업무 화면';
    const meta = viewMeta[menuId] ?? viewMeta.dashboard;

    triggerAI({
      title: `${menuLabel}로 이동했어요`,
      body: `${meta.description} 필요한 항목을 눌러주시면 제가 바로 판단 포인트를 잡아드릴게요.`,
      chips: ['화면 전환', menuLabel, '업무 안내'],
    });
  }, [triggerAI]);

  const handleSelectRequest = useCallback(
    (requestId: string, source = '요청 선택') => {
      const request = requests.find((item) => item.id === requestId);
      setSelectedRequestId(requestId);

      if (request) {
        explainRequest(request, source);
      }
    },
    [explainRequest, requests],
  );

  const handleAICommand = useCallback(
    (command: 'brief' | 'resources' | 'document') => {
      if (command === 'brief') {
        setActiveMenu('analysis');
        triggerAI({
          title: '상황 브리핑 준비했습니다',
          body: `${selectedRequest.location} 현장입니다. 우선순위는 ${selectedRequest.priority}, 핵심은 위치 확인과 공동 조치 범위 판단입니다.`,
          chips: [selectedRequest.category, selectedRequest.priority, '현장 확인'],
        });
        return;
      }

      if (command === 'resources') {
        setActiveMenu('resources');
        triggerAI({
          title: '추천 자원을 열었습니다',
          body: `지금은 ${selectedResources.length}개 자원이 맞춰져 있어요. 먼저 필요한 인력과 차량부터 요청하면 실행 준비가 빨라집니다.`,
          chips: [`${selectedResources.length}건`, '인력·장비', '지원 요청'],
        });
        return;
      }

      setDocumentOpen(true);
      triggerAI({
        title: '문서 초안을 열었습니다',
        body: '협조공문, 지원계획서, 결과보고서 순서로 정리했습니다. 필요한 문서를 선택해 검토하면 됩니다.',
        chips: ['공문', '계획서', '보고서'],
        tone: 'success',
      });
    },
    [selectedRequest, selectedResources.length, triggerAI],
  );

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
    triggerAI({
      title: '요청 분석을 만들었습니다',
      body: `"${generatedRequest.title}"은 ${input.category} 유형으로 보입니다. 지도에 위치를 올리고, 필요한 자원과 협력 흐름까지 준비해둘게요.`,
      chips: [input.category, input.priority, '분석 생성'],
      tone: 'success',
    });
  }, [requests.length, triggerAI]);

  const handleToggleChecklistItem = useCallback(
    (itemId: string) => {
      setChecklistState((current) => {
        const currentRequestState = current[selectedRequest.id] ?? {};
        const nextValue = !currentRequestState[itemId];

        return {
          ...current,
          [selectedRequest.id]: {
            ...currentRequestState,
            [itemId]: nextValue,
          },
        };
      });
      triggerAI({
        title: '체크했습니다',
        body: `좋습니다. "${selectedRequest.title}"의 준비 상태를 갱신했어요. 남은 건 안전, 동선, 기관 회신 순서로 보면 됩니다.`,
        chips: ['안전 확인', '기관 회신', '준비도 갱신'],
        tone: 'success',
      });
    },
    [selectedRequest.title, selectedRequest.id, triggerAI],
  );

  const resetWorkspace = () => {
    setRequests(collaborationRequests);
    setRecommendations(resourceRecommendations);
    setSelectedRequestId(collaborationRequests[0].id);
    setResourceStatuses({});
    setChecklistState({});
    setActiveMenu('dashboard');
    triggerAI({
      title: '처음 상태로 정리했습니다',
      body: '화면을 다시 기본 상태로 돌렸습니다. 대시보드에서 요청 하나를 누르면 분석 흐름을 바로 이어갈 수 있어요.',
      chips: ['상태 복원', '기본 데이터', '대시보드'],
    });
  };

  const statusSummary = [
    ['검토 대기', '35건', '27.3%', '#CBD5E1'],
    ['검토 중', '20건', '15.6%', '#4F6FED'],
    ['협업 진행 중', '27건', '21.1%', '#4BB262'],
    ['완료', '46건', '35.9%', '#2F9E44'],
  ];

  const categorySummary = [
    ['재난복구', '28건', '21.9%', '#0B7285'],
    ['환경정화', '32건', '25.0%', '#1F7A5C'],
    ['시설·물자', '18건', '14.1%', '#2F6FDB'],
    ['교육·체험', '22건', '17.2%', '#805AD5'],
    ['행사지원', '16건', '12.5%', '#B98535'],
    ['농촌지원', '12건', '9.4%', '#7A6A1F'],
  ];

  const stageSummary = [
    ['요청 접수', '35건'],
    ['AI 분석', '20건'],
    ['군 협력 검토', '15건'],
    ['협업 진행', '27건'],
    ['완료', '46건'],
  ];

  const partnerSummary = [
    ['행정기관', '18개', '총괄·조정, 행정 지원'],
    ['협력 군부대', '7개', '인력·장비 지원, 안전 지원'],
    ['공공기관', '6개', '기술·전문 지원'],
    ['민간단체/협회', '5개', '자문·인력 지원'],
  ];

  const aiInsights = [
    ['유사 사례 추천', '금강변 환경정화 활동과 유사한 사례가 확인되었습니다.', '사례 보기'],
    ['추천 협력기관', '요청 유형에 적합한 협력 조합을 제안합니다.', '기관 보기'],
    ['필요 자원 예측', '예상 필요 인원 25명, 장비 3대 수준입니다.', '자원 보기'],
    ['예상 소요 기간', '우선 처리 기준 평균 1.5일이 소요됩니다.', '상세 보기'],
  ];

  const dashboardView = (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dynamicStats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            onClick={() =>
              triggerAI({
                title: `${stat.label} 확인`,
                body: `현재 ${stat.value}입니다. 제가 변화 폭과 처리 단계를 같이 보고, 오늘 먼저 챙길 요청을 골라드릴게요.`,
                chips: ['지표 해석', stat.value, '우선순위'],
              })
            }
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-civicNavy">협업 요청 현황</h2>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-civicNavy"
            >
              전체
            </button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
            <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-[conic-gradient(#CBD5E1_0_27.3%,#4F6FED_27.3%_42.9%,#4BB262_42.9%_64%,#2F9E44_64%_100%)]">
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span className="text-sm font-bold text-slate-600">총</span>
                <strong className="mt-1 text-2xl font-black text-civicNavy">128건</strong>
              </div>
            </div>

            <div className="grid gap-3">
              {statusSummary.map(([label, count, ratio, color]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    triggerAI({
                      title: `${label} 상태를 봤습니다`,
                      body: `${count}, 전체 ${ratio}입니다. 오래 머문 요청과 협력 검토가 필요한 요청을 먼저 추려볼게요.`,
                      chips: [label, count, ratio],
                    })
                  }
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-[#F7FAFF]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-slate-600">{label}</span>
                  </div>
                  <span className="font-bold text-civicNavy">
                    {count} <span className="font-medium text-slate-500">({ratio})</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-civicNavy">최근 협업 요청 목록</h2>
            <button
              type="button"
              onClick={() => handleMenuSelect('requests')}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#2563EB]"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
            {requests.slice(0, 4).map((request, index) => {
              const palette = categoryLegend[request.category];
              const statusLabel = ['검토 대기', '검토 중', '협업 진행 중', '완료'][index] ?? request.status;

              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => {
                    handleSelectRequest(request.id, '최근 목록');
                    setActiveMenu('analysis');
                  }}
                  className="grid w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-[#F7FAFF] md:grid-cols-[110px_minmax(0,1fr)_120px_120px] md:items-center"
                >
                  <span
                    className="w-fit rounded-md px-3 py-1 text-xs font-black"
                    style={{ backgroundColor: palette.bg, color: palette.color }}
                  >
                    {statusLabel}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-civicNavy">
                      {request.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {request.category} · {request.location}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-slate-600">{request.date}</span>
                  <span className="text-sm font-semibold text-slate-600">{request.requester}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <h2 className="text-lg font-black text-civicNavy">협업 단계별 현황</h2>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {stageSummary.map(([label, count], index) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  triggerAI({
                    title: `${label} 단계 확인`,
                    body: `${label} 단계에는 ${count}이 있습니다. 지금 필요한 건 승인, 회신, 안전 확인 중 무엇인지 바로 좁혀보겠습니다.`,
                    chips: [`${index + 1}단계`, count, '다음 조치'],
                  })
                }
                className="min-w-0 rounded-lg p-1 text-center transition hover:bg-[#F7FAFF]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-blue-200 bg-[#F7FAFF] text-sm font-black text-[#2563EB]">
                  {index + 1}
                </div>
                <p className="mt-2 truncate text-xs font-bold text-civicNavy">{label}</p>
                <p className="mt-1 text-sm font-black text-slate-700">{count}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-slate-100 bg-[#FBFCFA] p-3 text-sm leading-6 text-slate-600">
            최근 알림: {selectedRequest.title}의 협력 검토가 갱신되었습니다.
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <h2 className="text-lg font-black text-civicNavy">분야별 요청 현황</h2>
          <div className="mt-5 grid gap-3">
            {categorySummary.map(([label, count, ratio, color]) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  triggerAI({
                    title: `${label} 분야 분석`,
                    body: `${count}, 전체 ${ratio}입니다. 이 분야는 세종시가 맡을 일과 협력 군부대가 도울 일을 분리해서 보는 게 핵심입니다.`,
                    chips: [label, count, ratio],
                  })
                }
                className="grid grid-cols-[88px_minmax(0,1fr)_92px] items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-[#F7FAFF]"
              >
                <span className="font-bold text-slate-600">{label}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: ratio, backgroundColor: color }}
                  />
                </div>
                <span className="text-right font-bold text-civicNavy">
                  {count} <span className="font-medium text-slate-500">({ratio})</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-civicNavy">협력 기관 현황</h2>
            <button
              type="button"
              onClick={() =>
                triggerAI({
                  title: '협력기관 네트워크',
                  body: '세종시가 중심을 잡고, 필요한 역할만 연결합니다. 행정, 장비, 인력, 전문 지원을 과하지 않게 맞춰볼게요.',
                  chips: ['기관 역할', '협업 조합', '중복 방지'],
                })
              }
              className="text-sm font-bold text-[#2563EB]"
            >
              전체 보기
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-100">
            <div className="grid grid-cols-[1fr_80px_1.4fr] bg-slate-50 px-3 py-2 text-xs font-black text-slate-600">
              <span>기관 유형</span>
              <span>기관 수</span>
              <span>주요 역할</span>
            </div>
            {partnerSummary.map(([type, count, role]) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  triggerAI({
                    title: `${type} 역할 분석`,
                    body: `${type}은 ${count}가 참여합니다. 이 역할은 "${role}"입니다. 필요한 순간에 필요한 만큼만 연결하겠습니다.`,
                    chips: [type, count, '역할 매칭'],
                  })
                }
                className="grid grid-cols-[1fr_80px_1.4fr] border-t border-slate-100 px-3 py-3 text-left text-sm transition hover:bg-[#F7FAFF]"
              >
                <span className="font-bold text-slate-700">{type}</span>
                <span className="font-bold text-civicNavy">{count}</span>
                <span className="text-slate-600">{role}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="overflow-hidden rounded-lg border border-[#8CB4FF] bg-white p-5 shadow-panel">
          <div className="grid gap-5 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#263CCB] text-white shadow-lg shadow-blue-900/20">
              <Bot className="h-9 w-9" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#173E70]">AI 추천 인사이트</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {aiInsights.map(([title, detail, action]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => {
                      setActiveMenu('analysis');
                      triggerAI({
                        title,
                        body: `${detail} 지금 선택한 요청을 기준으로 사례, 기관, 자원, 예상 기간을 한 번에 다시 맞춰보겠습니다.`,
                        chips: [action, selectedRequest.category, '재계산'],
                      });
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[#2563EB] hover:bg-[#F7FAFF]"
                  >
                    <span className="block text-sm font-black text-civicNavy">{title}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-600">{detail}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#2563EB]">
                      {action}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <AIOperationPanel request={selectedRequest} onExplain={triggerAI} />
      </div>
    </div>
  );

  const requestView = (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <RequestComposer onCreateRequest={handleCreateRequest} onExplain={triggerAI} />
      <RequestTable
        requests={requests}
        selectedRequestId={selectedRequest.id}
        onSelectRequest={(requestId) => handleSelectRequest(requestId, '요청 목록')}
      />
    </div>
  );

  const analysisView = (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <MapBoard
          requests={requests}
          selectedRequestId={selectedRequest.id}
          onSelectRequest={(requestId) => handleSelectRequest(requestId, '지도 마커')}
          onExplain={triggerAI}
        />
        <AnalysisPanel
          request={selectedRequest}
          onOpenDocument={() => {
            setDocumentOpen(true);
            triggerAI({
              title: '문서 초안 준비 완료',
              body: `"${selectedRequest.title}" 기준으로 협조공문, 지원계획서, 결과보고서를 정리했습니다. 문구만 확인하면 바로 발표 시연이 됩니다.`,
              chips: ['공문 초안', '계획서', '결과보고서'],
              tone: 'success',
            });
          }}
        />
      </div>
      <JointActionPlan request={selectedRequest} onExplain={triggerAI} />
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
        onExplain={triggerAI}
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
                  onClick={() => {
                    setActiveOperator(mode.id);
                    triggerAI({
                      title: `${mode.label} 관점 적용`,
                      body: `${mode.description} 중심으로 보겠습니다. 같은 요청도 담당 역할에 맞춰 문서, 자원, 검토 순서를 다르게 잡아드릴게요.`,
                      chips: [mode.label, '운용 관점', '우선순위'],
                    });
                  }}
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
            onClick={resetWorkspace}
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
            ? <SimilarCases request={selectedRequest} cases={similarCases} onExplain={triggerAI} />
            : activeMenu === 'documents'
              ? <DocumentWorkspace request={selectedRequest} draft={documentDraft} onExplain={triggerAI} />
              : activeMenu === 'performance'
                ? performanceView
                : activeMenu === 'alerts'
                  ? alertView
                  : activeMenu === 'settings'
                    ? settingsView
                    : dashboardView;

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar activeMenu={activeMenu} onMenuSelect={handleMenuSelect} />

        <main className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-7 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-950">
                  민·관·군 협업상황실
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  세종시 접수, 군 지원 검토, 현장 실행까지 한 화면에서 처리합니다.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => handleMenuSelect('alerts')}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F7FE] text-civicNavy transition hover:bg-[#EEF3FF]"
                  aria-label="알림"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                    3
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu('settings');
                    triggerAI({
                      title: '운용자 화면 설정',
                      body: '세종시 공무원 관점과 민군작전장교 관점을 바꿔볼 수 있습니다. 역할별로 먼저 봐야 할 항목을 정리합니다.',
                      chips: ['운용자 관점', '업무 설정', '화면 전환'],
                    });
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-1 text-left transition hover:bg-[#F5F7FE]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF3FF] text-[#3157B7]">
                    <CircleUserRound className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-civicNavy">민군협력담당관</p>
                    <p className="text-xs font-semibold text-slate-500">
                      세종특별자치시 · 협력 군부대
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu('requests');
                    triggerAI({
                      title: '새 요청 접수 준비',
                      body: '요청 제목, 기관, 위치만 넣어주세요. 유형 분류, 필요 자원, 협력 흐름은 제가 바로 초안으로 잡겠습니다.',
                      chips: ['요청 접수', '자동 분류', '분석 생성'],
                    });
                  }}
                  className="rounded-lg bg-civicNavy px-4 py-3 text-sm font-bold text-white transition hover:bg-[#12395F]"
                >
                  새 요청 접수
                </button>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <AICommandBar
              request={selectedRequest}
              resources={selectedResources}
              message={aiCompanion}
              onCommand={handleAICommand}
            />
            {activeView}
          </div>
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
