import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Download, Upload, Trash2 } from 'lucide-react';
import { getSettings, saveSettings, exportData, importData, resetAllData, haptic } from '../db';
import CustomFields from './CustomFields';

interface SettingsProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function Settings({ onShowToast }: SettingsProps) {
  const [settings, setSettingsState] = useState(getSettings());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [showCustomFields, setShowCustomFields] = useState(false);

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    const updated = { ...settings, [key]: value };
    setSettingsState(updated);
    saveSettings(updated);
    haptic();
  };

  const handleExport = () => {
    haptic();
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradevault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Data exported successfully', 'success');
  };

  const handleImport = () => {
    haptic();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (importData(data)) {
            setSettingsState(getSettings());
            onShowToast('Data imported successfully', 'success');
          } else {
            onShowToast('Invalid backup file', 'error');
          }
        } catch {
          onShowToast('Failed to parse backup file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (resetInput === 'RESET') {
      haptic();
      resetAllData();
      setSettingsState(getSettings());
      setShowResetConfirm(false);
      setResetInput('');
      onShowToast('All data has been reset', 'info');
      window.location.reload();
    }
  };

  if (showCustomFields) {
    return <CustomFields onBack={() => setShowCustomFields(false)} onShowToast={onShowToast} />;
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    padding: '0 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    width: 44,
    height: 24,
    borderRadius: 12,
    background: active ? '#2DD4A8' : 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    transition: 'background 0.2s ease',
    cursor: 'pointer',
  });

  const toggleKnobStyle = (active: boolean): React.CSSProperties => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: 2,
    left: active ? 22 : 2,
    transition: 'left 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  });

  return (
    <div className="flex flex-col" style={{ padding: '16px 16px 24px' }}>
      {/* Account Settings */}
      <motion.div
        style={{
          background: 'rgba(20, 24, 28, 0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
          marginBottom: 12,
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4A5568', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Account
        </div>

        {/* Currency */}
        <div style={rowStyle}>
          <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>Currency</span>
          <select
            value={settings.accountCurrency}
            onChange={(e) => updateSetting('accountCurrency', e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#F0F2F5',
              fontSize: 13,
              outline: 'none',
            }}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        {/* Risk Per Trade */}
        <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 8, height: 72 }}>
          <div className="flex items-center justify-between w-full">
            <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>Default Risk</span>
            <span className="font-mono" style={{ fontSize: 14, color: '#2DD4A8' }}>{settings.riskPerTrade}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={settings.riskPerTrade}
            onChange={(e) => updateSetting('riskPerTrade', parseFloat(e.target.value))}
            className="w-full"
            style={{
              accentColor: '#2DD4A8',
            }}
          />
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        style={{
          background: 'rgba(20, 24, 28, 0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
          marginBottom: 12,
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
      >
        <div style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4A5568', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Preferences
        </div>

        {/* Show 3D Background */}
        <div style={rowStyle}>
          <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>3D Background</span>
          <div
            style={toggleStyle(settings.showTorus)}
            onClick={() => updateSetting('showTorus', !settings.showTorus)}
          >
            <div style={toggleKnobStyle(settings.showTorus)} />
          </div>
        </div>

        {/* Haptic Feedback */}
        <div style={rowStyle}>
          <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>Haptic Feedback</span>
          <div
            style={toggleStyle(settings.hapticEnabled)}
            onClick={() => updateSetting('hapticEnabled', !settings.hapticEnabled)}
          >
            <div style={toggleKnobStyle(settings.hapticEnabled)} />
          </div>
        </div>

        {/* Custom Fields */}
        <button
          className="w-full flex items-center justify-between"
          style={rowStyle}
          onClick={() => { haptic(); setShowCustomFields(true); }}
        >
          <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>Custom Fields</span>
          <ChevronRight size={18} color="#4A5568" />
        </button>
      </motion.div>

      {/* Data Management */}
      <motion.div
        style={{
          background: 'rgba(20, 24, 28, 0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
          marginBottom: 12,
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4 }}
      >
        <div style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4A5568', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Data
        </div>

        <button className="w-full flex items-center justify-between" style={rowStyle} onClick={handleExport}>
          <div className="flex items-center gap-3">
            <Download size={18} color="#2DD4A8" />
            <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>Export Data</span>
          </div>
          <ChevronRight size={18} color="#4A5568" />
        </button>

        <button className="w-full flex items-center justify-between" style={rowStyle} onClick={handleImport}>
          <div className="flex items-center gap-3">
            <Upload size={18} color="#2DD4A8" />
            <span style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>Import Data</span>
          </div>
          <ChevronRight size={18} color="#4A5568" />
        </button>

        <button
          className="w-full flex items-center justify-between"
          style={{ ...rowStyle, borderBottom: 'none' }}
          onClick={() => { haptic(); setShowResetConfirm(true); }}
        >
          <div className="flex items-center gap-3">
            <Trash2 size={18} color="#EF4444" />
            <span style={{ fontWeight: 500, fontSize: 15, color: '#EF4444' }}>Reset All Data</span>
          </div>
          <ChevronRight size={18} color="#4A5568" />
        </button>
      </motion.div>

      {/* Version */}
      <div className="text-center" style={{ padding: '16px 0', color: '#4A5568', fontSize: 13 }}>
        TradeVault v1.0
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.6)', padding: 24 }}>
          <motion.div
            style={{
              background: 'rgba(20, 24, 28, 0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 340,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, color: '#EF4444', marginBottom: 8 }}>
              Reset All Data?
            </div>
            <div style={{ fontSize: 14, color: '#8B95A5', marginBottom: 16, lineHeight: 1.5 }}>
              This will delete all your trades, settings, and custom fields. This action cannot be undone.
            </div>
            <div style={{ fontSize: 13, color: '#4A5568', marginBottom: 8 }}>
              Type "RESET" to confirm:
            </div>
            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="RESET"
              style={{
                ...rowStyle,
                width: '100%',
                marginBottom: 16,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#F0F2F5',
                fontSize: 15,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            />
            <div className="flex gap-3">
              <button
                className="flex-1"
                style={{
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#8B95A5',
                  fontWeight: 600,
                  fontSize: 14,
                }}
                onClick={() => { setShowResetConfirm(false); setResetInput(''); }}
              >
                Cancel
              </button>
              <button
                className="flex-1"
                style={{
                  height: 44,
                  borderRadius: 10,
                  background: resetInput === 'RESET' ? '#EF4444' : 'rgba(239, 68, 68, 0.3)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                }}
                disabled={resetInput !== 'RESET'}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
