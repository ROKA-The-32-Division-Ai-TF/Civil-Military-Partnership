import { Bot, Cpu, Sparkles, WandSparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface AICompanionMessage {
  title: string;
  body: string;
  chips?: string[];
  tone?: 'info' | 'success' | 'warning';
}

interface AICompanionProps {
  message: AICompanionMessage;
  pulse: number;
}

const toneStyles: Record<NonNullable<AICompanionMessage['tone']>, string> = {
  info: 'from-[#2563EB] via-[#1F7A5C] to-[#0B2B4C]',
  success: 'from-[#17A65A] via-[#1F7A5C] to-[#2563EB]',
  warning: 'from-[#F59E0B] via-[#1F7A5C] to-[#0B2B4C]',
};

export function AICompanion({ message, pulse }: AICompanionProps) {
  const [typedBody, setTypedBody] = useState(message.body);
  const chips = message.chips ?? ['요청 확인', '근거 정리', '다음 조치'];
  const tone = toneStyles[message.tone ?? 'info'];

  useEffect(() => {
    let cursor = 0;
    const text = message.body;
    setTypedBody('');

    const timer = window.setInterval(() => {
      cursor += 4;
      setTypedBody(text.slice(0, cursor));

      if (cursor >= text.length) {
        window.clearInterval(timer);
      }
    }, 14);

    return () => window.clearInterval(timer);
  }, [message.body, pulse]);

  return (
    <aside className="fixed bottom-3 left-4 right-4 z-40 overflow-hidden rounded-2xl border border-[#DDEBE3] bg-white/95 text-slate-900 shadow-2xl shadow-slate-900/20 backdrop-blur-xl lg:bottom-4 lg:left-auto lg:right-4 lg:w-[360px]">
      <div className={`h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg shadow-blue-900/15`}>
            <span
              key={pulse}
              className="absolute inset-0 animate-ping rounded-2xl bg-publicGreen/20"
            />
            <Bot className="relative h-5 w-5" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-emerald-100">
              <span className="h-2 w-2 animate-pulse rounded-full bg-publicGreen" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-publicGreen">
                여민 AI 비서
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EAF4EF] px-2 py-0.5 text-[10px] font-black text-publicGreen ring-1 ring-emerald-100">
                <WandSparkles className="h-3 w-3" aria-hidden="true" />
                확인 중
              </span>
            </div>
            <p className="mt-1 truncate text-sm font-black text-civicNavy">
              {message.title}
            </p>
            <p className="mt-2 min-h-[42px] text-sm font-semibold leading-6 text-slate-700">
              {typedBody}
              <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded bg-publicGreen" />
            </p>
          </div>
        </div>

        <div className="mt-3 hidden grid-cols-3 gap-2 lg:grid">
          {chips.slice(0, 3).map((chip, index) => (
            <div
              key={`${chip}-${pulse}`}
              className="rounded-xl border border-slate-200 bg-[#F8FCFA] px-3 py-2"
              style={{ animation: `fadeIn 280ms ease ${index * 90}ms both` }}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600">
                {index === 0 ? (
                  <Cpu className="h-3.5 w-3.5 text-publicGreen" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
                )}
                <span className="truncate">{chip}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-publicGreen"
                  style={{
                    width: `${72 + index * 10}%`,
                    animation: `growBar 600ms ease ${index * 120}ms both`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
