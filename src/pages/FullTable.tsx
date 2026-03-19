import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useSales } from '@/store/SalesContext';
import { BANK_DOCS, ACCOUNTING_DOCS, DEALER_DOCS, LTO_DOCS, formatDateBySettings } from '@/types/sales';
import Sidebar from '@/components/Sidebar';
import * as XLSX from 'xlsx';

function docStatus(docs: Record<string, boolean>, list: string[]): string {
  const checked = list.filter(d => docs[d]).length;
  if (checked === list.length) return 'Complete';
  if (checked === 0) return 'Processing';
  return `${list.length - checked} missing`;
}

export default function FullTable() {
  const navigate = useNavigate();
  const { sales, settings } = useSales();

  const sorted = useMemo(() =>
    [...sales].sort((a, b) => (b.dateRelease || '').localeCompare(a.dateRelease || '')),
    [sales]
  );

  const exportToExcel = () => {
    const data = sorted.map(s => ({
      'CS#': s.cs,
      'Engine#': s.engineNo,
      'Chassis#': s.chassisNo,
      'Brand': s.brand,
      'Model': s.model,
      'Branch': s.branch,
      'Unit Cost': s.cost,
      'OR/CR': s.orCr,
      'Date Release': formatDateBySettings(s.dateRelease, settings),
      'Client Name': s.clientName,
      'Contact': s.contact,
      'Address': s.address,
      'Mode': s.modeOfPayment.toUpperCase(),
      'Bank': s.bank || 'N/A',
      ...Object.fromEntries(s.grp.map((g, i) => [`Grp${i + 1}`, g])),
      'Gross': s.grp.reduce((a, b) => a + b, 0),
      'Accounting': docStatus(s.documents.accounting, ACCOUNTING_DOCS),
      'Dealer': docStatus(s.documents.dealer, DEALER_DOCS),
      'LTO': docStatus(s.documents.lto, LTO_DOCS),
      'AR': s.arStatus === 'paid' ? 'Paid' : 'Pending',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    // Auto-fit column widths
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, ...data.map(r => String((r as any)[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;
    XLSX.writeFile(wb, 'vehicle_sales_export.xlsx');
  };

  const scrollTo = (id: string) => {
    navigate('/');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onNavigate={scrollTo} onSettingsClick={() => navigate('/settings')} onRouteNavigate={(r) => navigate(r)} />

      <header className="sticky top-0 z-20 bg-card border-b border-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4 ml-12">
          <button onClick={() => navigate('/')} className="p-1.5 hover:bg-accent rounded">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-semibold tracking-tight">Full Sales Table</h1>
          <span className="text-xs text-muted-foreground">({sorted.length} records)</span>
        </div>
        <button
          onClick={exportToExcel}
          disabled={sorted.length === 0}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </header>

      <main className="p-4 max-w-full overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              {['CS#','Engine#','Chassis#','Brand','Model','Branch','Unit Cost','OR/CR','Date Release','Client Name','Contact','Address','Mode','Bank',
                ...Array.from({ length: settings.groupCount }, (_, i) => `Grp${i + 1}`),
                'Gross','Accounting','Dealer','LTO','AR'
              ].map(h => (
                <th key={h} className="px-2 py-2 text-left font-semibold whitespace-nowrap border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => {
              const gross = s.grp.reduce((a, b) => a + b, 0);
              const accStatus = docStatus(s.documents.accounting, ACCOUNTING_DOCS);
              const dlrStatus = docStatus(s.documents.dealer, DEALER_DOCS);
              const ltoStatus = docStatus(s.documents.lto, LTO_DOCS);
              return (
                <tr key={s.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-2 py-1.5 font-medium whitespace-nowrap">{s.cs}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">{s.engineNo}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">{s.chassisNo}</td>
                  <td className="px-2 py-1.5">{s.brand}</td>
                  <td className="px-2 py-1.5">{s.model}</td>
                  <td className="px-2 py-1.5">{s.branch}</td>
                  <td className="px-2 py-1.5 text-right">₱{s.cost.toLocaleString()}</td>
                  <td className="px-2 py-1.5">{s.orCr}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">{formatDateBySettings(s.dateRelease, settings)}</td>
                  <td className="px-2 py-1.5">{s.clientName}</td>
                  <td className="px-2 py-1.5">{s.contact}</td>
                  <td className="px-2 py-1.5">{s.address}</td>
                  <td className="px-2 py-1.5 uppercase">{s.modeOfPayment}</td>
                  <td className="px-2 py-1.5">{s.bank || 'N/A'}</td>
                  {s.grp.map((g, i) => (
                    <td key={i} className="px-2 py-1.5 text-right">₱{g.toLocaleString()}</td>
                  ))}
                  <td className="px-2 py-1.5 text-right font-medium">₱{gross.toLocaleString()}</td>
                  <td className="px-2 py-1.5">
                    <span className={accStatus === 'Complete' ? 'text-green-600' : accStatus === 'Processing' ? 'text-yellow-500' : 'text-red-500'}>{accStatus}</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={dlrStatus === 'Complete' ? 'text-green-600' : dlrStatus === 'Processing' ? 'text-yellow-500' : 'text-red-500'}>{dlrStatus}</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={ltoStatus === 'Complete' ? 'text-green-600' : ltoStatus === 'Processing' ? 'text-yellow-500' : 'text-red-500'}>{ltoStatus}</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s.arStatus === 'paid' ? 'status-released' : 'status-pending'}`}>
                      {s.arStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr><td colSpan={99} className="px-4 py-8 text-center text-muted-foreground">No sales records found.</td></tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
