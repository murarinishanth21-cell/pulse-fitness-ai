import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, DietAnalysisResult, DailyMealPlan, WorkoutRoutine } from '@/types/fitness';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables. Please add it to .env.local.');
  }
  return new GoogleGenerativeAI(apiKey);
}

// Ultra-fast, active, low-latency models
const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.1-flash-lite-preview',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];

async function generateWithFallback(prompt: string, isJson: boolean = false): Promise<string> {
  const ai = getGeminiClient();
  let lastError: unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = ai.getGenerativeModel({
        model: modelName,
        generationConfig: isJson ? { responseMimeType: 'application/json' } : undefined,
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) return text;
    } catch (err: unknown) {
      console.warn(`Model ${modelName} failed, falling back to next candidate...`, err);
      lastError = err;
    }
  }

  throw new Error(`Failed to generate content with Gemini API. Error details: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  // Strip markdown codeblocks ```json ... ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

export async function analyzeDiet(profile: UserProfile): Promise<DietAnalysisResult> {
  const prompt = `
You are an expert sports nutritionist and dietitian.
Analyze the following user profile and their current daily diet:

USER PROFILE:
- Age: ${profile.age}
- Weight: ${profile.weight} kg
- Height: ${profile.height || 'Not specified'} cm
- Activity Level: ${profile.activityLevel}
- Fitness Goal: ${profile.fitnessGoal}
- Current Diet: "${profile.currentDiet}"
- Allergies/Preferences: "${profile.allergiesOrPreferences || 'None'}"

TASK:
Provide a rigorous, constructive nutritional analysis of their current diet compared to their goals.
Calculate estimated current macro breakdown vs ideal target macro breakdown.
Highlight clear nutritional gaps (e.g. low protein, high simple sugars, meal skipping, insufficient micronutrients/fiber).

RETURN ONLY A VALID JSON OBJECT MATCHING THIS EXACT SCHEMA:
{
  "summary": "Concise 2-3 sentence overview of their current diet and the main takeaway",
  "healthScore": 68,
  "estimatedMacros": {
    "calories": 1650,
    "proteinGrams": 45,
    "carbsGrams": 220,
    "fatsGrams": 55
  },
  "targetMacros": {
    "calories": 2100,
    "proteinGrams": 140,
    "carbsGrams": 210,
    "fatsGrams": 65
  },
  "strengths": [
    "Short bullet 1 of what is working well"
  ],
  "weaknesses": [
    "Short bullet 1 of what is missing or problematic (e.g., low protein for muscle gain, skipping lunch)"
  ],
  "recommendations": [
    "Actionable bullet 1 (e.g., add 30g protein at lunch, swap refined pasta for whole grain/chickpea pasta)"
  ],
  "hydrationTip": "Actionable hydration recommendation"
}
`;

  const rawJson = await generateWithFallback(prompt, true);
  const parsed = JSON.parse(cleanJsonResponse(rawJson)) as DietAnalysisResult;
  return parsed;
}

export async function generateMealPlan(profile: UserProfile): Promise<DailyMealPlan> {
  const prompt = `
You are an elite culinary nutritionist. Generate a customized 1-Day Meal Plan designed precisely for this user's fitness goal.

USER PROFILE:
- Age: ${profile.age}
- Weight: ${profile.weight} kg
- Activity Level: ${profile.activityLevel}
- Fitness Goal: ${profile.fitnessGoal}
- Current Diet / Food Habits: "${profile.currentDiet}"
- Dietary Restrictions: "${profile.allergiesOrPreferences || 'None'}"

TASK:
Create a delicious, realistic, high-nutrition 1-day meal plan consisting of Breakfast, Lunch, Dinner, and 1-2 Snacks.
Ensure high protein alignment for muscle repair and sustainable energy.

RETURN ONLY A VALID JSON OBJECT WITH THIS EXACT SCHEMA:
{
  "summary": "1-2 sentence overview of why this meal plan suits their specific goal",
  "totalCalories": 2050,
  "totalProtein": 145,
  "totalCarbs": 210,
  "totalFat": 62,
  "meals": [
    {
      "mealType": "Breakfast",
      "title": "Spinach & Feta Egg White Scramble with Avocado Toast",
      "description": "High-protein morning boost with healthy monounsaturated fats for sustained focus.",
      "ingredients": [
        "3 whole eggs or 4 egg whites",
        "1 cup baby spinach",
        "30g feta cheese",
        "1 slice whole-grain sourdough",
        "1/4 avocado sliced"
      ],
      "calories": 480,
      "protein": 34,
      "carbs": 32,
      "fat": 22,
      "prepTimeMinutes": 12
    },
    {
      "mealType": "Lunch",
      "title": "Grilled Lemon Herb Chicken Quinoa Bowl",
      "description": "Lean protein with complex carbs and vibrant vegetables for midday sustained energy.",
      "ingredients": [
        "180g grilled chicken breast",
        "3/4 cup cooked quinoa",
        "1 cup roasted broccoli & bell peppers",
        "1 tbsp olive oil & lemon dressing"
      ],
      "calories": 550,
      "protein": 48,
      "carbs": 44,
      "fat": 16,
      "prepTimeMinutes": 20
    },
    {
      "mealType": "Dinner",
      "title": "Baked Wild Salmon with Sweet Potato Mash & Asparagus",
      "description": "Rich in omega-3 fatty acids to reduce inflammation and optimize recovery.",
      "ingredients": [
        "170g wild salmon fillet",
        "1 medium baked sweet potato",
        "6-8 grilled asparagus spears",
        "1 tsp ghee or olive oil"
      ],
      "calories": 620,
      "protein": 42,
      "carbs": 48,
      "fat": 24,
      "prepTimeMinutes": 25
    },
    {
      "mealType": "Snack",
      "title": "Greek Yogurt with Berries & Chia Seeds",
      "description": "Slow-digesting casein protein with antioxidants.",
      "ingredients": [
        "170g plain 0% Greek yogurt",
        "1/2 cup blueberries",
        "1 tbsp chia seeds",
        "Dash of cinnamon"
      ],
      "calories": 210,
      "protein": 21,
      "carbs": 22,
      "fat": 4,
      "prepTimeMinutes": 3
    }
  ],
  "groceryTips": [
    "Pre-cook quinoa and roast vegetables in bulk for quick assembly",
    "Choose wild-caught salmon or substitute with tofu/tempeh if preferred"
  ]
}
`;

  const rawJson = await generateWithFallback(prompt, true);
  const parsed = JSON.parse(cleanJsonResponse(rawJson)) as DailyMealPlan;
  return parsed;
}

export async function generateWorkoutRoutine(
  profile: UserProfile,
  focusOverride?: string,
  equipment: string = 'Gym / Dumbbells / Bodyweight'
): Promise<WorkoutRoutine> {
  const prompt = `
You are a world-class certified strength & conditioning coach.
Generate a tailored, structured daily workout routine for this client.

CLIENT PROFILE:
- Age: ${profile.age}
- Weight: ${profile.weight} kg
- Fitness Goal: ${profile.fitnessGoal}
- Activity Level: ${profile.activityLevel}
- Specific Focus Requested: ${focusOverride || 'Full Body / Goal Specific Split'}
- Available Equipment: ${equipment}

REQUIREMENTS:
- Include 5 to 7 clearly structured exercises.
- Each exercise MUST have a distinct ID (e.g. "ex-1", "ex-2"), clear exercise name, target muscle group, sets (number), reps or duration (e.g. "10-12 reps" or "45 secs"), rest time in seconds (e.g. 60), and 1 actionable form tip.
- Include a 3-minute warmup and 3-minute cooldown.

RETURN ONLY A VALID JSON OBJECT WITH THIS EXACT SCHEMA:
{
  "routineName": "Upper Body Hypertrophy & Power",
  "targetFocus": "Chest, Back, Arms & Core",
  "estimatedDurationMinutes": 45,
  "difficulty": "Intermediate",
  "warmup": [
    "Arm circles and chest openers - 60s",
    "Band pull-aparts or cat-cow - 60s",
    "Light bodyweight push-ups - 10 reps"
  ],
  "exercises": [
    {
      "id": "ex-1",
      "name": "Dumbbell Bench Press",
      "targetMuscle": "Pectorals / Triceps",
      "sets": 3,
      "repsOrDuration": "10-12 reps",
      "restSeconds": 75,
      "formTip": "Tuck elbows at 45 degrees and control the eccentric descent."
    },
    {
      "id": "ex-2",
      "name": "Bent-Over Dumbbell Rows",
      "targetMuscle": "Latissimus Dorsi & Rhomboids",
      "sets": 3,
      "repsOrDuration": "10-12 reps",
      "restSeconds": 60,
      "formTip": "Keep spine neutral and squeeze shoulder blades at the top."
    },
    {
      "id": "ex-3",
      "name": "Overhead Dumbbell Shoulder Press",
      "targetMuscle": "Deltoids / Upper Chest",
      "sets": 3,
      "repsOrDuration": "10-12 reps",
      "restSeconds": 60,
      "formTip": "Avoid arching lower back by bracing your core."
    },
    {
      "id": "ex-4",
      "name": "Incline Push-ups or Floor Dips",
      "targetMuscle": "Chest & Triceps",
      "sets": 3,
      "repsOrDuration": "12-15 reps",
      "restSeconds": 45,
      "formTip": "Keep body in one straight line from head to heels."
    },
    {
      "id": "ex-5",
      "name": "Plank Shoulder Taps",
      "targetMuscle": "Core / Anti-rotation",
      "sets": 3,
      "repsOrDuration": "20 total taps",
      "restSeconds": 45,
      "formTip": "Resist swaying hips side to side."
    }
  ],
  "cooldown": [
    "Child's pose stretch - 60s",
    "Doorway chest stretch - 45s each side",
    "Deep diaphragmatic breathing - 60s"
  ]
}
`;

  const rawJson = await generateWithFallback(prompt, true);
  const parsed = JSON.parse(cleanJsonResponse(rawJson)) as WorkoutRoutine;
  return parsed;
}

function stripAsterisks(text: string): string {
  // Remove markdown bold/italic asterisks and bullet asterisks
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold** -> bold
    .replace(/\*(.*?)\*/g, '$1')     // remove *italic* -> italic
    .replace(/^\s*\*\s+/gm, '- ')    // convert leading * bullets to clean -
    .replace(/\*/g, '')              // strip any remaining lone asterisks
    .trim();
}

export async function chatWithCoach(
  userMessage: string,
  profile?: UserProfile,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  const profileContext = profile
    ? `
CLIENT DETAILS:
- Age: ${profile.age}
- Body Weight: ${profile.weight} kg
- Main Goal: ${profile.fitnessGoal}
- Typical Diet: ${profile.currentDiet}
- Activity Level: ${profile.activityLevel}
`
    : 'No profile set yet.';

  const historyContext = chatHistory
    .slice(-6)
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n');

  const prompt = `
You are "PulseAI", a friendly, encouraging, and down-to-earth Personal Fitness & Nutrition Coach.

${profileContext}

PREVIOUS MESSAGES:
${historyContext}

USER'S QUESTION:
"${userMessage}"

RULES FOR YOUR RESPONSE:
1. Use PLAIN, SIMPLE, EVERYDAY ENGLISH that anyone can understand immediately.
2. DO NOT USE ASTERISKS (*) ANYWHERE in your reply. Never use * for lists, and never use ** for bolding. Use plain text or simple dashes (-) or numbers (1, 2, 3) for lists.
3. Avoid difficult scientific or medical jargon. Keep all explanations simple and clear.
4. Keep your reply direct, helpful, and concise.
5. If asked about food swaps (like egg or milk alternatives), give 2 to 3 simple everyday choices with easy portion amounts.
6. Keep the tone friendly, motivating, and positive.
`;

  const rawReply = await generateWithFallback(prompt, false);
  return stripAsterisks(rawReply);
}
