'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ProfileModal } from '@/components/ProfileModal';
import { DashboardOverview } from '@/components/DashboardOverview';
import { TodaySchedule } from '@/components/TodaySchedule';
import { DietAnalyzer } from '@/components/DietAnalyzer';
import { MealPlanView } from '@/components/MealPlanView';
import { WorkoutPlanner } from '@/components/WorkoutPlanner';
import { AiChatCoach } from '@/components/AiChatCoach';
import {
  UserProfile,
  ExerciseItem,
  DailyMealPlan,
  DietAnalysisResult,
} from '@/types/fitness';
import {
  DEFAULT_PROFILE,
  DEFAULT_SCHEDULE,
  getStoredProfile,
  saveStoredProfile,
  getStoredSchedule,
  saveStoredSchedule,
  getStoredMealPlan,
  saveStoredMealPlan,
  getStoredDietAnalysis,
  saveStoredDietAnalysis,
} from '@/lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'diet' | 'meals' | 'workouts' | 'chat'>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State with safe localStorage defaults
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [schedule, setSchedule] = useState<ExerciseItem[]>(DEFAULT_SCHEDULE);
  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null);
  const [dietAnalysis, setDietAnalysis] = useState<DietAnalysisResult | null>(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setProfile(getStoredProfile());
    setSchedule(getStoredSchedule());
    setMealPlan(getStoredMealPlan());
    setDietAnalysis(getStoredDietAnalysis());
    setIsClientLoaded(true);
  }, []);

  // Handlers
  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleToggleExercise = (id: string) => {
    setSchedule((prev) => {
      const updated = prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      );
      saveStoredSchedule(updated);
      return updated;
    });
  };

  const handleAddExercise = (newEx: ExerciseItem) => {
    setSchedule((prev) => {
      const updated = [newEx, ...prev];
      saveStoredSchedule(updated);
      return updated;
    });
  };

  const handleDeleteExercise = (id: string) => {
    setSchedule((prev) => {
      const updated = prev.filter((ex) => ex.id !== id);
      saveStoredSchedule(updated);
      return updated;
    });
  };

  const handleResetSchedule = () => {
    setSchedule((prev) => {
      const updated = prev.map((ex) => ({ ...ex, completed: false }));
      saveStoredSchedule(updated);
      return updated;
    });
  };

  const handleSyncWorkoutToSchedule = (exercises: ExerciseItem[]) => {
    setSchedule(exercises);
    saveStoredSchedule(exercises);
    setActiveTab('schedule');
  };

  const handleSaveMealPlan = (plan: DailyMealPlan) => {
    setMealPlan(plan);
    saveStoredMealPlan(plan);
  };

  const handleSaveDietAnalysis = (analysis: DietAnalysisResult) => {
    setDietAnalysis(analysis);
    saveStoredDietAnalysis(analysis);
  };

  const completedCount = schedule.filter((e) => e.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        completedExercisesCount={completedCount}
        totalExercisesCount={schedule.length}
      />

      {/* Main Content Area with Smooth Page Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardOverview
                profile={profile}
                schedule={schedule}
                mealPlan={mealPlan}
                dietAnalysis={dietAnalysis}
                onNavigate={setActiveTab}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TodaySchedule
                schedule={schedule}
                onToggleExercise={handleToggleExercise}
                onAddExercise={handleAddExercise}
                onDeleteExercise={handleDeleteExercise}
                onResetSchedule={handleResetSchedule}
                onNavigateToWorkouts={() => setActiveTab('workouts')}
              />
            </motion.div>
          )}

          {activeTab === 'diet' && (
            <motion.div
              key="diet"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DietAnalyzer
                profile={profile}
                latestAnalysis={dietAnalysis}
                onSaveAnalysis={handleSaveDietAnalysis}
                onNavigateToMealPlan={() => setActiveTab('meals')}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'meals' && (
            <motion.div
              key="meals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MealPlanView
                profile={profile}
                mealPlan={mealPlan}
                onSaveMealPlan={handleSaveMealPlan}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'workouts' && (
            <motion.div
              key="workouts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <WorkoutPlanner
                profile={profile}
                onSyncToSchedule={handleSyncWorkoutToSchedule}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AiChatCoach
                profile={profile}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Profile Configuration Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-zinc-400">PulseAI Fitness & Nutrition Platform</span>
          </div>
          <div>Powered by Google Gemini Generative AI • LocalStorage Encrypted</div>
        </div>
      </footer>
    </div>
  );
}
