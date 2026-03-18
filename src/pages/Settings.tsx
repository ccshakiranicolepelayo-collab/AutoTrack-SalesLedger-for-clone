import { useState } from 'react';
import { useSales } from '@/store/SalesContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { settings, updateSettings } = useSales();
  const navigate = useNavigate();
  const [newModel, setNewModel] = useState('');

  const addModel = () => {
    if (newModel.trim() && !settings.vehicleModels.includes(newModel.trim())) {
      updateSettings({ vehicleModels: [...settings.vehicleModels, newModel.trim()] });
      setNewModel('');
    }
  };

  const removeModel = (m: string) => {
    updateSettings({ vehicleModels: settings.vehicleModels.filter(v => v !== m) });
  };

  const toggleTheme = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  return (
    <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <h1 className="text-xl font-bold mb-6">⚙️ System Settings</h1>

      {/* Theme */}
      <div className="border border-border rounded p-4 mb-4 bg-card">
        <h3 className="text-sm font-semibold mb-3">System Theme</h3>
        <div className="flex gap-2">
          {(['light', 'dark'] as const).map(t => (
            <button
              key={t}
              onClick={() => toggleTheme(t)}
              className={`px-4 py-1.5 text-sm rounded capitalize ${settings.theme === t ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Date Format */}
      <div className="border border-border rounded p-4 mb-4 bg-card">
        <h3 className="text-sm font-semibold mb-3">Date Format</h3>
        <div className="flex gap-2 mb-3">
          {([
            { key: 'us', label: 'US (mm/dd/yyyy)' },
            { key: 'eur', label: 'EUR (dd/mm/yyyy)' },
            { key: 'jpn', label: 'JPN (yyyy/mm/dd)' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => updateSettings({ dateFormat: f.key })}
              className={`px-3 py-1.5 text-xs rounded ${settings.dateFormat === f.key ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['short', 'long'] as const).map(l => (
            <button
              key={l}
              onClick={() => updateSettings({ dateLength: l })}
              className={`px-3 py-1.5 text-xs rounded capitalize ${settings.dateLength === l ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}
            >
              {l} {l === 'short' ? '(01/01/2000)' : '(Jan 01, 2000)'}
            </button>
          ))}
        </div>
      </div>

      {/* Group Count */}
      <div className="border border-border rounded p-4 mb-4 bg-card">
        <h3 className="text-sm font-semibold mb-3">Group Count</h3>
        <input
          type="number"
          min={1}
          max={10}
          className="border border-border rounded px-3 py-1.5 text-sm bg-background w-20"
          value={settings.groupCount}
          onChange={e => updateSettings({ groupCount: Math.max(1, Number(e.target.value) || 3) })}
        />
      </div>

      {/* Vehicle Models */}
      <div className="border border-border rounded p-4 bg-card">
        <h3 className="text-sm font-semibold mb-3">Vehicle Models</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {settings.vehicleModels.map(m => (
            <span key={m} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
              {m}
              <button onClick={() => removeModel(m)} className="hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="border border-border rounded px-2 py-1.5 text-sm bg-background flex-1"
            placeholder="New model name"
            value={newModel}
            onChange={e => setNewModel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addModel()}
          />
          <button onClick={addModel} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
