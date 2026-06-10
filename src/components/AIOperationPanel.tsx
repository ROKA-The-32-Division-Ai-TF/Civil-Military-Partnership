import { BrainCircuit, CheckCircle2, Database, FileText, Network } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CollaborationRequest } from '../data';
import type { AICompanionMessage } from './AICompanion';

interface AIOperationPanelProps {
  request: CollaborationRequest;
  onExplain?: (message: AICompanionMessage) => void;
}

const aiSteps = [
  {
    label: '요청 해석',
    detail: '민원 문장과 위치 정보를 구조화',
    icon: BrainCircuit,
  },
  {
    label: '유사사례 검색',
    detail: '과거 대민지원 사례와 위험요소 대조',
    icon: Database,
  },
  {
    label: '자원 매칭',
    detail: '세종시 자원과 군 지원 가능 범위 비교',
    icon: Network,
  },
  {
    label: '조치안 작성',
    detail: '협조공문과 현장 실행 항목 초안 생성',
    icon: FileText,
  },
];

export function AIOperationPanel({ request, onExplain }: AIOperationPanelProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % aiSteps.length);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [request.id]);

  const progress = ((activeStep + 1) / aiSteps.length) * 100;
  const ActiveIcon = aiSteps[activeStep].icon;

  return (
    <section className="overflow-hidden rounded-lg border border-[#DDEBE3] bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-publicGreen">
            AI 협업 엔진
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">분석 실행 중</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {request.category} 요청을 기준으로 공동 조치안을 갱신하고 있습니다.
          </p>
        </div>
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4EF] text-publicGreen">
          <span className="absolute inset-0 animate-ping rounded-full bg-publicGreen/20" />
          <ActiveIcon className="relative h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-[#FBFCFA] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-civicNavy">{aiSteps[activeStep].label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {aiSteps[activeStep].detail}
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-publicGreen ring-1 ring-emerald-100">
            가동중
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#1F7A5C,#0B7285,#B98535)] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {aiSteps.map((step, index) => {
          const StepIcon = step.icon;
          const active = index === activeStep;
          const done = index < activeStep;

          return (
            <button
              key={step.label}
              type="button"
              onClick={() => {
                setActiveStep(index);
                onExplain?.({
                  title: `AI 단계 실행: ${step.label}`,
                  body: `${step.detail} 단계입니다. "${request.title}" 요청의 ${request.category} 특성을 기준으로 판단 근거를 갱신하고 다음 조치 후보를 좁힙니다.`,
                  chips: [step.label, request.category, '실시간 갱신'],
                });
              }}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                active
                  ? 'border-publicGreen bg-[#F4FAF7]'
                  : 'border-slate-200 bg-white hover:border-publicGreen/60 hover:bg-[#F8FCFA]'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  active || done ? 'bg-publicGreen text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <StepIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-civicNavy">{step.label}</p>
                <p className="truncate text-xs text-slate-500">{step.detail}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
