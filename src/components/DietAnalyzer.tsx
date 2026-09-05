'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Droplets,
  Loader2,
  TrendingUp,
  RefreshCw,
  PieChart,
} from 'lucide-react';
import { UserProfile, DietAnalysisResult } from '@/types/fitness';
import { analyzeDietAction } from '@/app/actions/fitnessActions';

interface DietAnalyzerProps {
  profile: UserProfile;
  latestAnalysis: DietAnalysisResult | null;
  dietDraft?: string;
  onSaveDietDraft?: (draft: string) => void;
  onSaveAnalysis: (result: DietAnalysisResult) => void;
  onNavigateToMealPlan: () => void;
  onOpenProfile: () => void;
}

export const DietAnalyzer: React.FC<DietAnalyzerProps> = ({
  profile,
  latestAnalysis,
  dietDraft,
  onSaveDietDraft,
  onSaveAnalysis,
  onNavigateToMealPlan,
  onOpenProfile,
}) => {
  const [currentDietInput, setCurrentDietInput] = useState(dietDraft || profile.currentDiet);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (val: string) => {
    setCurrentDietInput(val);
    if (onSaveDietDraft) onSaveDietDraft(val);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentDietInput.trim()) {
      setErrorMsg('Please describe your current daily diet.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const updatedProfile = { ...profile, currentDiet: currentDietInput };
    const response = await analyzeDietAction(updatedProfile);

    setLoading(false);
    if (response.success && response.data) {
      onSaveAnalysis(response.data);
    } else {
      setErrorMsg(response.error || 'Failed to analyze diet. Check your Gemini API key in .env.local');
    }
  };

  const samplePresets = [
    {
      label: 'Pasta & Skip Lunch (Example Case)',
      text: 'I usually eat eggs for breakfast, skip lunch, and have pasta for dinner.',
    },
    {
      label: 'Fast Food / Office Worker',
      text: 'Coffee and donut for breakfast, takeout burrito or burger for lunch, pizza or microwave meal for dinner.',
    },
    {
      label: 'High Carb / Light Protein',
      text: 'Toast with butter & tea for breakfast, instant noodles for lunch, white rice with lentils/curry for dinner.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Utensils className="w-3.5 h-3.5" />
              Nutritional AI Diagnostic
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Diet & Macronutrient Analysis
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              PulseAI compares your eating habits against your goal: <span className="text-emerald-400 font-semibold">{profile.fitnessGoal}</span>
            </p>
          </div>

          <button
            onClick={onOpenProfile}
            className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl self-start transition-all"
          >
            Edit Goal & Weight Metrics &rarr;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300">
                What does your typical day of eating look like?
              </label>
              <div className="flex items-center gap-1">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInputChange(preset.text)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-300 border border-zinc-800 transition-all hidden sm:inline-block"
                  >
                    {preset.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={currentDietInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="e.g. 2 eggs on toast for breakfast, skipped lunch, large bowl of pasta with cheese for dinner..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-zinc-400">
              User: <span className="text-zinc-200">{profile.weight}kg</span> • Goal: <span className="text-zinc-200">{profile.fitnessGoal}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini is analyzing your diet...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Diet Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {latestAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Summary & Health Alignment Score */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  AI Nutritional Synthesis
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">Executive Assessment</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{latestAnalysis.summary}</p>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 self-start sm:self-auto min-w-[170px]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-2xl">
                  {latestAnalysis.healthScore || 72}
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase font-semibold">Goal Fit Score</div>
                  <div className="text-sm font-bold text-zinc-200">
                    {latestAnalysis.healthScore > 75 ? 'Strong Match' : latestAnalysis.healthScore > 50 ? 'Needs Tweaking' : 'Significant Deficit'}
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Comparison Grid */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                Current Estimated vs. Ideal Target Macros
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* Calories */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-medium">Daily Calories</div>
                  <div className="text-lg font-black text-white mt-1">
                    {latestAnalysis.estimatedMacros?.calories || 0}{' '}
                    <span className="text-xs font-normal text-zinc-500">kcal</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-mono">
                    Target: {latestAnalysis.targetMacros?.calories || 0} kcal
                  </div>
                </div>

                {/* Protein */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 relative">
                  <div className="text-xs text-emerald-400 font-semibold flex items-center justify-between">
                    <span>Protein</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">Key</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1">
                    {latestAnalysis.estimatedMacros?.proteinGrams || 0}g
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-mono">
                    Target: {latestAnalysis.targetMacros?.proteinGrams || 0}g
                  </div>
                </div>

                {/* Carbs */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-medium">Carbohydrates</div>
                  <div className="text-lg font-black text-white mt-1">
                    {latestAnalysis.estimatedMacros?.carbsGrams || 0}g
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                    Target: {latestAnalysis.targetMacros?.carbsGrams || 0}g
                  </div>
                </div>

                {/* Fats */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-medium">Healthy Fats</div>
                  <div className="text-lg font-black text-white mt-1">
                    {latestAnalysis.estimatedMacros?.fatsGrams || 0}g
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                    Target: {latestAnalysis.targetMacros?.fatsGrams || 0}g
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses 2-Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>What Is Working Well</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                {latestAnalysis.strengths?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Deficits */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Nutritional Gaps & Obstacles</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                {latestAnalysis.weaknesses?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations & Hydration */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Actionable Nutritional Prescription</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {latestAnalysis.recommendations?.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-zinc-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {latestAnalysis.hydrationTip && (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm flex items-center gap-3">
                <Droplets className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span><strong>Hydration Target:</strong> {latestAnalysis.hydrationTip}</span>
              </div>
            )}

            {/* Quick Next Step CTA */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-400 text-center sm:text-left">
                Ready to fix these gaps? Generate a high-protein 1-day meal plan automatically adjusted for you.
              </p>
              <button
                onClick={onNavigateToMealPlan}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Custom Meal Plan &rarr;</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
