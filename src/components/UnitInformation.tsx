import { useState } from 'react';
import { useSales } from '@/store/SalesContext';
import { Sale } from '@/types/sales';
import { Search } from 'lucide-react';

interface UnitInformationProps {
  onSelectSale: (sale: Sale) => void;
}

export default function UnitInformation({ onSelectSale }: UnitInformationProps) {
  const { sales, updateSale } = useSales();
  const [search, setSearch] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = sales.filter(s =>
    !search || [s.cs, s.clientName, s.engineNo, s.chassisNo, s.model].some(f => f.toLowerCase().includes(search.toLowerCase()))
  );

  const startEdit = (id: string, field: string, value: string) => {
    setEditingCell({ id, field });
    setEditValue(value);
  };

  const commitEdit = () => {
    if (editingCell) {
      const val = ['rate', 'cost'].includes(editingCell.field) ? Number(editValue) || 0 : editValue;
      updateSale(editingCell.id, { [editingCell.field]: val } as Partial<Sale>);
      setEditingCell(null);
    }
  };

  const fields: { key: keyof Sale; label: string }[] = [
    { key: 'cs', label: 'CS#' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'engineNo', label: 'Engine#' },
    { key: 'chassisNo', label: 'Chassis#' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'rate', label: 'Rate' },
    { key: 'cost', label: 'Cost' },
    { key: 'orCr', label: 'OR/CR' },
    { key: 'dateRelease', label: 'Date Release' },
  ];

  return (
    <section id="unit-info" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Unit Information</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-ring w-60"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-border rounded overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              {fields.map(f => (
                <th key={f.key} className="px-3 py-2 font-medium whitespace-nowrap">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={fields.length} className="px-3 py-8 text-center text-muted-foreground">No records</td></tr>
            )}
            {filtered.map(sale => (
              <tr key={sale.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                {fields.map(f => {
                  const isEditing = editingCell?.id === sale.id && editingCell?.field === f.key;
                  const value = String(sale[f.key] ?? '');
                  return (
                    <td
                      key={f.key}
                      className="px-3 py-1.5 cursor-pointer whitespace-nowrap"
                      onClick={() => f.key === 'cs' ? onSelectSale(sale) : startEdit(sale.id, f.key, value)}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          className="table-cell-edit w-full bg-background border border-ring rounded"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={e => e.key === 'Enter' && commitEdit()}
                        />
                      ) : (
                        <span className={f.key === 'cs' ? 'text-primary font-medium cursor-pointer hover:underline' : ''}>
                          {['rate', 'cost'].includes(f.key) ? `₱${Number(value).toLocaleString()}` : value}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
