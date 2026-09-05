'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Flame,
  Check,
  RotateCcw,
  Loader2,
  AlertTriangle,
  ShoppingBag,
  ChefHat,
  Bookmark,
} from 'lucide-react';
import { UserProfile, DailyMealPlan } from '@/types/fitness';
import { generateMealPlanAction } from '@/app/actions/fitnessActions';

interface MealPlanViewProps {
  profile: UserProfile;
  mealPlan: DailyMealPlan | null;
  onSaveMealPlan: (plan: DailyMealPlan) => void;
  onOpenProfile: () => void;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({
  profile,
  mealPlan,
  onSaveMealPlan,
  onOpenProfile,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedLocally, setSavedLocally] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    const response = await generateMealPlanAction(profile);
    setLoading(false);

    if (response.success && response.data) {
      onSaveMealPlan(response.data);
      setSavedLocally(true);
      setTimeout(() => setSavedLocally(false), 2000);
    } else {
      setErrorMsg(response.error || 'Failed to generate meal plan. Check your Gemini API key in .env.local.');
    }
  };

  const getMealBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'lunch':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'dinner':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              Tailored 1-Day Nutrition Protocol
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Personalized Meal Plan
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Optimized for: <span className="text-emerald-400 font-semibold">{profile.fitnessGoal}</span> • Weight: <span className="text-zinc-200">{profile.weight}kg</span>
              {profile.allergiesOrPreferences ? ` • Restrictions: ${profile.allergiesOrPreferences}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2.5 rounded-xl transition-all"
            >
              Update Diet Goals
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Crafting Meals with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{mealPlan ? 'Regenerate Plan' : 'Generate 1-Day Meal Plan'}</span>
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

        {/* Total Nutrition Targets Banner */}
        {mealPlan && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Daily Target Calories</div>
              <div className="text-xl font-black text-white mt-1">
                {mealPlan.totalCalories} <span className="text-xs font-normal text-zinc-500">kcal</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-xs text-emerald-400 font-semibold">Total Protein</div>
              <div className="text-xl font-black text-white mt-1">
                {mealPlan.totalProtein}g <span className="text-xs font-normal text-emerald-400/80">({Math.round((mealPlan.totalProtein * 4 / mealPlan.totalCalories) * 100)}% cals)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Total Carbs</div>
              <div className="text-xl font-black text-white mt-1">
                {mealPlan.totalCarbs}g
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Healthy Fats</div>
              <div className="text-xl font-black text-white mt-1">
                {mealPlan.totalFat}g
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meals Grid */}
      {mealPlan ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mealPlan.meals.map((meal, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 border border-zinc-800/90 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getMealBadgeColor(meal.mealType)}`}>
                      {meal.mealType}
                    </span>
                    {meal.prepTimeMinutes && (
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {meal.prepTimeMinutes} mins prep
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                    {meal.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    {meal.description}
                  </p>

                  {/* Ingredients Checklist */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                      Ingredients
                    </div>
                    <ul className="space-y-1">
                      {meal.ingredients.map((ing, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Macro pill summary */}
                <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-zinc-900/60 p-2 rounded-xl">
                    <div className="text-[10px] text-zinc-500 font-medium">Calories</div>
                    <div className="font-bold text-white">{meal.calories}</div>
                  </div>
                  <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-300 border border-emerald-500/20">
                    <div className="text-[10px] text-emerald-400 font-medium">Protein</div>
                    <div className="font-bold">{meal.protein}g</div>
                  </div>
                  <div className="bg-zinc-900/60 p-2 rounded-xl">
                    <div className="text-[10px] text-zinc-500 font-medium">Carbs</div>
                    <div className="font-bold text-zinc-200">{meal.carbs}g</div>
                  </div>
                  <div className="bg-zinc-900/60 p-2 rounded-xl">
                    <div className="text-[10px] text-zinc-500 font-medium">Fats</div>
                    <div className="font-bold text-zinc-200">{meal.fat}g</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Grocery Tips / Prep Strategy */}
          {mealPlan.groceryTips && mealPlan.groceryTips.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <ShoppingBag className="w-4 h-4" />
                <span>Meal Prep & Smart Grocery Tips</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mealPlan.groceryTips.map((tip, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Meal Plan Generated Yet</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Click the button above to generate a high-protein, delicious 1-day meal plan tailored to your body weight ({profile.weight}kg) and goal ({profile.fitnessGoal}).
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Meal Plan with Gemini AI</span>
          </button>
        </div>
      )}
    </div>
  );
};
