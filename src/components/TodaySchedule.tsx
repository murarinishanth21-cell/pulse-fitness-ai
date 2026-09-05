'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Plus,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  Flame,
  Timer,
  Dumbbell,
  Trophy,
} from 'lucide-react';
import { ExerciseItem } from '@/types/fitness';

interface TodayScheduleProps {
  schedule: ExerciseItem[];
  onToggleExercise: (id: string) => void;
  onAddExercise: (exercise: ExerciseItem) => void;
  onDeleteExercise: (id: string) => void;
  onResetSchedule: () => void;
  onNavigateToWorkouts: () => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({
  schedule,
  onToggleExercise,
  onAddExercise,
  onDeleteExercise,
  onResetSchedule,
  onNavigateToWorkouts,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState('10-12 reps');
  const [newExTip, setNewExTip] = useState('');

  const completedCount = schedule.filter((e) => e.completed).length;
  const totalCount = schedule.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx: ExerciseItem = {
      id: `custom-${Date.now()}`,
      name: newExName.trim(),
      targetMuscle: newExMuscle.trim() || 'General / Core',
      sets: Number(newExSets) || 3,
      repsOrDuration: newExReps.trim() || '10-12 reps',
      restSeconds: 60,
      formTip: newExTip.trim() || 'Keep controlled tempo and stay braced.',
      completed: false,
    };

    onAddExercise(newEx);
    setNewExName('');
    setNewExMuscle('');
    setNewExTip('');
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" />
              Active Daily Routine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Today&apos;s Workout Schedule
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Track your sets, maintain consistent form, and check off exercises in real-time.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-5 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800/80 min-w-[240px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="text-emerald-400"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${progressPercent}, 100` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-xs text-white">
                {progressPercent}%
              </span>
            </div>

            <div>
              <div className="text-xs text-zinc-400 font-medium">Completed</div>
              <div className="text-lg font-bold text-white">
                {completedCount} <span className="text-xs font-normal text-zinc-500">/ {totalCount} exercises</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                {isAllCompleted ? '🔥 Workout Finished!' : `${totalCount - completedCount} remaining`}
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Custom Exercise</span>
            </button>
            <button
              onClick={onResetSchedule}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Reset all checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Checks</span>
            </button>
          </div>

          <button
            onClick={onNavigateToWorkouts}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Workout Plan with AI &rarr;</span>
          </button>
        </div>
      </div>

      {/* Completion Trophy Card */}
      <AnimatePresence>
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border border-emerald-500/40 text-center relative overflow-hidden neon-glow"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Daily Workout Completed!</h3>
              <p className="text-xs text-zinc-300 max-w-md">
                Incredible job pushing through today&apos;s routine. Remember to drink 500ml water and eat a high-protein recovery meal within 45 minutes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Custom Exercise Inline Drawer */}
      <AnimatePresence>
        {isAddingCustom && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCustom}
            className="glass-card rounded-2xl p-5 space-y-4 border border-emerald-500/30 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                Add Custom Exercise Item
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bulgarian Split Squats"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Target Muscle</label>
                <input
                  type="text"
                  placeholder="e.g. Quads & Glutes"
                  value={newExMuscle}
                  onChange={(e) => setNewExMuscle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Sets</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newExSets}
                  onChange={(e) => setNewExSets(parseInt(e.target.value) || 3)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Reps / Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 10-12 reps or 45s"
                  value={newExReps}
                  onChange={(e) => setNewExReps(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Form Tip / Cue (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Keep torso upright and drive through front heel"
                value={newExTip}
                onChange={(e) => setNewExTip(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-all"
              >
                Add to Schedule
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Exercise List with Smooth Framer Motion */}
      <div className="space-y-3">
        {schedule.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-zinc-800">
            <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">No exercises in today&apos;s schedule.</p>
            <button
              onClick={onNavigateToWorkouts}
              className="mt-3 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate tailored workout with Gemini AI
            </button>
          </div>
        ) : (
          schedule.map((exercise, index) => {
            const isCompleted = !!exercise.completed;
            const isExpanded = expandedId === exercise.id;

            return (
              <motion.div
                key={exercise.id || index}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`group rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
                  isCompleted
                    ? 'bg-zinc-950/40 border-zinc-800/40 opacity-70'
                    : 'glass-card hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left Checkbox & Details */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleExercise(exercise.id)}
                      className="flex-shrink-0 cursor-pointer focus:outline-none transition-transform active:scale-90"
                      aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0.5, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black"
                        >
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-black stroke-[3]" />
                        </motion.div>
                      ) : (
                        <Circle className="w-6 h-6 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm transition-all duration-200 ${
                            isCompleted
                              ? 'line-through text-zinc-500'
                              : 'text-zinc-100 group-hover:text-white'
                          }`}
                        >
                          {exercise.name}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/40">
                          {exercise.targetMuscle}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                        <span className="font-mono text-emerald-400/90 font-medium">
                          {exercise.sets} sets &times; {exercise.repsOrDuration}
                        </span>
                        {exercise.restSeconds && (
                          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <Timer className="w-3 h-3" />
                            {exercise.restSeconds}s rest
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1">
                    {exercise.formTip && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : exercise.id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors text-xs flex items-center gap-1"
                        title="Form Tip"
                      >
                        <span className="hidden sm:inline text-[11px]">Tip</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteExercise(exercise.id)}
                      className="p-2 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Tip Accordion */}
                <AnimatePresence>
                  {isExpanded && exercise.formTip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-300 flex items-start gap-2 bg-zinc-900/40 p-3 rounded-xl"
                    >
                      <span className="text-emerald-400 font-bold">💡 Form Cue:</span>
                      <span>{exercise.formTip}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
