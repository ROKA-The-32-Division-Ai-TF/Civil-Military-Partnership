import { Activity, Bot, Cpu, Sparkles } from 'lucide-react';
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
  info: 'from-[#1D4ED8] via-[#0F766E] to-[#0F513D]',
  success: 'from-[#16803A] via-[#0F766E] to-[#173E70]',
  warning: 'from-[#B98535] via-[#0F766E] to-[#173E70]',
};

export function AICompanion({ message, pulse }: AICompanionProps) {
  const [typedBody, setTypedBody] = useState(message.body);
  const chips = message.chips ?? ['상황 인식', '자원 매칭', '문서 초안'];
  const tone = toneStyles[message.tone ?? 'info'];

  useEffect(() => {
    let cursor = 0;
    const text = message.body;
    setTypedBody('');

    const timer = window.setInterval(() => {
      cursor += 3;
      setTypedBody(text.slice(0, cursor));

      if (cursor >= text.length) {
        window.clearInterval(timer);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [message.body, pulse]);

  return (
    <aside className="fixed bottom-3 left-4 right-4 z-40 overflow-hidden rounded-2xl border border-white/20 bg-[#061E3A]/95 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:bottom-4 lg:left-auto lg:right-4 lg:w-[390px]">
      <div className={`h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <span
              key={pulse}
              className="absolute inset-0 animate-ping rounded-2xl bg-emerald-300/25"
            />
            <Bot className="relative h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-black text-white">{message.title}</p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-300/15 px-2 py-0.5 text-[10px] font-black text-emerald-100 ring-1 ring-emerald-200/20">
                <Activity className="h-3 w-3" aria-hidden="true" />
                분석중
              </span>
            </div>
            <p className="mt-2 min-h-[44px] text-sm leading-6 text-blue-50">
              {typedBody}
              <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded bg-emerald-200" />
            </p>
          </div>
        </div>

        <div className="mt-4 hidden grid-cols-3 gap-2 lg:grid">
          {chips.slice(0, 3).map((chip, index) => (
            <div
              key={`${chip}-${pulse}`}
              className="rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2"
              style={{ animation: `fadeIn 280ms ease ${index * 90}ms both` }}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-100">
                {index === 0 ? (
                  <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="truncate">{chip}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-200"
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
