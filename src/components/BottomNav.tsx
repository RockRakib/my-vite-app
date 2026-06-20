import { LayoutDashboard, PlusCircle, BookOpen, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TabName } from '../types';
import { haptic } from '../db';

interface BottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const tabs: { key: TabName; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'add-trade', label: 'Add Trade', icon: PlusCircle },
  { key: 'journal', label: 'Journal', icon: BookOpen },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const handleTabClick = (tab: TabName) => {
    haptic();
    onTabChange(tab);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(13, 15, 17, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const isAddTrade = tab.key === 'add-trade';
        const Icon = tab.icon;

        return (
          <motion.button
            key={tab.key}
            className="flex flex-col items-center justify-center gap-1 relative"
            style={{
              width: 64,
              height: isAddTrade ? 56 : 48,
              color: isActive ? '#2DD4A8' : 'rgba(255, 255, 255, 0.35)',
              transition: 'color 0.25s ease',
            }}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleTabClick(tab.key)}
          >
            {isAddTrade && (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(45, 212, 168, 0.12)',
                  border: '1px solid rgba(45, 212, 168, 0.25)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
            <Icon
              size={isAddTrade ? 26 : 24}
              strokeWidth={isActive ? 2 : 1.5}
              style={{ position: 'relative', zIndex: 1 }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.02em',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
