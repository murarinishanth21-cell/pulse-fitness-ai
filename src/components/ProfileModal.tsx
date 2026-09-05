'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, User, Flame, Dumbbell, ShieldCheck } from 'lucide-react';
import { UserProfile } from '@/types/fitness';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const PRESETS = [
  {
    title: 'Fat Loss & Lean Muscle (Example Case)',
    age: 25,
    weight: 70,
    height: 175,
    activityLevel: 'moderate' as const,
    fitnessGoal: 'Lose 5kg of fat and build lean athletic muscle',
    currentDiet: 'I usually eat eggs for breakfast, skip lunch, and have pasta for dinner.',
    allergiesOrPreferences: 'Prefers high protein, busy schedule',
  },
  {
    title: 'Muscle Hypertrophy & Strength',
    age: 28,
    weight: 78,
    height: 180,
    activityLevel: 'very_active' as const,
    fitnessGoal: 'Gain 4kg clean muscle mass and increase strength',
    currentDiet: 'Oatmeal & whey in morning, rice & chicken at lunch, light dinner with snacks.',
    allergiesOrPreferences: 'High carb & high protein focus',
  },
  {
    title: 'Endurance & Clean Energy',
    age: 32,
    weight: 65,
    height: 170,
    activityLevel: 'moderate' as const,
    fitnessGoal: 'Run 10km consistently and tone core',
    currentDiet: 'Coffee & toast, salads, sandwich or stir-fry at night.',
    allergiesOrPreferences: 'Vegetarian friendly, low refined sugar',
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFormData({
      age: preset.age,
      weight: preset.weight,
      height: preset.height,
      activityLevel: preset.activityLevel,
      fitnessGoal: preset.fitnessGoal,
      currentDiet: preset.currentDiet,
      allergiesOrPreferences: preset.allergiesOrPreferences,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-zinc-700/80 bg-zinc-950 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Your Fitness & Diet Profile</h2>
                  <p className="text-xs text-zinc-400">Customizes all AI workout routines & nutritional analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Quick Preset Scenarios
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-left p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-emerald-500/40 transition-all text-xs group"
                  >
                    <div className="font-semibold text-zinc-200 group-hover:text-emerald-400 truncate">
                      {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {preset.weight}kg • {preset.age}y • {preset.activityLevel}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Age</label>
                  <input
                    type="number"
                    min={12}
                    max={100}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Weight (kg)</label>
                  <input
                    type="number"
                    min={30}
                    max={250}
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Height (cm)</label>
                  <input
                    type="number"
                    min={100}
                    max={230}
                    value={formData.height || 175}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as UserProfile['activityLevel'] })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="sedentary">Sedentary (Desk job, little/no exercise)</option>
                  <option value="light">Lightly Active (1-2 workouts/week)</option>
                  <option value="moderate">Moderately Active (3-4 workouts/week)</option>
                  <option value="very_active">Very Active (5+ heavy workouts/week)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  Primary Fitness Goal
                </label>
                <input
                  type="text"
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  placeholder="e.g., I want to lose 5kg and build lean muscle"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                  Current Daily Diet & Eating Habits
                </label>
                <textarea
                  rows={3}
                  value={formData.currentDiet}
                  onChange={(e) => setFormData({ ...formData, currentDiet: e.target.value })}
                  placeholder="e.g. I usually eat eggs for breakfast, skip lunch, and have pasta for dinner."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  required
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Be as honest as possible so the AI can identify true macronutrient deficits.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Allergies / Dietary Restrictions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.allergiesOrPreferences || ''}
                  onChange={(e) => setFormData({ ...formData, allergiesOrPreferences: e.target.value })}
                  placeholder="e.g., No nuts, lactose intolerant, vegetarian, high protein focus"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
