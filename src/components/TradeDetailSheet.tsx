import type { Trade } from '../types';
import BottomSheet from './BottomSheet';
import { Star, Pencil, Trash2 } from 'lucide-react';

interface TradeDetailSheetProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (trade: Trade) => void;
  onDelete?: (id: string) => void;
}

export default function TradeDetailSheet({ trade, isOpen, onClose, onEdit, onDelete }: TradeDetailSheetProps) {
  if (!trade) return null;

  const isWin = trade.profitLoss > 0;
  const dateStr = new Date(trade.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = new Date(trade.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const fields = [
    { label: 'Entry Price', value: trade.entryPrice.toFixed(5) },
    { label: 'Exit Price', value: trade.exitPrice.toFixed(5) },
    { label: 'Stop Loss', value: trade.stopLoss.toFixed(5) },
    { label: 'Take Profit', value: trade.takeProfit.toFixed(5) },
    { label: 'Position Size', value: `${trade.lots} lots` },
    { label: 'Pips', value: `${trade.pips > 0 ? '+' : ''}${trade.pips}` },
    { label: 'Commission', value: `$${trade.commission}` },
    { label: 'Strategy', value: trade.strategy },
    { label: 'Timeframe', value: trade.timeframe },
    { label: 'Session', value: trade.session },
    { label: 'Exit Type', value: trade.exitType.toUpperCase() },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`${trade.pair} ${trade.direction.toUpperCase()}`}>
      {/* P&L Header */}
      <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div>
          <div style={{ fontSize: 11, color: '#4A5568' }}>{dateStr} · {timeStr}</div>
          <div
            className="font-mono"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: isWin ? '#10B981' : '#EF4444',
              marginTop: 4,
            }}
          >
            {isWin ? '+' : ''}${trade.profitLoss}
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: trade.direction === 'buy' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${trade.direction === 'buy' ? 'rgba(16, 185, 129, 0.20)' : 'rgba(239, 68, 68, 0.20)'}`,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: trade.direction === 'buy' ? '#10B981' : '#EF4444',
            }}
          >
            {trade.direction === 'buy' ? 'B' : 'S'}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        {fields.map((f) => (
          <div key={f.label}>
            <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 2 }}>{f.label}</div>
            <div className="font-mono" style={{ fontSize: 14, color: '#F0F2F5', fontWeight: 500 }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {/* Setup Quality */}
      <div className="py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 8 }}>Setup Quality</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              fill={star <= trade.setupQuality ? '#F59E0B' : 'transparent'}
              stroke={star <= trade.setupQuality ? '#F59E0B' : 'rgba(255, 255, 255, 0.10)'}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>

      {/* Emotions */}
      {trade.emotions.length > 0 && (
        <div className="py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 8 }}>Emotions</div>
          <div className="flex flex-wrap gap-2">
            {trade.emotions.map((e) => (
              <span
                key={e}
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 12,
                  background: 'rgba(45, 212, 168, 0.12)',
                  color: '#2DD4A8',
                  border: '1px solid rgba(45, 212, 168, 0.20)',
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mistakes */}
      {trade.mistakes.length > 0 && (
        <div className="py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 8 }}>Mistakes</div>
          <div className="flex flex-wrap gap-2">
            {trade.mistakes.map((m) => (
              <span
                key={m}
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 12,
                  background: 'rgba(245, 158, 11, 0.10)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.20)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {trade.tags.length > 0 && (
        <div className="py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 8 }}>Tags</div>
          <div className="flex flex-wrap gap-2">
            {trade.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#8B95A5',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Screenshots */}
      {trade.screenshots.length > 0 && (
        <div className="py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 8 }}>Screenshots ({trade.screenshots.length})</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {trade.screenshots.map((s, i) => (
              <img
                key={i}
                src={s}
                alt={`Screenshot ${i + 1}`}
                style={{
                  width: 200,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {trade.notes && (
        <div className="py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 8 }}>Notes</div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              padding: 16,
              borderRadius: 10,
              fontSize: 14,
              color: '#8B95A5',
              lineHeight: 1.6,
            }}
          >
            {trade.notes}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          className="flex-1 flex items-center justify-center gap-2"
          style={{
            height: 48,
            borderRadius: 12,
            border: '1px solid rgba(45, 212, 168, 0.30)',
            color: '#2DD4A8',
            fontSize: 14,
            fontWeight: 600,
            background: 'rgba(45, 212, 168, 0.08)',
          }}
          onClick={() => onEdit?.(trade)}
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2"
          style={{
            height: 48,
            borderRadius: 12,
            border: '1px solid rgba(239, 68, 68, 0.30)',
            color: '#EF4444',
            fontSize: 14,
            fontWeight: 600,
            background: 'rgba(239, 68, 68, 0.08)',
          }}
          onClick={() => onDelete?.(trade.id)}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </BottomSheet>
  );
}
