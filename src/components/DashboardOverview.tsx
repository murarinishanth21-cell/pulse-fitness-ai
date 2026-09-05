'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Flame,
  Utensils,
  Dumbbell,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  PieChart,
  ArrowRight,
  TrendingUp,
  User,
} from 'lucide-react';
import { UserProfile, ExerciseItem, DailyMealPlan, DietAnalysisResult } from '@/types/fitness';

interface DashboardOverviewProps {
  profile: UserProfile;
  schedule: ExerciseItem[];
  mealPlan: DailyMealPlan | null;
  dietAnalysis: DietAnalysisResult | null;
  onNavigate: (tab: 'schedule' | 'diet' | 'meals' | 'workouts' | 'chat') => void;
  onOpenProfile: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profile,
  schedule,
  mealPlan,
  dietAnalysis,
  onNavigate,
  onOpenProfile,
}) => {
  const completedExercises = schedule.filter((e) => e.completed).length;
  const totalExercises = schedule.length;
  const workoutProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const quickActions = [
    {
      title: 'Diet Analysis',
      desc: 'Check macros, protein deficits & meal timing',
      icon: Utensils,
      tab: 'diet' as const,
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Generate Meal Plan',
      desc: 'Custom 1-day breakfast, lunch & dinner with recipes',
      icon: Sparkles,
      tab: 'meals' as const,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'AI Workout Planner',
      desc: 'Create targeted split routines & push to tracker',
      icon: Dumbbell,
      tab: 'workouts' as const,
      color: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'AI Fitness Coach',
      desc: 'Ask about food swaps, form cues & recovery',
      icon: MessageSquare,
      tab: 'chat' as const,
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden">
        {/* Glow circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              Daily Fitness Command Center
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome Back, Athlete
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl">
              Target Goal: <span className="text-emerald-400 font-semibold">{profile.fitnessGoal}</span> • Body Weight: <span className="text-white font-medium">{profile.weight}kg</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Metrics</span>
            </button>
            <button
              onClick={() => onNavigate('schedule')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Go to Workout Tracker</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Workout Progress */}
        <div
          onClick={() => onNavigate('schedule')}
          className="glass-card rounded-3xl p-6 border border-zinc-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Today&apos;s Workout</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{workoutProgress}%</span>
            <span className="text-xs text-zinc-400 font-medium">completed</span>
          </div>

          <div className="mt-3 w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-emerald-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${workoutProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
            <span>{completedExercises} of {totalExercises} exercises checked</span>
            <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              View &rarr;
            </span>
          </div>
        </div>

        {/* Nutritional Goal Alignment */}
        <div
          onClick={() => onNavigate('diet')}
          className="glass-card rounded-3xl p-6 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Diet Diagnostic</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {dietAnalysis ? `${dietAnalysis.healthScore}/100` : 'Analyze'}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              {dietAnalysis ? 'Health Score' : 'Needs Scan'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {dietAnalysis ? dietAnalysis.summary : 'Analyze your current diet to reveal protein gaps and optimal calorie targets.'}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>{dietAnalysis ? 'See full report' : 'Run instant check'}</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Meal Plan Blueprint */}
        <div
          onClick={() => onNavigate('meals')}
          className="glass-card rounded-3xl p-6 border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Meal Blueprint</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {mealPlan ? `${mealPlan.totalCalories}` : '1-Day Plan'}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              {mealPlan ? 'kcal total' : 'Ready to generate'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {mealPlan ? `${mealPlan.meals.length} high-protein meals structured with ingredients & macro targets.` : 'Tailored recipes for breakfast, lunch, dinner & recovery snacks.'}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>{mealPlan ? 'View meals & recipes' : 'Generate meal plan'}</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div>
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          AI Fitness & Nutrition Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                onClick={() => onNavigate(action.tab)}
                className={`glass-card rounded-2xl p-5 border ${action.borderColor} cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} border ${action.borderColor} flex items-center justify-center ${action.iconColor} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-white pt-2 border-t border-zinc-800/60">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
