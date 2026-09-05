export interface UserProfile {
  age: number;
  weight: number; // in kg
  height?: number; // in cm
  gender?: string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  fitnessGoal: string;
  currentDiet: string;
  allergiesOrPreferences?: string;
}

export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface DietAnalysisResult {
  summary: string;
  estimatedMacros: MacroBreakdown;
  targetMacros: MacroBreakdown;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  hydrationTip: string;
  healthScore: number; // 1-100
}

export interface MealItem {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  title: string;
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMinutes?: number;
}

export interface DailyMealPlan {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  summary: string;
  meals: MealItem[];
  groceryTips?: string[];
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  repsOrDuration: string;
  restSeconds?: number;
  formTip?: string;
  completed?: boolean;
}

export interface WorkoutRoutine {
  routineName: string;
  targetFocus: string;
  estimatedDurationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  warmup: string[];
  exercises: ExerciseItem[];
  cooldown: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
