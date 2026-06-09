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
import { AnalysisPanel } from './components/AnalysisPanel';
import { ActionChecklist } from './components/ActionChecklist';
import { DocumentModal } from './components/DocumentModal';
import { DocumentWorkspace } from './components/DocumentWorkspace';
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

const viewMeta: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: '업무 홈',
    description: '요청을 선택하고 다음 조치를 바로 실행합니다.',
  },
  requests: {
    title: '협업 요청 관리',
    description: '새 요청을 입력하거나 기존 요청을 검색합니다.',
  },
  analysis: {
    title: 'AI 분석 & 추천',
    description: '선택 요청의 위치, 필요 자원, 협업기관을 확인합니다.',
  },
  resources: {
    title: '자원·지원 관리',
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
    title: '성과 관리',
    description: '협업 절차와 성과 지표를 확인합니다.',
  },
  alerts: {
    title: '알림 센터',
    description: '실행 전 확인해야 할 조치와 회신 상태를 점검합니다.',
  },
  settings: {
    title: '시스템 설정',
    description: '운용자 관점과 데모 데이터를 조정합니다.',
  },
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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_420px]">
      <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
              Current Request
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
              title: 'AI 분석 보기',
              detail: '요약과 협업기관 확인',
              target: 'analysis',
            },
            {
              title: '자원 요청',
              detail: '추천 자원 상태 변경',
              target: 'resources',
            },
            {
              title: '문서 작성',
              detail: '공문·계획서 초안 확인',
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
                열기
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {dynamicStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
              Queue
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
        <div className="mt-4 grid gap-2">
          {requests.slice(0, 5).map((request) => (
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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <MapBoard
        requests={requests}
        selectedRequestId={selectedRequest.id}
        onSelectRequest={setSelectedRequestId}
      />
      <AnalysisPanel request={selectedRequest} onOpenDocument={() => setDocumentOpen(true)} />
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
          Results
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
          Notifications
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
        Settings
      </p>
      <h2 className="mt-2 text-xl font-bold text-civicNavy">시연 환경 설정</h2>
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
          <p className="text-sm font-bold text-civicNavy">데모 데이터</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            발표 중 생성한 요청, 체크리스트, 지원 요청 상태를 초기 상태로 되돌립니다.
          </p>
          <button
            type="button"
            onClick={resetDemo}
            className="mt-4 rounded-lg bg-civicNavy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12395F]"
          >
            데모 초기화
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
                여민용비 · 데모 모드
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
