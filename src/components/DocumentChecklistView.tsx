import { useState } from 'react';
import { BANK_DOCS, ACCOUNTING_DOCS, DEALER_DOCS, LTO_DOCS, DocumentChecklist, ARStatusType } from '@/types/sales';

const PAGES = [
  { title: 'Bank', docs: BANK_DOCS, key: 'bank' as const },
  { title: 'Accounting', docs: ACCOUNTING_DOCS, key: 'accounting' as const },
  { title: 'Dealer', docs: DEALER_DOCS, key: 'dealer' as const },
  { title: 'LTO', docs: LTO_DOCS, key: 'lto' as const },
];

interface DocumentChecklistViewProps {
  documents: DocumentChecklist;
  arStatus: ARStatusType;
  onUpdate: (docs: DocumentChecklist, arStatus: ARStatusType) => void;
  onClose: () => void;
}

export default function DocumentChecklistView({ documents, arStatus, onUpdate, onClose }: DocumentChecklistViewProps) {
  const [page, setPage] = useState(0);
  const [localDocs, setLocalDocs] = useState<DocumentChecklist>({ ...documents, bank: { ...documents.bank }, accounting: { ...documents.accounting }, dealer: { ...documents.dealer }, lto: { ...documents.lto } });
  const [localAr, setLocalAr] = useState(arStatus);

  const currentPage = PAGES[page];

  const toggle = (doc: string) => {
    setLocalDocs(prev => ({
      ...prev,
      [currentPage.key]: { ...prev[currentPage.key], [doc]: !prev[currentPage.key][doc] },
    }));
  };

  const isLastPage = page === PAGES.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {PAGES.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setPage(i)}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${i === page ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <h4 className="font-semibold text-sm">{currentPage.title} Documents</h4>
        {currentPage.docs.map(doc => (
          <label key={doc} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent/50 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={localDocs[currentPage.key][doc] || false}
              onChange={() => toggle(doc)}
              className="rounded border-border"
            />
            {doc}
          </label>
        ))}
      </div>

      {isLastPage && (
        <div className="pt-2 border-t border-border">
          <label className="text-sm font-medium">AR Status</label>
          <select
            className="ml-2 text-sm border border-border rounded px-2 py-1 bg-card"
            value={localAr}
            onChange={e => setLocalAr(e.target.value as ARStatusType)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={() => page > 0 ? setPage(page - 1) : onClose()}
          className="px-4 py-1.5 text-sm border border-border rounded hover:bg-accent transition-colors"
        >
          Back
        </button>
        {isLastPage ? (
          <button
            onClick={() => { onUpdate(localDocs, localAr); onClose(); }}
            className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
