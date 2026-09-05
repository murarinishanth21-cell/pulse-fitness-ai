import { UserProfile, ExerciseItem, DailyMealPlan, DietAnalysisResult } from '@/types/fitness';

const STORAGE_KEYS = {
  PROFILE: 'pulse_fitness_profile_v1',
  TODAY_SCHEDULE: 'pulse_today_schedule_v1',
  COMPLETED_DATES: 'pulse_completed_dates_v1',
  SAVED_MEAL_PLAN: 'pulse_saved_meal_plan_v1',
  LATEST_DIET_ANALYSIS: 'pulse_latest_diet_analysis_v1',
  STREAK_COUNT: 'pulse_streak_count_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  age: 25,
  weight: 70,
  height: 175,
  activityLevel: 'moderate',
  fitnessGoal: 'Lose 5kg of fat and build lean athletic muscle',
  currentDiet: 'I usually eat 2 eggs for breakfast, skip lunch or grab a coffee, and have pasta or takeout for dinner.',
  allergiesOrPreferences: 'No nuts, prefers high protein and quick prep meals',
};

export const DEFAULT_SCHEDULE: ExerciseItem[] = [
  {
    id: 'init-1',
    name: 'Dynamic Arm & Shoulder Warmup',
    targetMuscle: 'Shoulders / Rotators',
    sets: 2,
    repsOrDuration: '60 secs',
    restSeconds: 30,
    formTip: 'Smooth circular movements to mobilize shoulder joints.',
    completed: false,
  },
  {
    id: 'init-2',
    name: 'Push-ups (or Incline Push-ups)',
    targetMuscle: 'Chest, Shoulders & Triceps',
    sets: 3,
    repsOrDuration: '10-12 reps',
    restSeconds: 60,
    formTip: 'Keep core tight, elbows tucked at 45-degree angle.',
    completed: false,
  },
  {
    id: 'init-3',
    name: 'Bodyweight Squats to Box',
    targetMuscle: 'Quadriceps & Glutes',
    sets: 3,
    repsOrDuration: '15 reps',
    restSeconds: 60,
    formTip: 'Push knees outward and maintain chest tall.',
    completed: false,
  },
  {
    id: 'init-4',
    name: 'Dumbbell or Resistance Band Rows',
    targetMuscle: 'Upper Back & Lats',
    sets: 3,
    repsOrDuration: '12 reps',
    restSeconds: 60,
    formTip: 'Squeeze shoulder blades firmly at the peak contraction.',
    completed: false,
  },
  {
    id: 'init-5',
    name: 'Forearm Plank Hold',
    targetMuscle: 'Core & Abdominals',
    sets: 3,
    repsOrDuration: '45 secs',
    restSeconds: 45,
    formTip: 'Brace abdominal wall as if preparing for a punch.',
    completed: false,
  },
];

export function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch (e) {
    console.error('Error reading profile from localStorage', e);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to localStorage', e);
  }
}

export function getStoredSchedule(): ExerciseItem[] {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODAY_SCHEDULE);
    return raw ? JSON.parse(raw) : DEFAULT_SCHEDULE;
  } catch (e) {
    console.error('Error reading schedule from localStorage', e);
    return DEFAULT_SCHEDULE;
  }
}

export function saveStoredSchedule(schedule: ExerciseItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TODAY_SCHEDULE, JSON.stringify(schedule));
  } catch (e) {
    console.error('Error saving schedule to localStorage', e);
  }
}

export function getStoredMealPlan(): DailyMealPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_MEAL_PLAN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredMealPlan(plan: DailyMealPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_MEAL_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Error saving meal plan', e);
  }
}

export function getStoredDietAnalysis(): DietAnalysisResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LATEST_DIET_ANALYSIS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredDietAnalysis(analysis: DietAnalysisResult): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LATEST_DIET_ANALYSIS, JSON.stringify(analysis));
  } catch (e) {
    console.error('Error saving diet analysis', e);
  }
}
