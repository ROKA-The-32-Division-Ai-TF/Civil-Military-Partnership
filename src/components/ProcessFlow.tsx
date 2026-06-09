import type { ProcessStep } from '../data';

interface ProcessFlowProps {
  steps: ProcessStep[];
  activeStepId: string;
  onStepSelect: (stepId: string) => void;
}

export function ProcessFlow({ steps, activeStepId, onStepSelect }: ProcessFlowProps) {
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];

  return (
    <section className="min-w-0 rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            Workflow
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">
            민·관·군 협업 프로세스
          </h2>
        </div>
        <p className="text-sm text-slate-500">단계를 클릭하면 설명이 바뀝니다.</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        {steps.map((step, index) => {
          const active = step.id === activeStepId;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect(step.id)}
              className={`relative rounded-lg border p-4 text-left transition ${
                active
                  ? 'border-[#D7C298] bg-[#FFF8EA] shadow-sm'
                  : 'border-slate-200 bg-white hover:border-publicGreen/60'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  active ? 'bg-publicGreen text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {index + 1}
              </span>
              <span className="mt-3 block text-sm font-bold text-civicNavy">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-[#DDEBE3] bg-[#F4FAF7] p-4">
        <p className="text-sm font-bold text-publicGreen">{activeStep.label}</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{activeStep.description}</p>
      </div>
    </section>
  );
}
