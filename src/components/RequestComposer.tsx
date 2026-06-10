import { RotateCcw, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import {
  categoryLegend,
  type Category,
  type Priority,
  type RequestDraftInput,
} from '../data';
import type { AICompanionMessage } from './AICompanion';

interface RequestComposerProps {
  onCreateRequest: (input: RequestDraftInput) => void;
  onExplain?: (message: AICompanionMessage) => void;
}

const categories = Object.keys(categoryLegend) as Category[];
const priorities: Priority[] = ['높음', '보통', '긴급'];

const emptyForm: RequestDraftInput = {
  title: '',
  requester: '',
  location: '',
  category: '재난복구',
  priority: '높음',
  detail: '',
};

const sampleForm: RequestDraftInput = {
  title: '마을 배수로 토사 제거 및 응급 복구 지원 요청',
  requester: '○○면 이장협의회',
  location: '○○면 저지대 배수로',
  category: '재난복구',
  priority: '긴급',
  detail:
    '집중호우 이후 배수로에 토사가 쌓여 농경지 침수 우려가 있습니다. 세종시 현장 확인과 협력 군부대의 장비·인력 지원 가능성 검토가 필요합니다.',
};

export function RequestComposer({ onCreateRequest, onExplain }: RequestComposerProps) {
  const [form, setForm] = useState<RequestDraftInput>(sampleForm);
  const [message, setMessage] = useState('');

  const disabled =
    !form.title.trim() || !form.requester.trim() || !form.location.trim() || !form.detail.trim();

  const updateField = <Key extends keyof RequestDraftInput>(
    key: Key,
    value: RequestDraftInput[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage('');
  };

  const handleSubmit = () => {
    if (disabled) {
      setMessage('요청 제목, 기관, 위치, 내용을 입력하면 AI 분석을 생성할 수 있습니다.');
      return;
    }

    onCreateRequest(form);
    setMessage('AI 분석 결과가 생성되어 현황 지도와 분석 패널에 반영되었습니다.');
  };

  return (
    <section className="rounded-lg border border-white bg-white/[0.92] p-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            요청 접수
          </p>
          <h2 className="mt-2 text-lg font-bold text-civicNavy">신규 협업 요청 입력</h2>
          <p className="mt-1 text-sm text-slate-500">
            발표 중 직접 입력해도 즉시 AI 분석 카드가 생성됩니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(sampleForm);
            setMessage('');
            onExplain?.({
              title: '예시 요청 입력',
              body: '집중호우 이후 배수로 토사 제거 요청 예시를 불러왔습니다. AI 분석 생성 버튼을 누르면 재난복구 유형, 필요 자원, 협력기관 후보가 자동으로 구성됩니다.',
              chips: ['예시 입력', '재난복구', '분석 준비'],
            });
          }}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-civicNavy transition hover:border-publicGreen hover:text-publicGreen"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          예시 불러오기
        </button>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-bold text-civicNavy lg:col-span-2">
          요청 제목
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="예: 마을 배수로 토사 제거 지원 요청"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-civicNavy">
          요청 기관
          <input
            value={form.requester}
            onChange={(event) => updateField('requester', event.target.value)}
            className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="예: 금남면 이장협의회"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-civicNavy">
          위치
          <input
            value={form.location}
            onChange={(event) => updateField('location', event.target.value)}
            className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="예: ○○면 저지대 배수로"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-civicNavy">
          협업 유형
          <select
            value={form.category}
            onChange={(event) => updateField('category', event.target.value as Category)}
            className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-civicNavy">
          우선순위
          <select
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value as Priority)}
            className="rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-civicNavy lg:col-span-2">
          요청 내용
          <textarea
            value={form.detail}
            onChange={(event) => updateField('detail', event.target.value)}
            rows={4}
            className="resize-none rounded-lg border border-slate-200 bg-porcelain px-3 py-2.5 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-publicGreen focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="현장 상황, 필요한 지원, 주민 불편 내용을 간단히 입력"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {message ? (
          <p className="text-sm font-semibold text-publicGreen">{message}</p>
        ) : (
          <p className="text-sm text-slate-500">
            입력 내용을 바탕으로 AI 분석 결과를 생성합니다.
          </p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-civicNavy px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#12395F] disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={disabled}
        >
          <WandSparkles className="h-4 w-4" aria-hidden="true" />
          AI 분석 생성
        </button>
      </div>
    </section>
  );
}
