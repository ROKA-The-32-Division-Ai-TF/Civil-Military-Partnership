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
import { DocumentModal } from './components/DocumentModal';
import { MapBoard } from './components/MapBoard';
import { ProcessFlow } from './components/ProcessFlow';
import { RequestTable } from './components/RequestTable';
import { ResourcePanel } from './components/ResourcePanel';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import {
  buildDocumentDraft,
  collaborationRequests,
  processSteps,
  resourceRecommendations,
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

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeOperator, setActiveOperator] = useState(operatorModes[0].id);
  const [selectedRequestId, setSelectedRequestId] = useState(
    collaborationRequests[0].id,
  );
  const [activeStepId, setActiveStepId] = useState(processSteps[0].id);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [resourceStatuses, setResourceStatuses] = useState<Record<string, 'requested'>>(
    {},
  );

  const selectedRequest = useMemo(
    () =>
      collaborationRequests.find((request) => request.id === selectedRequestId) ??
      collaborationRequests[0],
    [selectedRequestId],
  );

  const selectedResources = useMemo(
    () =>
      resourceRecommendations[selectedRequest.id] ??
      resourceRecommendations[collaborationRequests[0].id],
    [selectedRequest.id],
  );

  const documentDraft = useMemo(
    () => buildDocumentDraft(selectedRequest),
    [selectedRequest],
  );

  const handleSupportRequest = useCallback((resourceId: string) => {
    setResourceStatuses((current) => ({
      ...current,
      [resourceId]: 'requested',
    }));
  }, []);

  const currentOperator =
    operatorModes.find((mode) => mode.id === activeOperator) ?? operatorModes[0];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FBFF_0%,#FBFCFA_38%,#F4F8F6_100%)] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar activeMenu={activeMenu} onMenuSelect={setActiveMenu} />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-6 overflow-hidden rounded-lg border border-white bg-white/90 shadow-panel backdrop-blur">
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
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="grid min-w-0 gap-6">
              <MapBoard
                requests={collaborationRequests}
                selectedRequestId={selectedRequest.id}
                onSelectRequest={setSelectedRequestId}
              />
              <ProcessFlow
                steps={processSteps}
                activeStepId={activeStepId}
                onStepSelect={setActiveStepId}
              />
              <RequestTable
                requests={collaborationRequests}
                selectedRequestId={selectedRequest.id}
                onSelectRequest={setSelectedRequestId}
              />
            </div>

            <aside className="grid min-w-0 gap-6 self-start xl:sticky xl:top-6">
              <AnalysisPanel
                request={selectedRequest}
                onOpenDocument={() => setDocumentOpen(true)}
              />
              <ResourcePanel
                resources={selectedResources}
                statuses={resourceStatuses}
                onRequestSupport={handleSupportRequest}
              />
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
