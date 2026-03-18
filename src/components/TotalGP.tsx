import { useSales } from '@/store/SalesContext';
import SummaryCard from './SummaryCard';
import { Sale } from '@/types/sales';

export default function TotalGP() {
  const { sales, settings } = useSales();

  const totalGP = sales.reduce((sum, s) => sum + s.grp.reduce((a, b) => a + b, 0), 0);
  const avgGP = sales.length ? Math.round(totalGP / sales.length) : 0;
  const cashCount = sales.filter(s => s.modeOfPayment === 'cash').length;
  const finCount = sales.filter(s => s.modeOfPayment === 'fin').length;
  const copoCount = sales.filter(s => s.modeOfPayment === 'copo').length;
  const bankPoCount = sales.filter(s => s.modeOfPayment === 'bank_po').length;

  const cashGP = sales.filter(s => s.modeOfPayment === 'cash').reduce((sum, s) => sum + s.grp.reduce((a, b) => a + b, 0), 0);
  const finGP = sales.filter(s => s.modeOfPayment === 'fin').reduce((sum, s) => sum + s.grp.reduce((a, b) => a + b, 0), 0);
  const copoGP = sales.filter(s => s.modeOfPayment === 'copo').reduce((sum, s) => sum + s.grp.reduce((a, b) => a + b, 0), 0);
  const bankPoGP = sales.filter(s => s.modeOfPayment === 'bank_po').reduce((sum, s) => sum + s.grp.reduce((a, b) => a + b, 0), 0);

  // Group by groupNumber
  const groups: Record<number, Sale[]> = {};
  sales.forEach(s => {
    (groups[s.groupNumber] = groups[s.groupNumber] || []).push(s);
  });

  return (
    <section id="total-gp" className="space-y-4">
      <h2 className="text-xl font-bold">Total Gross Profit</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard title="Total GP" value={`₱${totalGP.toLocaleString()}`} subtitle={`Avg: ₱${avgGP.toLocaleString()}`} colorClass="pastel-card-blue" />
        <SummaryCard title="Cash" value={`₱${cashGP.toLocaleString()}`} subtitle={`${cashCount} units`} colorClass="pastel-card-green" />
        <SummaryCard title="FIN" value={`₱${finGP.toLocaleString()}`} subtitle={`${finCount} units`} colorClass="pastel-card-amber" />
        <SummaryCard title="COPO" value={`₱${copoGP.toLocaleString()}`} subtitle={`${copoCount} units`} colorClass="pastel-card-purple" />
        <SummaryCard title="BANK PO" value={`₱${bankPoGP.toLocaleString()}`} subtitle={`${bankPoCount} units`} colorClass="pastel-card-teal" />
      </div>

      <div className="border border-border rounded overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-3 py-2 font-medium">Group#</th>
              <th className="px-3 py-2 font-medium">Total Released</th>
              <th className="px-3 py-2 font-medium">Total GP</th>
              <th className="px-3 py-2 font-medium">Average</th>
              <th className="px-3 py-2 font-medium">Cash</th>
              <th className="px-3 py-2 font-medium">FIN</th>
              <th className="px-3 py-2 font-medium">COPO</th>
              <th className="px-3 py-2 font-medium">BANK PO</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groups).length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">No records</td></tr>
            )}
            {Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b)).map(([grpNum, grpSales]) => {
              const gp = grpSales.reduce((sum, s) => sum + s.grp.reduce((a, b) => a + b, 0), 0);
              const released = grpSales.filter(s => s.bankStatus === 'released' && s.accountingStatus === 'released').length;
              return (
                <tr key={grpNum} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">Group {grpNum}</td>
                  <td className="px-3 py-2">{released}</td>
                  <td className="px-3 py-2">₱{gp.toLocaleString()}</td>
                  <td className="px-3 py-2">₱{grpSales.length ? Math.round(gp / grpSales.length).toLocaleString() : 0}</td>
                  <td className="px-3 py-2">{grpSales.filter(s => s.modeOfPayment === 'cash').length}</td>
                  <td className="px-3 py-2">{grpSales.filter(s => s.modeOfPayment === 'fin').length}</td>
                  <td className="px-3 py-2">{grpSales.filter(s => s.modeOfPayment === 'copo').length}</td>
                  <td className="px-3 py-2">{grpSales.filter(s => s.modeOfPayment === 'bank_po').length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
