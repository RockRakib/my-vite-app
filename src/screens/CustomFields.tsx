import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GripVertical, Trash2, Plus } from 'lucide-react';
import type { CustomField } from '../types';
import { getCustomFields, saveCustomFields, haptic } from '../db';
import { v4 as uuidv4 } from 'uuid';

interface CustomFieldsProps {
  onBack: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function CustomFields({ onBack, onShowToast }: CustomFieldsProps) {
  const [fields, setFields] = useState<CustomField[]>(getCustomFields());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const toggleField = (id: string) => {
    haptic();
    const updated = fields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f));
    setFields(updated);
    saveCustomFields(updated);
  };

  const deleteField = (id: string) => {
    haptic();
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    saveCustomFields(updated);
    onShowToast('Field removed', 'info');
  };

  const addField = () => {
    if (!newFieldName.trim()) {
      onShowToast('Field name is required', 'error');
      return;
    }

    haptic();
    const key = newFieldName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const newField: CustomField = {
      id: uuidv4(),
      name: newFieldName.trim(),
      key,
      type: newFieldType,
      options: newFieldType === 'select' || newFieldType === 'multiselect'
        ? newFieldOptions.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined,
      required: newFieldRequired,
      order: fields.length,
      enabled: true,
    };

    const updated = [...fields, newField];
    setFields(updated);
    saveCustomFields(updated);
    setShowAddForm(false);
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptions('');
    setNewFieldRequired(false);
    onShowToast('Custom field added', 'success');
  };

  const typeLabels: Record<CustomField['type'], string> = {
    text: 'Text',
    number: 'Number',
    select: 'Dropdown',
    multiselect: 'Multi-select',
    date: 'Date',
    checkbox: 'Checkbox',
  };

  return (
    <div className="flex flex-col" style={{ padding: '0 0 24px' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3"
        style={{
          background: 'rgba(13, 15, 17, 0.90)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          height: 52,
          padding: '0 16px',
        }}
      >
        <button onClick={() => { haptic(); onBack(); }} style={{ color: '#F0F2F5' }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontWeight: 600, fontSize: 17, color: '#F0F2F5' }}>Custom Fields</span>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 13, color: '#4A5568', marginBottom: 16, lineHeight: 1.5 }}>
          Toggle fields on/off to customize your trade form. These fields appear when logging new trades.
        </p>

        {/* Field List */}
        <div className="flex flex-col gap-2" style={{ marginBottom: 16 }}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              className="flex items-center gap-3"
              style={{
                height: 56,
                background: 'rgba(20, 24, 28, 0.72)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 12,
                padding: '0 12px',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GripVertical size={16} color="#4A5568" />
              <div className="flex-1 min-w-0">
                <div style={{ fontWeight: 500, fontSize: 15, color: '#F0F2F5' }}>{field.name}</div>
                <div style={{ fontSize: 11, color: '#4A5568' }}>
                  {typeLabels[field.type]}
                  {field.required && ' · Required'}
                </div>
              </div>

              {/* Toggle */}
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: field.enabled ? '#2DD4A8' : 'rgba(255, 255, 255, 0.15)',
                  position: 'relative',
                  transition: 'background 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => toggleField(field.id)}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 2,
                    left: field.enabled ? 22 : 2,
                    transition: 'left 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>

              <button
                style={{ color: '#4A5568', padding: 4 }}
                onClick={() => deleteField(field.id)}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add New Field Button */}
        {!showAddForm ? (
          <button
            className="w-full flex items-center justify-center gap-2"
            style={{
              height: 48,
              borderRadius: 10,
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              color: '#2DD4A8',
              fontWeight: 600,
              fontSize: 14,
            }}
            onClick={() => { haptic(); setShowAddForm(true); }}
          >
            <Plus size={18} />
            Add Custom Field
          </button>
        ) : (
          <motion.div
            style={{
              background: 'rgba(20, 24, 28, 0.72)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 12,
              padding: 16,
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8B95A5', marginBottom: 4 }}>Field Name</label>
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g. Prop Firm"
                autoFocus
                style={{
                  width: '100%',
                  height: 44,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: '0 14px',
                  color: '#F0F2F5',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8B95A5', marginBottom: 4 }}>Field Type</label>
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as CustomField['type'])}
                style={{
                  width: '100%',
                  height: 44,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: '0 14px',
                  color: '#F0F2F5',
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Dropdown</option>
                <option value="multiselect">Multi-select</option>
                <option value="date">Date</option>
                <option value="checkbox">Checkbox</option>
              </select>
            </div>

            {(newFieldType === 'select' || newFieldType === 'multiselect') && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#8B95A5', marginBottom: 4 }}>
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  value={newFieldOptions}
                  onChange={(e) => setNewFieldOptions(e.target.value)}
                  placeholder="FTMO, The5ers, True Forex Funds"
                  style={{
                    width: '100%',
                    height: 44,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '0 14px',
                    color: '#F0F2F5',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: `2px solid ${newFieldRequired ? '#2DD4A8' : 'rgba(255, 255, 255, 0.2)'}`,
                  background: newFieldRequired ? '#2DD4A8' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setNewFieldRequired(!newFieldRequired)}
              >
                {newFieldRequired && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D0F11" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 14, color: '#F0F2F5' }}>Required field</span>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1"
                style={{
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#8B95A5',
                  fontWeight: 600,
                  fontSize: 14,
                }}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1"
                style={{
                  height: 40,
                  borderRadius: 10,
                  background: '#2DD4A8',
                  color: '#0D0F11',
                  fontWeight: 600,
                  fontSize: 14,
                }}
                onClick={addField}
              >
                Add Field
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
