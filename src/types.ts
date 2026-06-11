/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChildMetrics {
  name: string;
  age: string; // e.g., '6-11 months', '1-2 years', '3-5 years'
  weightKg: number;
  heightCm: number;
  nutritionalNeeds: string[]; // e.g., ['Underweight', 'Low Protein', 'Iron Anemia', 'Stunting']
  bnsFeedback?: string; // e.g., notes, constraints, allergies, equipment limitations
}

export interface NutrientTarget {
  energyKcal: number;
  proteinG: number;
  ironMg: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'relief' | 'local' | 'pantry'; // Relief supplies vs backyard garden/affordable local items vs staples
  unit: string;
  count: number;
  selected: boolean;
  unitCost?: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredientsUsed: string[];
  preparationGuide: string[];
  nutritionalValue: string;
  nutritionalBrief: {
    caloriesEstimate: number;
    proteinEstimate: number;
    ironEstimate: number;
    whyGood: string;
  };
}

export interface StretchingPlan {
  preparationStrategy: string;
  brothAddition: string;
  nutritionalFocus: string;
}

export interface MealPlanResponse {
  recipes: Recipe[];
  nutritionistNote: string;
  stretchingPlan?: StretchingPlan;
}

export interface SavedMealPlan {
  id: string;
  date: string;
  childMetrics: ChildMetrics;
  ingredientsUsed: string[];
  recipes: Recipe[];
  nutritionistNote: string;
  stretchingPlan?: StretchingPlan;
}

export interface CommunalChildCase {
  id: string;
  name: string;
  bnsWorker: string;
  ageMonths: number;
  condition: 'Underweight' | 'Wasting' | 'Stunting' | 'Healthy';
  householdSupplies: string[];
}

export interface CommunalBatchRecipe {
  title: string;
  totalServings: number;
  aggregatedNeedsSummary: string;
  scaledIngredients: Array<{ name: string; quantity: string; category: string }>;
  batchPreparationGuide: string[];
  dietarySuitability: string;
}

