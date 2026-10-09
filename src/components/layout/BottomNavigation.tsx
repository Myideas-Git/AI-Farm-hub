import React from 'react';
import { Home, Trees, PlusCircle, LineChart, Store } from 'lucide-react';
import { NavTab } from './TopBar';
import { AppLanguage } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language?: AppLanguage;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  language = 'Telugu',
}) => {
  const t = getTranslations(language);

  const tabs = [
    { id: 'home' as NavTab, label: t.nav.home, icon: Home },
    { id: 'my-farm' as NavTab, label: t.nav.myFarm, icon: Trees },
    { id: 'record' as NavTab, label: t.nav.record, icon: PlusCircle, isHighlight: true },
    { id: 'insights' as NavTab, label: t.nav.insights, icon: LineChart },
    { id: 'market' as NavTab, label: t.nav.market, icon: Store },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800"
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
                aria-label={tab.label}
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
                    isActive ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
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
              className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-hidden transition-colors"
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-400 stroke-[2.4]'
                    : 'text-slate-500 dark:text-slate-400 stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-[55px] ${
                  isActive ? 'text-emerald-900 dark:text-emerald-300 font-semibold' : 'text-slate-500 dark:text-slate-400'
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
