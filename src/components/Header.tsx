import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: 52,
        background: 'rgba(13, 15, 17, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            background: 'rgba(45, 212, 168, 0.15)',
            borderRadius: 8,
            border: '1px solid rgba(45, 212, 168, 0.25)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2DD4A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: '-0.02em',
            color: '#F0F2F5',
          }}
        >
          TradeVault
        </span>
      </div>
      <button
        className="flex items-center justify-center"
        style={{ width: 40, height: 40, color: '#8B95A5' }}
        onClick={() => {}}
      >
        <Bell size={20} strokeWidth={1.5} />
      </button>
    </header>
  );
}
