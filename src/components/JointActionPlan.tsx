import { ArrowRight, Landmark, ShieldCheck, UsersRound } from 'lucide-react';
import type { CollaborationRequest } from '../data';

interface JointActionPlanProps {
  request: CollaborationRequest;
}

export function JointActionPlan({ request }: JointActionPlanProps) {
  const lanes = [
    {
      title: '세종특별자치시',
      role: '접수·판단·현장 통제',
      detail: `${request.location} 현장 확인, 안전조치, 부서 자원 배정`,
      icon: Landmark,
    },
    {
      title: '협력 군부대',
      role: '인력·장비 지원',
      detail: request.neededResources.slice(0, 3).join(', '),
      icon: ShieldCheck,
    },
    {
      title: request.requester,
      role: '주민 안내·현장 피드백',
      detail: '작업 위치 안내, 주민 공지, 조치 결과 확인',
      icon: UsersRound,
    },
  ];

  return (
    <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-publicGreen">
            공동 조치안
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">민·관·군 실행 역할</h2>
        </div>
        <span className="w-fit rounded-full bg-[#EAF4EF] px-3 py-1 text-xs font-bold text-publicGreen">
          사람 승인 후 실행
        </span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {lanes.map((lane, index) => {
          const LaneIcon = lane.icon;

          return (
            <div key={lane.title} className="contents">
              <article className="rounded-lg border border-slate-200 bg-porcelain p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-publicGreen ring-1 ring-emerald-100">
                    <LaneIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-civicNavy">{lane.title}</h3>
                    <p className="mt-1 text-xs font-bold text-publicGreen">{lane.role}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{lane.detail}</p>
                  </div>
                </div>
              </article>
              {index < lanes.length - 1 ? (
                <div className="hidden items-center justify-center px-1 text-slate-300 lg:flex">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
