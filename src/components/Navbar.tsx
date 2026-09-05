'use client';

import React from 'react';
import { Activity, Dumbbell, Utensils, MessageSquare, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/types/fitness';

interface NavbarProps {
  activeTab: 'dashboard' | 'schedule' | 'diet' | 'meals' | 'workouts' | 'chat';
  setActiveTab: (tab: 'dashboard' | 'schedule' | 'diet' | 'meals' | 'workouts' | 'chat') => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  completedExercisesCount: number;
  totalExercisesCount: number;
}

interface NavTabItem {
  id: 'dashboard' | 'schedule' | 'diet' | 'meals' | 'workouts' | 'chat';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
  completedExercisesCount,
  totalExercisesCount,
}) => {
  const tabs: NavTabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'schedule', label: "Today's Schedule", icon: CheckCircle2, badge: `${completedExercisesCount}/${totalExercisesCount}` },
    { id: 'diet', label: 'Diet Analysis', icon: Utensils },
    { id: 'meals', label: 'Meal Plan', icon: Sparkles },
    { id: 'workouts', label: 'AI Workouts', icon: Dumbbell },
    { id: 'chat', label: 'Coach Chat', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">PULSE<span className="text-emerald-400">.AI</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">Fitness & Nutrition Brain</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'text-white bg-zinc-800 shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 transition-all duration-200 text-xs font-medium group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-zinc-200 font-semibold text-xs leading-none">
                {profile.weight}kg • {profile.age}y
              </div>
              <div className="text-[10px] text-zinc-400 max-w-[90px] truncate leading-tight mt-0.5">
                {profile.fitnessGoal || 'Set Goals'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-900 bg-zinc-950/95 px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[55px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
