import { Clipboard, Download, FileText, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CollaborationRequest, DocumentDraft } from '../data';

type TabId = 'letter' | 'plan' | 'report';

interface DocumentModalProps {
  open: boolean;
  request: CollaborationRequest;
  draft: DocumentDraft;
  onClose: () => void;
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'letter', label: '협조공문 초안' },
  { id: 'plan', label: '지원계획서' },
  { id: 'report', label: '결과보고서' },
];

function copyWithFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
}

export function DocumentModal({ open, request, draft, onClose }: DocumentModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('letter');
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveTab('letter');
    setCopyStatus('');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, request.id]);

  const content = useMemo(() => draft[activeTab], [activeTab, draft]);

  if (!open) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('문서 내용이 복사되었습니다.');
    } catch {
      const copied = copyWithFallback(content);
      setCopyStatus(
        copied
          ? '문서 내용이 복사되었습니다.'
          : '복사 요청이 처리되었습니다.',
      );
    }
  };

  const handleExport = () => {
    window.alert('시연용 데모에서는 PDF 내보내기 요청이 접수된 것으로 처리됩니다.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-civicNavy/25 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg border border-white bg-white shadow-2xl">
        <div className="h-1 bg-[linear-gradient(90deg,#0B2B4C_0%,#1F7A5C_52%,#B98535_100%)]" />
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-publicGreen">
              Generated Document
            </p>
            <h2 id="document-modal-title" className="mt-2 text-xl font-bold text-civicNavy">
              AI 자동 생성 문서
            </h2>
            <p className="mt-1 text-sm text-slate-500">{request.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-civicNavy"
            aria-label="닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-5 pt-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCopyStatus('');
                }}
                className={`rounded-t-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-publicGreen text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[52vh] overflow-y-auto px-5 py-5">
          <div className="rounded-lg border border-slate-200 bg-porcelain p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-civicNavy">
              <FileText className="h-4 w-4 text-publicGreen" aria-hidden="true" />
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
              {content}
            </pre>
          </div>
          {copyStatus ? (
            <p className="mt-3 text-sm font-semibold text-publicGreen">{copyStatus}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-[#F8FAF8] px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-civicNavy transition hover:border-publicGreen hover:text-publicGreen"
          >
            <Clipboard className="h-4 w-4" aria-hidden="true" />
            문서 복사
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D7C298] bg-white px-4 py-2.5 text-sm font-bold text-civicNavy transition hover:border-signalAmber hover:text-[#8A641F]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            PDF 내보내기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-civicNavy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12395F]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
