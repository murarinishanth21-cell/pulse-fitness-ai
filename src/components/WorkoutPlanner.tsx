'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Sparkles,
  Flame,
  Clock,
  Zap,
  CheckCircle,
  Plus,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, WorkoutRoutine, ExerciseItem } from '@/types/fitness';
import { generateWorkoutAction } from '@/app/actions/fitnessActions';

interface WorkoutPlannerProps {
  profile: UserProfile;
  workout: WorkoutRoutine | null;
  onSaveWorkout: (routine: WorkoutRoutine) => void;
  onSyncToSchedule: (exercises: ExerciseItem[]) => void;
  onOpenProfile: () => void;
}

const SPLIT_OPTIONS = [
  'Upper Body Hypertrophy & Power',
  'Lower Body & Glute Strength',
  'Push Workout (Chest, Shoulders, Triceps)',
  'Pull Workout (Back, Biceps, Rear Delts)',
  'Full Body Athletic Conditioning',
  'Core, Abs & High-Intensity Cardio',
];

const EQUIPMENT_OPTIONS = [
  'Full Gym (Barbells, Dumbbells, Cables, Machines)',
  'Dumbbells & Bench (Home Gym)',
  'Bodyweight & Resistance Bands Only (No Equipment)',
  'Kettlebell & Bodyweight',
];

export const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({
  profile,
  workout,
  onSaveWorkout,
  onSyncToSchedule,
  onOpenProfile,
}) => {
  const [selectedSplit, setSelectedSplit] = useState(SPLIT_OPTIONS[0]);
  const [selectedEquipment, setSelectedEquipment] = useState(EQUIPMENT_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSyncSuccess(false);

    const response = await generateWorkoutAction(profile, selectedSplit, selectedEquipment);
    setLoading(false);

    if (response.success && response.data) {
      onSaveWorkout(response.data);
    } else {
      setErrorMsg(response.error || 'Failed to generate workout. Check your Gemini API key in .env.local');
    }
  };

  const handleSendToSchedule = () => {
    if (!workout || !workout.exercises) return;
    const formattedExercises: ExerciseItem[] = workout.exercises.map((ex, i) => ({
      ...ex,
      id: ex.id || `gen-${Date.now()}-${i}`,
      completed: false,
    }));
    onSyncToSchedule(formattedExercises);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Dumbbell className="w-3.5 h-3.5" />
              AI Training Program Designer
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tailored Workout Generator
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Constructed specifically for: <span className="text-emerald-400 font-semibold">{profile.fitnessGoal}</span> • Weight: <span className="text-zinc-200">{profile.weight}kg</span>
            </p>
          </div>

          <button
            onClick={onOpenProfile}
            className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl self-start transition-all"
          >
            Edit Goal Profile &rarr;
          </button>
        </div>

        {/* Focus Split & Equipment Selectors */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              Select Target Workout Split
            </label>
            <div className="space-y-2">
              {SPLIT_OPTIONS.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSplit(opt)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                    selectedSplit === opt
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                      : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800/80 text-zinc-300'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedSplit === opt && <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                Available Equipment
              </label>
              <div className="space-y-2">
                {EQUIPMENT_OPTIONS.map((eq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedEquipment(eq)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                      selectedEquipment === eq
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    <span>{eq}</span>
                    {selectedEquipment === eq && <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Engineering Routine with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Workout Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Generated Workout Routine Card */}
      {workout && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header Info & Sync Button */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {workout.difficulty || 'Intermediate'}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{workout.estimatedDurationMinutes || 45} mins
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{workout.routineName}</h3>
                <p className="text-xs text-zinc-400 mt-1">Focus Target: {workout.targetFocus}</p>
              </div>

              {/* Sync Action */}
              <button
                onClick={handleSendToSchedule}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  syncSuccess
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 hover:scale-[1.02]'
                }`}
              >
                {syncSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Synced to Today&apos;s Schedule!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add All to Today&apos;s Schedule</span>
                  </>
                )}
              </button>
            </div>

            {/* Warmup & Cooldown Pill Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {workout.warmup && workout.warmup.length > 0 && (
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Dynamic Warm-up (3-5 mins)
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {workout.warmup.map((w, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {workout.cooldown && workout.cooldown.length > 0 && (
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Cooldown & Recovery (3-5 mins)
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {workout.cooldown.map((c, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              Main Workout Exercises ({workout.exercises.length})
            </h4>

            {workout.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-zinc-800 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm sm:text-base">{ex.name}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                        {ex.targetMuscle}
                      </span>
                    </div>

                    {ex.formTip && (
                      <p className="text-xs text-zinc-400 mt-1">
                        <strong className="text-emerald-400 font-semibold">Form cue:</strong> {ex.formTip}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-emerald-400">
                      {ex.sets} sets &times; {ex.repsOrDuration}
                    </div>
                    {ex.restSeconds && (
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {ex.restSeconds}s rest
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
