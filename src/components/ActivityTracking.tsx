import { useSales } from '@/store/SalesContext';
import { Sale, StatusType, ARStatusType, BANK_DOCS, ACCOUNTING_DOCS, DEALER_DOCS, LTO_DOCS } from '@/types/sales';
import { StatusBadge } from './StatusBadge';

interface ActivityTrackingProps {
  onSelectSale: (sale: Sale) => void;
}

function getMissing(docs: Record<string, boolean>): string[] {
  return Object.entries(docs).filter(([, v]) => !v).map(([k]) => k);
}

export default function ActivityTracking({ onSelectSale }: ActivityTrackingProps) {
  const { sales, updateSale } = useSales();

  const statusOptions = ['pending', 'released'] as const;
  const arOptions = ['pending', 'paid'] as const;

  return (
    <section id="activity" className="space-y-3">
      <h2 className="text-xl font-bold">Activity Tracking</h2>

      <div className="border border-border rounded overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-3 py-2 font-medium">CS#</th>
              <th className="px-3 py-2 font-medium">Client</th>
              <th className="px-3 py-2 font-medium">Model</th>
              <th className="px-3 py-2 font-medium" colSpan={2}>Bank</th>
              <th className="px-3 py-2 font-medium" colSpan={2}>Accounting</th>
              <th className="px-3 py-2 font-medium" colSpan={2}>Dealer</th>
              <th className="px-3 py-2 font-medium" colSpan={2}>LTO</th>
              <th className="px-3 py-2 font-medium">AR</th>
            </tr>
            <tr className="bg-muted/50 text-left text-xs">
              <th className="px-3 py-1"></th>
              <th className="px-3 py-1"></th>
              <th className="px-3 py-1"></th>
              <th className="px-3 py-1">Status</th>
              <th className="px-3 py-1">Missing/Complete</th>
              <th className="px-3 py-1">Status</th>
              <th className="px-3 py-1">Missing/Complete</th>
              <th className="px-3 py-1">Status</th>
              <th className="px-3 py-1">Missing/Complete</th>
              <th className="px-3 py-1">Status</th>
              <th className="px-3 py-1">Missing/Complete</th>
              <th className="px-3 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr><td colSpan={12} className="px-3 py-8 text-center text-muted-foreground">No records</td></tr>
            )}
            {sales.map(sale => {
              const bankMissing = getMissing(sale.documents.bank);
              const accMissing = getMissing(sale.documents.accounting);
              const dealerMissing = getMissing(sale.documents.dealer);
              const ltoMissing = getMissing(sale.documents.lto);

              return (
                <tr
                  key={sale.id}
                  className="border-t border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectSale(sale)}
                >
                  <td className="px-3 py-2 font-medium text-primary">{sale.cs}</td>
                  <td className="px-3 py-2">{sale.clientName}</td>
                  <td className="px-3 py-2">{sale.model}</td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.bankStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { bankStatus: e.target.value as StatusType }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs max-w-[150px] truncate" title={bankMissing.join(', ')}>
                    {sale.bankStatus === 'released' ? <span className="status-released px-1.5 py-0.5 rounded">Complete</span> : `${bankMissing.length} missing`}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.accountingStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { accountingStatus: e.target.value as StatusType }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs max-w-[150px] truncate" title={accMissing.join(', ')}>
                    {sale.accountingStatus === 'released' ? <span className="status-released px-1.5 py-0.5 rounded">Complete</span> : `${accMissing.length} missing`}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.dealerStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { dealerStatus: e.target.value as StatusType }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs max-w-[150px] truncate" title={dealerMissing.join(', ')}>
                    {sale.dealerStatus === 'released' ? <span className="status-released px-1.5 py-0.5 rounded">Complete</span> : `${dealerMissing.length} missing`}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.ltoStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { ltoStatus: e.target.value as StatusType }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs max-w-[150px] truncate" title={ltoMissing.join(', ')}>
                    {sale.ltoStatus === 'released' ? <span className="status-released px-1.5 py-0.5 rounded">Complete</span> : `${ltoMissing.length} missing`}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className={`text-xs border border-border rounded px-1 py-0.5 bg-card`}
                      value={sale.arStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { arStatus: e.target.value as ARStatusType }); }}
                    >
                      {arOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
