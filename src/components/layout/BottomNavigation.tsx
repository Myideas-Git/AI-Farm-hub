import React from 'react';
import { Home, Trees, PlusCircle, LineChart, Store } from 'lucide-react';
import { NavTab } from './TopBar';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'my-farm' as NavTab, label: 'My Farm', icon: Trees },
    { id: 'record' as NavTab, label: 'Record', icon: PlusCircle, isHighlight: true },
    { id: 'insights' as NavTab, label: 'Insights', icon: LineChart },
    { id: 'market' as NavTab, label: 'Market', icon: Store },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isHighlight) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center h-full min-h-[44px] focus:outline-hidden"
                aria-label="Record Farm Event"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-xs ${
                    isActive
                      ? 'bg-emerald-900 text-white'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] font-semibold mt-0.5 ${
                    isActive ? 'text-emerald-900' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-500 hover:text-slate-900 focus:outline-hidden transition-colors"
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-emerald-800 stroke-[2.4]'
                    : 'text-slate-500 stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  isActive ? 'text-emerald-900 font-semibold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
