import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

import type { ToastData } from '../types';

// Re-export for convenience
export type { ToastData };

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-14 left-0 right-0 z-[80] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const colors = {
    success: { border: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', icon: '#10B981' },
    error: { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', icon: '#EF4444' },
    info: { border: '#2DD4A8', bg: 'rgba(45, 212, 168, 0.08)', icon: '#2DD4A8' },
  };

  const c = colors[toast.type];
  const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? XCircle : Info;

  return (
    <motion.div
      className="pointer-events-auto flex items-center gap-2"
      style={{
        background: 'rgba(20, 24, 28, 0.95)',
        backdropFilter: 'blur(16px)',
        borderLeft: `3px solid ${c.border}`,
        borderRadius: 8,
        padding: '10px 16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        minWidth: 200,
        maxWidth: '90vw',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <Icon size={16} color={c.icon} />
      <span style={{ fontSize: 13, fontWeight: 500, color: '#F0F2F5' }}>
        {toast.message}
      </span>
    </motion.div>
  );
}
