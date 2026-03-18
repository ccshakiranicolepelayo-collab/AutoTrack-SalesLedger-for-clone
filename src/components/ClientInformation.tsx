import { useSales } from '@/store/SalesContext';
import { Sale } from '@/types/sales';
import { StatusBadge } from './StatusBadge';

interface ClientInformationProps {
  onSelectSale: (sale: Sale) => void;
}

export default function ClientInformation({ onSelectSale }: ClientInformationProps) {
  const { sales, updateSale } = useSales();

  // Group sales by client name
  const grouped = sales.reduce<Record<string, Sale[]>>((acc, s) => {
    const key = s.clientName || 'Unknown';
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  const statusOptions = ['pending', 'released'] as const;
  const arOptions = ['pending', 'paid'] as const;

  return (
    <section id="client-info" className="space-y-3">
      <h2 className="text-xl font-bold">Client Information</h2>

      <div className="border border-border rounded overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-3 py-2 font-medium">Client Name</th>
              <th className="px-3 py-2 font-medium">Address</th>
              <th className="px-3 py-2 font-medium">Contact#</th>
              <th className="px-3 py-2 font-medium">Vehicle</th>
              <th className="px-3 py-2 font-medium">Bank</th>
              <th className="px-3 py-2 font-medium">Bank Status</th>
              <th className="px-3 py-2 font-medium">LTO Status</th>
              <th className="px-3 py-2 font-medium">Dealer Status</th>
              <th className="px-3 py-2 font-medium">Accounting</th>
              <th className="px-3 py-2 font-medium">AR Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(grouped).length === 0 && (
              <tr><td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">No records</td></tr>
            )}
            {Object.entries(grouped).map(([client, clientSales]) =>
              clientSales.map((sale, idx) => (
                <tr
                  key={sale.id}
                  className="border-t border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectSale(sale)}
                >
                  {idx === 0 && (
                    <>
                      <td className="px-3 py-2 font-medium align-top" rowSpan={clientSales.length}>{client}</td>
                      <td className="px-3 py-2 align-top" rowSpan={clientSales.length}>{sale.address}</td>
                      <td className="px-3 py-2 align-top" rowSpan={clientSales.length}>{sale.contact}</td>
                    </>
                  )}
                  <td className="px-3 py-2">{sale.brand} {sale.model}</td>
                  <td className="px-3 py-2 text-xs">—</td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.bankStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { bankStatus: e.target.value as any }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.ltoStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { ltoStatus: e.target.value as any }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.dealerStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { dealerStatus: e.target.value as any }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.accountingStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { accountingStatus: e.target.value as any }); }}
                    >
                      {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="text-xs border border-border rounded px-1 py-0.5 bg-card"
                      value={sale.arStatus}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateSale(sale.id, { arStatus: e.target.value as any }); }}
                    >
                      {arOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
