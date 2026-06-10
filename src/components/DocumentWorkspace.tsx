import { Clipboard, Download, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CollaborationRequest, DocumentDraft } from '../data';
import type { AICompanionMessage } from './AICompanion';

type TabId = 'letter' | 'plan' | 'report';

interface DocumentWorkspaceProps {
  request: CollaborationRequest;
  draft: DocumentDraft;
  onExplain?: (message: AICompanionMessage) => void;
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'letter', label: '협조공문' },
  { id: 'plan', label: '지원계획서' },
  { id: 'report', label: '결과보고서' },
];

function copyTextFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
}

export function DocumentWorkspace({
  request,
  draft,
  onExplain,
}: DocumentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>('letter');
  const [status, setStatus] = useState('');
  const content = useMemo(() => draft[activeTab], [activeTab, draft]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setStatus('문서 내용이 복사되었습니다.');
      onExplain?.({
        title: '문서 복사 완료',
        body: `${tabs.find((tab) => tab.id === activeTab)?.label} 내용이 복사되었습니다. AI 초안은 담당자 검토 후 실제 문서에 반영하는 판단 보조 자료입니다.`,
        chips: ['문서 복사', '담당자 검토', '초안 활용'],
        tone: 'success',
      });
    } catch {
      copyTextFallback(content);
      setStatus('복사 요청이 처리되었습니다.');
      onExplain?.({
        title: '복사 요청 처리',
        body: '브라우저 복사 권한을 우회해 문서 내용을 복사 요청으로 처리했습니다. 발표 환경에서도 버튼 동작을 확인할 수 있습니다.',
        chips: ['복사 처리', '문서 초안', '권한 대응'],
      });
    }
  };

  return (
    <section className="rounded-lg border border-white bg-white/[0.94] p-5 shadow-panel">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
            자동 문서
          </p>
          <h2 className="mt-2 text-xl font-bold text-civicNavy">공문·계획서 작성</h2>
          <p className="mt-1 text-sm text-slate-500">{request.title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-civicNavy transition hover:border-publicGreen hover:text-publicGreen"
          >
            <Clipboard className="h-4 w-4" aria-hidden="true" />
            복사
          </button>
          <button
            type="button"
            onClick={() =>
              {
                window.alert('PDF 내보내기 요청이 접수되었습니다.');
                onExplain?.({
                  title: 'PDF 내보내기 요청',
                  body: '문서 내보내기 요청이 접수되었습니다. 현재 화면에서는 실제 파일 생성 대신 발표용 알림으로 처리하고, 초안 흐름만 시연합니다.',
                  chips: ['PDF 요청', '발표용 처리', '문서화'],
                });
              }
            }
            className="inline-flex items-center gap-2 rounded-lg bg-civicNavy px-3 py-2 text-sm font-bold text-white transition hover:bg-[#12395F]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            PDF 내보내기
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto rounded-lg bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setStatus('');
              onExplain?.({
                title: `${tab.label} 초안 전환`,
                body: `${request.title} 요청의 ${tab.label} 초안입니다. 같은 분석 결과를 문서 형식에 맞춰 보기 좋게 다시 정리해둘게요.`,
                chips: [tab.label, '형식 전환', '자동 작성'],
              });
            }}
            className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition ${
              activeTab === tab.id
                ? 'bg-white text-civicNavy shadow-sm'
                : 'text-slate-500 hover:text-civicNavy'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-porcelain p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-civicNavy">
          <FileText className="h-4 w-4 text-publicGreen" aria-hidden="true" />
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
          {content}
        </pre>
      </div>

      {status ? <p className="mt-3 text-sm font-semibold text-publicGreen">{status}</p> : null}
    </section>
  );
}
