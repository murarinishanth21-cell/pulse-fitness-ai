'use server';

import {
  analyzeDiet,
  generateMealPlan,
  generateWorkoutRoutine,
  chatWithCoach,
} from '@/lib/gemini';
import { UserProfile, DietAnalysisResult, DailyMealPlan, WorkoutRoutine } from '@/types/fitness';

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function analyzeDietAction(profile: UserProfile): Promise<ActionResponse<DietAnalysisResult>> {
  try {
    if (!profile || !profile.currentDiet) {
      return { success: false, error: 'Please provide your current diet description.' };
    }
    const result = await analyzeDiet(profile);
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Error in analyzeDietAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze diet. Please check your Gemini API key.',
    };
  }
}

export async function generateMealPlanAction(profile: UserProfile): Promise<ActionResponse<DailyMealPlan>> {
  try {
    if (!profile) {
      return { success: false, error: 'User profile is required.' };
    }
    const result = await generateMealPlan(profile);
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Error in generateMealPlanAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate meal plan.',
    };
  }
}

export async function generateWorkoutAction(
  profile: UserProfile,
  focusOverride?: string,
  equipment?: string
): Promise<ActionResponse<WorkoutRoutine>> {
  try {
    if (!profile) {
      return { success: false, error: 'User profile is required.' };
    }
    const result = await generateWorkoutRoutine(profile, focusOverride, equipment);
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Error in generateWorkoutAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate workout routine.',
    };
  }
}

export async function chatCoachAction(
  message: string,
  profile?: UserProfile,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<ActionResponse<string>> {
  try {
    if (!message || !message.trim()) {
      return { success: false, error: 'Message cannot be empty.' };
    }
    const reply = await chatWithCoach(message.trim(), profile, chatHistory);
    return { success: true, data: reply };
  } catch (error: unknown) {
    console.error('Error in chatCoachAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get response from AI coach.',
    };
  }
}
