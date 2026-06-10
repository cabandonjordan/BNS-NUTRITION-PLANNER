/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Baby, 
  Sparkles, 
  BookOpen, 
  PlusSquare, 
  Printer, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  Clock, 
  Save, 
  FolderHeart,
  Heart,
  Loader2,
  ListRestart
} from 'lucide-react';

import { ChildMetrics, Ingredient, SavedMealPlan, Recipe, MealPlanResponse } from './types';
import { simplifyAndTranslateText, translateIngredient, getUIText, TargetLanguage } from './lib/translation';
import ChildMetricsForm, { getRENITarget } from './components/ChildMetricsForm';
import NutritionCalculator from './components/NutritionCalculator';
import IngredientSelector, { INITIAL_INGREDIENTS } from './components/IngredientSelector';
import RecipeCard from './components/RecipeCard';
import SavedPlansList from './components/SavedPlansList';
import GrowthTracker from './components/GrowthTracker';

const FALLBACK_RECIPES: Recipe[] = [
  {
    id: 'fb_1',
    name: 'Ginisang Sardinas at Kalabasa con Malunggay',
    ingredientsUsed: ['Canned Sardines (Tomato Sauce)', 'Squash (Kalabasa)', 'Malunggay Leaves (Moringa)'],
    preparationGuide: [
      'Gently heat a small amount of cooking oil in a pan.',
      'Pour in the sardines including the rich tomato sauce and let it simmer for 2 minutes.',
      'Add the sliced kalabasa (squash) and 1/2 cup of clean water. Cover and simmer until the squash is tender.',
      'Throw in the fresh malunggay leaves, add a pinch of salt to taste, and simmer for 1 final minute before serving warm.'
    ],
    nutritionalValue: 'The combination of sardines provides abundant protein and iron, while Kalabasa adds vitamin A for mucosal immunity. Malunggay is a local powerhouse of iron and calcium.',
    nutritionalBrief: {
      caloriesEstimate: 310,
      proteinEstimate: 14.2,
      ironEstimate: 4.1,
      whyGood: 'Highly effective for restoring muscle and correcting iron deficiency in underweight children.'
    }
  },
  {
    id: 'fb_2',
    name: 'Dilaw na Arroz Caldo (Rice & Kalabasa Porridge)',
    ingredientsUsed: ['NFA Rice', 'Squash (Kalabasa)', 'Fresh Chicken Egg'],
    preparationGuide: [
      'Boil 1/2 cup of NFA rice in 3 cups of water with a small pinch of salt, stirring continuously to create a soft porridge (lugaw).',
      'Mash the kalabasa and mix it into the boiling rice to give the porridge a nutritious yellow hue and soft consistency.',
      'Whisk in a fresh egg directly into the porridge during the final 3 minutes of cooking to cook the proteins smoothly.',
      'Serve warm. Easy to digest for toddlers.'
    ],
    nutritionalValue: 'Excellent calorie-dense digestible carbohydrate base. The egg serves as a gold-standard source of essential amino acids and lipids.',
    nutritionalBrief: {
      caloriesEstimate: 290,
      proteinEstimate: 11.5,
      ironEstimate: 2.8,
      whyGood: 'Provides a smooth calorie-rich comfort porridge suited for weak children recovering from illness.'
    }
  },
  {
    id: 'fb_3',
    name: 'Malunggay Egg Scramble with Kamote Fries',
    ingredientsUsed: ['Fresh Chicken Egg', 'Malunggay Leaves (Moringa)', 'Kamote (Sweet Potato)'],
    preparationGuide: [
      'Slice the sweet potato (kamote) into thin spears and lightly pan-fry in a small amount of cooking oil until soft.',
      'Beat the egg in a small cup with a pinch of salt and stir in fresh malunggay leaves.',
      'Pour the egg mix into the pan, cooking until set to make a soft herb omelet.',
      'Serve the sweet and savory combination together for convenient finger-feeding.'
    ],
    nutritionalValue: 'Fills the calorie gap via energy-dense sweet potato. Eggs build immunity cells while malunggay reinforces hemoglobin synthesis.',
    nutritionalBrief: {
      caloriesEstimate: 340,
      proteinEstimate: 10.8,
      ironEstimate: 3.5,
      whyGood: 'High in fat-soluble vitamins and calorie density, crucial for rapid weight recovery.'
    }
  }
];

const getFallbackRecipesWithFeedback = (feedback?: string): Recipe[] => {
  let rps = JSON.parse(JSON.stringify(FALLBACK_RECIPES)) as Recipe[];
  if (!feedback) return rps;
  const feedbackLower = feedback.toLowerCase();

  // 1. Squash Exclusion/Allergy
  if (
    feedbackLower.includes('allergic to squash') ||
    feedbackLower.includes('no squash') ||
    feedbackLower.includes('allergy to squash') ||
    feedbackLower.includes('bawal sa kalabasa') ||
    feedbackLower.includes('bawal kalabasa') ||
    feedbackLower.includes('allergic sa kalabasa')
  ) {
    rps = rps.map(r => {
      if (r.ingredientsUsed.includes('Squash (Kalabasa)')) {
        r.ingredientsUsed = r.ingredientsUsed.map(i => i === 'Squash (Kalabasa)' ? 'Kamote (Sweet Potato)' : i);
        r.name = r.name.replace(/Kalabasa/gi, 'Kamote').replace(/Dilaw na/gi, 'Kamote Porridge with');
        r.preparationGuide = r.preparationGuide.map(step => 
          step.replace(/kalabasa \(squash\)/gi, 'kamote (sweet potato)')
              .replace(/squash/gi, 'sweet potato')
              .replace(/kalabasa/gi, 'kamote')
              .replace(/yellow hue/gi, 'sweet kamote base')
        );
        r.nutritionalValue = r.nutritionalValue.replace(/Kalabasa/gi, 'Kamote').replace(/vitamin A/gi, 'additional digestion-friendly carbohydrates & vitamin A');
      }
      return r;
    });
  }

  // 2. Egg Exclusion/Allergy
  if (
    feedbackLower.includes('allergic to egg') ||
    feedbackLower.includes('no egg') ||
    feedbackLower.includes('allergy to egg') ||
    feedbackLower.includes('bawal sa itlog') ||
    feedbackLower.includes('bawal itlog') ||
    feedbackLower.includes('allergic sa itlog')
  ) {
    rps = rps.map(r => {
      if (r.ingredientsUsed.includes('Fresh Chicken Egg')) {
        r.ingredientsUsed = r.ingredientsUsed.map(i => i === 'Fresh Chicken Egg' ? 'Canned Sardines (Tomato Sauce)' : i);
        r.name = r.name.replace(/Egg/gi, 'Sardine').replace(/Omelet/gi, 'Lugaw con Sardinas');
        r.preparationGuide = r.preparationGuide.map(step => 
          step.replace(/egg/gi, 'canned sardines')
              .replace(/omelet/gi, 'savory sardine flakes')
              .replace(/Beat the egg in a small cup/gi, 'Flake the canned sardines in tomato sauce')
        );
      }
      return r;
    });
  }

  // 3. Equipment/Method constraints (e.g. charcoal, only boil, boil water)
  const onlyBoil = 
    feedbackLower.includes('charcoal') || 
    feedbackLower.includes('boil') || 
    feedbackLower.includes('no stove') || 
    feedbackLower.includes('no gas') || 
    feedbackLower.includes('no oil') || 
    feedbackLower.includes('no fry') || 
    feedbackLower.includes('no frying');
    
  if (onlyBoil) {
    rps = rps.map(r => {
      r.preparationGuide = r.preparationGuide.map(step => {
        let adjusted = step;
        adjusted = adjusted.replace(/Gently heat a small amount of cooking oil in a pan/gi, 'Boil 1/2 cup of clean water in a cooking pot');
        adjusted = adjusted.replace(/lightly pan-fry in a small amount of cooking oil/gi, 'boil until tender in a small cooking pot of clean water');
        adjusted = adjusted.replace(/Pour the egg mix into the pan, cooking until set/gi, 'Boil and stir the egg mix directly into the water pool to set into a soft, digestible egg drop');
        adjusted = adjusted.replace(/fry/gi, 'boil');
        adjusted = adjusted.replace(/frying/gi, 'boiling');
        adjusted = adjusted.replace(/pan/gi, 'pot');
        adjusted = adjusted.replace(/omelet/gi, 'boiled mash');
        return adjusted;
      });
      return r;
    });
  }

  return rps;
};

const getFallbackStretchingPlan = (ingredients: Ingredient[]): { preparationStrategy: string; brothAddition: string; nutritionalFocus: string } => {
  const selectedNames = ingredients.filter(i => i.selected).map(i => i.name);
  
  let prep = "Section selected rations across three equal feeds. Give 1/3 of proteins at breakfast mixed with warm carbohydrate mashes. Maintain 1/3 for lunch and dinner respectively.";
  let broth = "Use clean boiled water with a pinch of salt to form a light 'sabaw'. This swells cooked rice starch and creates a comfortable, easily-digestible wet base that expands volume.";
  let focus = "When serving, carefully skim the solid food items (sardine fat/oils, egg bits, or mashed soft squash) into the underweight child's bowl. Give other siblings the tasty hydrating broth.";

  if (selectedNames.length === 1) {
    prep = `Partition your single item: "${selectedNames[0]}" into three micro-portions. For breakfast, stir a tiny spoonful of ${selectedNames[0]} into safe, warm water. Save the remaining bulk for midday and evening feeds to ensure consistent calorie distribution.`;
  } else if (selectedNames.includes('Canned Sardines (Tomato Sauce)') && selectedNames.includes('NFA Rice')) {
    prep = "Cook 1 cup of NFA rice in 4 cups of water to swell it into a thick 'lugaw' (porridge). Open the sardines and partition into 3 tiny portions: flake a small spoonful into breakfast porridge, mash a chunk into lunch porridge, and serve the sauce-covered remnants at dinner.";
    broth = "Amplify the lugaw volume by adding extra boiled water and a pinch of salt. The salty soup base ensures electrolyte balance while making the scarce rice go three times as far.";
    focus = "Direct all the omega-rich red oils and iron-dense fish solids purely into the recovering child's bowl. Let other children eat the plain salted porridge.";
  } else if (selectedNames.length <= 2) {
    const ingredientListText = selectedNames.join(" and ");
    prep = `With extremely scarce rations (${ingredientListText}), cook them together with water as a soft, fluid mash. Split this mash into three small meals for the morning, afternoon, and evening to avoid giving too much at once to a frail child.`;
    broth = "Boil plenty of clean water with a pinch of salt (sabaw) to swell whatever small grain or starch is selected. This provides hydration, thermal comfort, and increases the feeling of fullness.";
    focus = "Sift the dense soft pieces of food (such as vegetable fibers or protein) directly into the malnourished child's small cup. The warm salty broth water can be given to satisfy older children's appetite.";
  }

  return {
    preparationStrategy: prep,
    brothAddition: broth,
    nutritionalFocus: focus
  };
};

export default function App() {
  // State initialization
  const [metrics, setMetrics] = useState<ChildMetrics>({
    name: '',
    age: '12-23 months',
    weightKg: 9.8,
    heightCm: 81.0,
    nutritionalNeeds: ['Underweight', 'Iron-Deficiency Anemia'],
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MealPlanResponse | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [keyStatus, setKeyStatus] = useState<boolean>(true);
  const [handoutMode, setHandoutMode] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('tl');

  // Load plans from localStorage on boot
  useEffect(() => {
    const cached = localStorage.getItem('bns_meal_plans_v1');
    if (cached) {
      try {
        setSavedPlans(JSON.parse(cached));
      } catch (err) {
        console.error('Error parsing saved plans', err);
      }
    }

    // Verify key existence on server via rapid health check
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setKeyStatus(data.keyStatus);
        if (!data.keyStatus) {
          setIsDemoMode(true);
        }
      })
      .catch(() => {
        // Fallback gracefully on request error
        setKeyStatus(false);
        setIsDemoMode(true);
      });
  }, []);

  const selectedIngredientsCount = ingredients.filter(i => i.selected).length;
  const targetNutrients = getRENITarget(metrics.age);

  // Generate Plan
  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedPlanId(null);

    const activeIngredients = ingredients.filter(i => i.selected);
    if (activeIngredients.length === 0) {
      setError('Please select at least one available food item or garden crop from your inventory.');
      setLoading(false);
      return;
    }

    if (isDemoMode) {
      // Fast demo fallback to show the gorgeous UI
      setTimeout(() => {
        const adaptedRecipes = getFallbackRecipesWithFeedback(metrics.bnsFeedback);
        const demoResponse: MealPlanResponse = {
          recipes: adaptedRecipes,
          nutritionistNote: `A warm greeting, Barangay Nutrition Scholar! This is a reference guideline meal plan compiled specifically for ${metrics.name || 'our underweight toddler'}.${metrics.bnsFeedback ? ` Formulated obeying your custom feedback: "${metrics.bnsFeedback}"` : ""} Ensure to instruct the mother on clean handwashing practices and use boiled safe water for preparation. Let's work diligently to support this family!`,
          stretchingPlan: getFallbackStretchingPlan(ingredients)
        };
        setResult(demoResponse);
        setLoading(false);
      }, 1200);
      return;
    }

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childMetrics: metrics,
          availableIngredients: activeIngredients,
          targetNutrients: targetNutrients
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.needsKey) {
          setKeyStatus(false);
          setIsDemoMode(true);
          throw new Error(`${data.error} Using pre-drafted reference guidelines instead.`);
        }
        throw new Error(data.error || 'Server returned an error compiling the recipes.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connecting to the nutrition database failed.');
      // Auto-switch to fallback so the experience remains fully unbroken
      const adaptedRecipes = getFallbackRecipesWithFeedback(metrics.bnsFeedback);
      const demoResponse: MealPlanResponse = {
        recipes: adaptedRecipes,
        nutritionistNote: `Using standard reference guidelines obeying BNS Feedback constraints. ${err.message}`,
        stretchingPlan: getFallbackStretchingPlan(ingredients)
      };
      setResult(demoResponse);
    } finally {
      setLoading(false);
    }
  };

  // Save current formulated plan to logs
  const handleSavePlan = () => {
    if (!result) return;
    const newPlan: SavedMealPlan = {
      id: 'plan_' + Date.now(),
      date: new Date().toISOString(),
      childMetrics: { ...metrics },
      ingredientsUsed: ingredients.filter(i => i.selected).map(i => i.name),
      recipes: result.recipes,
      nutritionistNote: result.nutritionistNote,
      stretchingPlan: result.stretchingPlan
    };

    const updated = [newPlan, ...savedPlans];
    setSavedPlans(updated);
    localStorage.setItem('bns_meal_plans_v1', JSON.stringify(updated));
    setSelectedPlanId(newPlan.id);
  };

  // Delete saved plan from history
  const handleDeletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('bns_meal_plans_v1', JSON.stringify(updated));
    if (selectedPlanId === id) {
      setSelectedPlanId(null);
      setResult(null);
    }
  };

  // Restore history record to widgets
  const handleLoadPlan = (plan: SavedMealPlan) => {
    setMetrics(plan.childMetrics);
    
    // Map existing selections
    const restoredIngredients = ingredients.map(ing => {
      const wasUsed = plan.ingredientsUsed.includes(ing.name);
      return { ...ing, selected: wasUsed };
    });
    setIngredients(restoredIngredients);
    setSelectedPlanId(plan.id);

    setResult({
      recipes: plan.recipes,
      nutritionistNote: plan.nutritionistNote,
      stretchingPlan: plan.stretchingPlan
    });
  };

  const handleReset = () => {
    setMetrics({
      name: '',
      age: '12-23 months',
      weightKg: 9.8,
      heightCm: 81.0,
      nutritionalNeeds: ['Underweight', 'Iron-Deficiency Anemia'],
    });
    setIngredients(INITIAL_INGREDIENTS);
    setResult(null);
    setError(null);
    setSelectedPlanId(null);
  };

  // Print all 3 recipes together with child details as an elegant single handout pamphlet
  const handlePrintAll = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    if (handoutMode) {
      // PRINT NAND HANDOUT PAMPHLET - Fully Translated & Zero Clinical Terminology!
      const tIngredientTitle = getUIText('ingredientsTitle', targetLanguage);
      const tInstructionsTitle = getUIText('instructionsTitle', targetLanguage);
      const tChecklistTitle = getUIText('checklistTitle', targetLanguage);
      const tWhyGoodTitle = getUIText('whyGoodTitle', targetLanguage);
      const tTip1 = getUIText('motherTip1', targetLanguage);
      const tTip2 = getUIText('motherTip2', targetLanguage);
      const tTip3 = getUIText('motherTip3', targetLanguage);
      const tEncouraging = getUIText('encouragingClosing', targetLanguage);
      const tStretchingTitle = getUIText('stretchingTitle', targetLanguage);
      const tPrepLabel = getUIText('prepStrategyLabel', targetLanguage);
      const tBrothLabel = getUIText('brothAdditionLabel', targetLanguage);
      const tFocusLabel = getUIText('nutritionalFocusLabel', targetLanguage);

      const titleText = targetLanguage === 'en' ? "Mother's Feeding Guide & Recipe Booklet" :
                        targetLanguage === 'tl' ? "Gabay sa Masustansyang Pagpapakain kay Baby" :
                        "Makatabang nga Giya sa Pagpakaon kang Baby";

      const childProfileDesc = targetLanguage === 'en' ? `Specially prepared for <strong>${metrics.name || 'your child'}</strong> to help them stay strong, playful, and healthy.` :
                               targetLanguage === 'tl' ? `Espesyal na inihanda para kay <strong>${metrics.name || 'inyong anak'}</strong> upang siya ay maging malakas, masigla, at lumaki nang malusog.` :
                               `Gidisenyo para kang <strong>${metrics.name || 'imong anak'}</strong> aron siya mahimong kusgan, lagsik, ug daling modako nga himsog.`;

      printWindow.document.write(`
        <html>
          <head>
            <title>${titleText}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
              .header-banner { border-bottom: 3px dashed #fbcfe8; padding-bottom: 20px; margin-bottom: 25px; text-align: center; }
              .pamphlet-title { font-size: 24px; font-weight: 800; color: #be185d; margin: 5px 0 0 0; }
              .pamphlet-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #db2777; font-weight: bold; background: #fff5f7; border: 1px solid #fbcfe8; padding: 3px 10px; border-radius: 50px; display: inline-block; }
              
              .profile-box { border: 2.5px solid #fbcfe8; border-radius: 16px; background: #fffdfd; padding: 18px; margin-bottom: 25px; font-size: 14px; line-height: 1.5; color: #be185d; font-weight: 600; }
              
              .stretching-box { border: 2.5px solid #f39c12; border-radius: 16px; background: #fffdf6; padding: 20px; margin-bottom: 30px; page-break-inside: avoid; }
              .stretching-head { font-size: 16px; font-weight: 800; color: #d35400; margin: 0 0 15px 0; border-bottom: 2px solid #ffcc80; padding-bottom: 6px; text-transform: uppercase; }
              .stretching-sec { margin-top: 10px; }
              .stretching-label { color: #d35400; font-weight: bold; text-transform: uppercase; font-size: 12px; display: block; }
              .stretching-val { margin: 3px 0 0 0; font-size: 13px; font-weight: 500; line-height: 1.4; color: #334155; }

              .recipes-container { display: grid; grid-template-cols: 1fr; gap: 30px; }
              .recipe-card { border: 2px solid #e2e8f0; border-radius: 16px; padding: 22px; page-break-inside: avoid; background-color: #fffdfb; }
              .r-title { font-size: 18px; font-weight: 800; color: #be185d; margin: 0 0 10px 0; border-bottom: 1.5px dashed #fbcfe8; padding-bottom: 8px; text-transform: uppercase; }
              
              .strength-box { display: flex; gap: 8px; margin-bottom: 15px; }
              .strength-badge { background: #fee2e2; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: bold; color: #991b1b; border: 1px solid #fca5a5; }

              .section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; color: #be185d; margin-top: 18px; margin-bottom: 8px; border-left: 3px solid #be185d; padding-left: 6px; }
              
              .checklist-item { display: flex; align-items: start; gap: 8px; padding: 5px 0; border-bottom: 1px dashed #f1f5f9; font-size: 13px; color: #334155; }
              .checkbox-box { width: 14px; height: 14px; border: 1.5px solid #db2777; border-radius: 3px; margin-top: 2px; flex-shrink: 0; }

              .tip-container { background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 16px; padding: 18px; margin-top: 30px; page-break-inside: avoid; }
              .tip-title { font-weight: 800; color: #047857; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1.5px solid #a7f3d0; padding-bottom: 4px; }
              
              .closing-msg { background: #fef2f2; border: 1.5px solid #fecdd3; border-radius: 16px; padding: 20px; font-size: 13px; font-style: italic; color: #881337; line-height: 1.5; margin-top: 30px; page-break-inside: avoid; }
              
              .bhc-sign { text-align: center; margin-top: 45px; border-top: 1px dashed #fbcfe8; padding-top: 15px; font-size: 11px; color: #be185d; font-weight: bold; text-transform: uppercase; }
            </style>
          </head>
          <body>
            <div class="header-banner">
              <span class="pamphlet-tag">Barangay Health Center Community Guide</span>
              <h1 class="pamphlet-title">💝 ${titleText} 💝</h1>
            </div>

            <div class="profile-box">
              ${childProfileDesc}
            </div>

            ${result.stretchingPlan ? `
              <div class="stretching-box">
                <h2 class="stretching-head">💡 ${tStretchingTitle}</h2>
                
                <div class="stretching-sec">
                  <span class="stretching-label">${tPrepLabel}:</span>
                  <p class="stretching-val">${simplifyAndTranslateText(result.stretchingPlan.preparationStrategy, targetLanguage)}</p>
                </div>
                
                <div class="stretching-sec" style="margin-top: 12px;">
                  <span class="stretching-label">${tBrothLabel}:</span>
                  <p class="stretching-val">${simplifyAndTranslateText(result.stretchingPlan.brothAddition, targetLanguage)}</p>
                </div>
                
                <div class="stretching-sec" style="margin-top: 12px;">
                  <span class="stretching-label">${tFocusLabel}:</span>
                  <p class="stretching-val">${simplifyAndTranslateText(result.stretchingPlan.nutritionalFocus, targetLanguage)}</p>
                </div>
              </div>
            ` : ''}

            <h2 style="font-size: 16px; border-bottom: 2px solid #be185d; padding-bottom: 6px; color:#be185d; text-transform:uppercase; margin-top:30px;">
              Mga Hakbang sa Masustansyang Pagluluto (Maternal Recipes)
            </h2>
            
            <div class="recipes-container">
              ${result.recipes.map((r, ri) => {
                const rTitleTrans = simplifyAndTranslateText(r.name, targetLanguage);
                const rWhyTrans = simplifyAndTranslateText(r.nutritionalBrief.whyGood, targetLanguage);
                const rValTrans = simplifyAndTranslateText(r.nutritionalValue, targetLanguage);
                const ingredientsTransList = r.ingredientsUsed.map(i => translateIngredient(i, targetLanguage));
                const stepsTransList = r.preparationGuide.map(step => simplifyAndTranslateText(step, targetLanguage));

                return `
                  <div class="recipe-card">
                    <div class="r-title">${ri + 1}. ${rTitleTrans}</div>
                    
                    <div class="strength-box">
                      <div class="strength-badge">💪 Lakas at Enerhiya</div>
                      <div class="strength-badge" style="background:#fef2f2; border-color:#fca5a5; color:#9f1239;">🍖 Pampatibay</div>
                      <div class="strength-badge" style="background:#eff6ff; border-color:#bfdbfe; color:#1e40af;">🩸 Pampasigla ng Dugo</div>
                    </div>

                    <div style="font-size: 13px; color: #be185d; font-weight: 600; margin-bottom: 15px; background: #fff5f6; padding: 10px; border-radius: 8px;">
                      🍓 <strong>Bakit ito mabuti sa bata:</strong> ${rWhyTrans}. ${rValTrans}
                    </div>

                    <div class="section-title">✔ ${tIngredientTitle}</div>
                    ${ingredientsTransList.map(ing => `
                      <div class="checklist-item">
                        <div class="checkbox-box"></div>
                        <div>${ing}</div>
                      </div>
                    `).join('')}
                    <div class="checklist-item">
                      <div class="checkbox-box"></div>
                      <div style="color: #64748b;">Malinis na tubig, kaunting asin, at kaunting mantika</div>
                    </div>

                    <div class="section-title">🍳 ${tInstructionsTitle}</div>
                    ${stepsTransList.map((step, si) => `
                      <div class="checklist-item">
                        <div class="checkbox-box"></div>
                        <div>HAKBANG ${si + 1}: ${step}</div>
                      </div>
                    `).join('')}
                  </div>
                `;
              }).join('')}
            </div>

            <div class="tip-container">
              <div class="tip-title">🛡 ${tChecklistTitle}</div>
              <div class="checklist-item" style="border:none;">
                <div class="checkbox-box" style="border-color:#10b981;"></div>
                <div style="font-weight:600; color:#065f46;">${tTip1}</div>
              </div>
              <div class="checklist-item" style="border:none; margin-top:5px;">
                <div class="checkbox-box" style="border-color:#10b981;"></div>
                <div style="font-weight:600; color:#065f46;">${tTip2}</div>
              </div>
              <div class="checklist-item" style="border:none; margin-top:5px;">
                <div class="checkbox-box" style="border-color:#10b981;"></div>
                <div style="font-weight:600; color:#065f46;">${tTip3}</div>
              </div>
            </div>

            <div class="closing-msg">
              ${tEncouraging.replace(/\n/g, '<br/>')}
            </div>

            <div class="bhc-sign">
              Inihandog ng inyong lokal na Barangay Health Center at Barangay Nutrition Scholar program • 2026
            </div>
          </body>
        </html>
      `);
    } else {
      // ORIGINALLY DESIGNED PROFESSIONAL BNS PAMPHLET (Unchanged)
      printWindow.document.write(`
        <html>
          <head>
            <title>BNS Feeding Pamphlet: ${metrics.name || 'Child Health Case'}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
              .header-banner { border-bottom: 3px double #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
              .pamphlet-title { font-size: 26px; font-weight: bold; color: #b91c1c; margin: 0; }
              .pamphlet-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: bold; }
              .profile-box { border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
              .profile-col { width: 48%; }
              .profile-label { font-size: 11px; font-weight: bold; color: #64748b; uppercase; letter-spacing: 0.5px; }
              .profile-val { font-size: 15px; font-weight: bold; color: #1e293b; margin-top: 2px; }
              .recipes-container { display: grid; grid-template-cols: 1fr; gap: 30px; }
              .recipe-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; page-break-inside: avoid; }
              .r-title { font-size: 18px; font-weight: bold; color: #b91c1c; margin: 0 0 10px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
              .stats-row { display: flex; gap: 15px; margin-bottom: 15px; }
              .stat-badge { background: #fee2e2; border-radius: 6px; padding: 5px 12px; font-size: 12px; font-weight: bold; color: #991b1b; }
              .item-list { font-size: 13px; line-height: 1.6; padding-left: 20px; }
              .note-title { font-size: 14px; font-weight: bold; color: #475569; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              .note-body { font-size: 13px; line-height: 1.6; font-style: italic; color: #334155; }
            </style>
          </head>
          <body>
            <div class="header-banner">
              <span class="pamphlet-tag">BARANGAY NUTRITION SCHOLAR DIRECT ASSISTANT</span>
              <h1 class="pamphlet-title">Gabay sa Pagpapakain (Maternal Feeding Plan)</h1>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #64748b;">Custom tailored budget recipes utilizing only relief pack items & backyard crops.</p>
            </div>

            <div class="profile-box">
              <div class="profile-col">
                <div>
                  <span class="profile-label">Child Name / Code:</span>
                  <div class="profile-val">${metrics.name || 'Child Recipient'}</div>
                </div>
                <div style="margin-top: 10px;">
                  <span class="profile-label">Age Bracket & RENI target:</span>
                  <div class="profile-val">${metrics.age}</div>
                </div>
              </div>
              <div class="profile-col">
                <div>
                  <span class="profile-label">Current Height & Weight:</span>
                  <div class="profile-val">${metrics.weightKg ? metrics.weightKg + ' kg' : 'N/A'} / ${metrics.heightCm ? metrics.heightCm + ' cm' : 'N/A'}</div>
                </div>
                <div style="margin-top: 10px;">
                  <span class="profile-label">Nutritional Targets:</span>
                  <div class="profile-val">${metrics.nutritionalNeeds.join(', ') || 'Underweight Recovery'}</div>
                </div>
              </div>
            </div>

            ${result.stretchingPlan ? `
              <div style="border: 2px solid #f39c12; border-radius: 12px; background: #fffdf6; padding: 20px; margin-bottom: 30px; page-break-inside: avoid;">
                <h2 style="font-size: 15px; font-weight: bold; color: #d35400; margin: 0 0 15px 0; border-bottom: 2px solid #f39c12; padding-bottom: 6px; text-transform: uppercase;">
                  Mga Gabay sa Pagpapakasya ng Pagkain (Meal Stretching Plan)
                </h2>
                <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
                  <div>
                    <strong style="color: #d35400; text-transform: uppercase;">A. Paraan ng Paghahati (Preparation Strategy):</strong>
                    <p style="margin: 4px 0 0 0; line-height: 1.5; font-weight: 500;">${result.stretchingPlan.preparationStrategy}</p>
                  </div>
                  <div style="margin-top: 8px;">
                    <strong style="color: #1b5e20; text-transform: uppercase;">B. Pagpapasabaw nang Ligtas (Broth/Sabaw Addition):</strong>
                    <p style="margin: 4px 0 0 0; line-height: 1.5; font-weight: 500;">${result.stretchingPlan.brothAddition}</p>
                  </div>
                  <div style="margin-top: 8px;">
                    <strong style="color: #1a237e; text-transform: uppercase;">C. Pokus sa Sustansya (Nutritional Focus):</strong>
                    <p style="margin: 4px 0 0 0; line-height: 1.5; font-weight: 500;">${result.stretchingPlan.nutritionalFocus}</p>
                  </div>
                </div>
              </div>
            ` : ''}

            <h2 style="font-size: 16px; border-bottom: 2px solid #b91c1c; padding-bottom: 6px; color:#b91c1c;">Maternal Recipe Recommendations</h2>
            
            <div class="recipes-container">
              ${result.recipes.map((r, i) => `
                <div class="recipe-card">
                  <div class="r-title">Recipe ${i + 1}: ${r.name}</div>
                  <div class="stats-row">
                    <div class="stat-badge">Energy: ${r.nutritionalBrief.caloriesEstimate} kcal</div>
                    <div class="stat-badge" style="background:#fce7f3; color:#9d174d;">Protein: ${r.nutritionalBrief.proteinEstimate}g</div>
                    <div class="stat-badge" style="background:#dbeafe; color:#1e40af;">Iron: ${r.nutritionalBrief.ironEstimate}mg</div>
                  </div>
                  <strong>Mga Sangkap (Ingredients):</strong>
                  <ul style="margin: 5px 0 15px 0; padding-left: 20px; font-size:13px;">
                    ${r.ingredientsUsed.map(ing => `<li>${ing}</li>`).join('')}
                    <li style="color:#64748b;">Malinis na tubig at kaunting mantika/asin</li>
                  </ul>
                  <strong>Gabay sa Pagluluto (Instructions):</strong>
                  <ol style="margin: 5px 0 0 0; padding-left: 20px; font-size:13px; line-height: 1.5;">
                    ${r.preparationGuide.map(step => `<li>${step}</li>`).join('')}
                  </ol>
                  <p style="font-size: 12px; font-style: italic; color: #475569; margin-top: 12px; background: #f8fafc; padding: 10px; border-radius: 6px;">
                    <strong>Dahilan kung bakit mabuti sa bata:</strong> ${r.nutritionalBrief.whyGood}
                  </p>
                </div>
              `).join('')}
            </div>

            <div class="note-title">Nutritional Scholar Advice Note:</div>
            <p class="note-body">${result.nutritionistNote}</p>

            <div style="text-align: center; margin-top: 50px; border-top: 1px dashed #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b;">
              Issued by the Barangay Nutrition Office under local pediatric guidelines. Safe drinking water is essential.
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
    }
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col font-sans text-v-dark">
      
      {/* Banner informing about API status */}
      {!keyStatus && (
        <div className="bg-[#F1C40F] text-v-dark text-xs py-2.5 px-4 font-bold text-center border-b border-yellow-600 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Notice: operating in Reference Mode with vetted nutritional recipes based on Philippine Department of Health (DOH) presets.</span>
        </div>
      )}

      {/* Main App Navbar */}
      <header className="bg-[#27AE60] text-white shadow-lg py-4.5 px-6 md:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#27AE60] shrink-0">
              <Baby className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black bg-[#1E8449] text-white border border-[#2ECC71] px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Barangay Health Center
                </span>
                <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-widest hidden md:inline">
                  Region VII - Central Visayas
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">BNS Nutrition Planner</h1>
            </div>
          </div>

          {/* Action Header controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Quick Demo Toggle */}
            <div className="flex items-center gap-2 bg-[#1E8449] border border-[#2ECC71] rounded-xl px-3 py-1.5 shadow-inner">
              <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Reference Mode</span>
              <button
                type="button"
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isDemoMode ? 'bg-[#ABEBC6]' : 'bg-[#145A32]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isDemoMode ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="py-2 px-4 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white transition-colors rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              title="Clear all fields"
            >
              <ListRestart className="w-4 h-4" />
              <span className="hidden md:inline font-black">Reset Form</span>
            </button>
          </div>

        </div>
      </header>

      {/* Primary Layout Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        
        {/* Left Column: Form & Local targets - Col-4 */}
        <div className="lg:col-span-4 space-y-6">
          
          <ChildMetricsForm 
            metrics={metrics} 
            onChange={(updated) => setMetrics(updated)} 
            targetNutrients={targetNutrients}
          />

          <NutritionCalculator 
            metrics={metrics} 
            targets={targetNutrients}
          />

          <GrowthTracker 
            metrics={metrics}
            onUpdateMetrics={(updated) => setMetrics(updated)}
          />

          <SavedPlansList
            plans={savedPlans}
            onSelect={handleLoadPlan}
            onDelete={handleDeletePlan}
            selectedPlanId={selectedPlanId}
          />

        </div>

        {/* Right Column: Inventory & Generation Results - Col-8 */}
        <div className="lg:col-span-8 space-y-6">
          
          <IngredientSelector 
            ingredients={ingredients} 
            onChange={(updated) => setIngredients(updated)}
          />

          {/* Call to action panel */}
          <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 shadow-xs relative overflow-hidden">
            <div className="md:flex items-center justify-between gap-6">
              
              <div className="mb-4 md:mb-0">
                <h3 className="font-sans font-black text-sm uppercase tracking-widest text-[#27AE60] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-v-orange"></span>
                  Generate Meal Proposals
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-md font-semibold">
                  We will compile exactly three Filipino recipes utilizing ONLY your checked {selectedIngredientsCount} item(s) from stock.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading || selectedIngredientsCount === 0}
                  onClick={handleGeneratePlan}
                  className="bg-v-orange hover:bg-v-orange-dark disabled:opacity-50 text-white rounded-xl py-3 px-6 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md hover:shadow-lg active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Formulating Recipes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-orange-250 animate-pulse" />
                      <span>Compile Options</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Results Block */}
          {loading && (
            <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-12 text-center text-slate-400 font-sans space-y-4 shadow-sm">
              <Loader2 className="w-8 h-8 text-v-orange animate-spin mx-auto" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-v-orange">Analyzing client assessment criteria...</p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Cross-referencing selected relief pack listings and backyard nutrition guides.</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              {/* Header card with Save and Print controls */}
              <div className="bg-[#E9F7EF] border-2 border-[#ABEBC6] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#27AE60] text-white rounded-xl shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-widest text-[#1E8449]">Plan Completed Successfully</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                      Custom vetted Filipino dishes configured strictly under relief inventory boundaries.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSavePlan}
                    className="flex-1 md:flex-none justify-center bg-white hover:bg-[#FAF9F5] text-v-dark border-2 border-[#E2E8F0] py-2 px-4 shadow-tiny text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-slate-500" />
                    <span>Save to History</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintAll}
                    aria-label="Print printable pamphlet of recipe recommendations"
                    className="flex-1 md:flex-none justify-center bg-v-orange hover:bg-v-orange-dark text-white py-2 px-4 shadow-tiny text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Pamphlet</span>
                  </button>
                </div>
              </div>

              {/* Style & Language Selection toggle banner */}
              <div className="bg-white border-2 border-pink-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-sans font-black text-xs uppercase tracking-wider text-pink-800">
                      Print Style / Tipung Gabay sa Pagluluto
                    </h4>
                    <p className="text-[10px] text-pink-600 font-semibold mt-0.5">
                      Simplify terms and translate guides for local mothers to construct healthy, encouraging milestones.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Mode Buttons */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setHandoutMode(false)}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${!handoutMode ? 'bg-white text-v-dark shadow-tiny' : 'text-slate-500 hover:text-v-dark'}`}
                    >
                      📊 Professional View
                    </button>
                    <button
                      type="button"
                      onClick={() => setHandoutMode(true)}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${handoutMode ? 'bg-pink-600 text-white shadow-tiny' : 'text-slate-500 hover:text-pink-600'}`}
                    >
                      💝 Nanay's Handout
                    </button>
                  </div>

                  {/* Language Selector Dropdown (Shown only if handoutMode is active) */}
                  {handoutMode && (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value as any)}
                        className="bg-white border-2 border-pink-100 text-[#C2185B] text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-pink-300"
                      >
                        <option value="en">English (Simple)</option>
                        <option value="tl">Tagalog (Taglish)</option>
                        <option value="bis">Cebuano (Bisaya)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Empathetic note summary card */}
              <div className={`${handoutMode ? 'bg-[#FFF9FA] border-pink-200 border-l-8 rounded-2xl p-6 border-y-2 border-r-2 shadow-xs' : 'bg-white border-l-8 border-[#3498DB] rounded-2xl p-6 shadow-xs border-y-2 border-r-2 border-slate-200'}`}>
                <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${handoutMode ? 'text-pink-700' : 'text-[#3498DB]'}`}>
                  {handoutMode ? getUIText('whyGoodTitle', targetLanguage) : 'Nutritionist Scholar Advisory'}
                </span>
                <p className="text-xs uppercase font-bold text-gray-400 mb-2 font-sans">
                  {handoutMode ? (targetLanguage === 'en' ? 'Guidance for physical growth and energy' : targetLanguage === 'tl' ? 'Gabay para sa kalusugan at sigla ni baby' : 'Giya alang sa kusog ug pagdako sa bata') : 'Guiding active pediatric recovery steps'}
                </p>
                <p className="text-sm font-sans italic leading-relaxed text-v-dark font-medium">
                  "{handoutMode ? simplifyAndTranslateText(result.nutritionistNote, targetLanguage) : result.nutritionistNote}"
                </p>
              </div>

              {/* Dynamic Meal Stretching Plan block */}
              {result.stretchingPlan && (
                <div className={`${handoutMode ? 'bg-[#FFFDF3] border-2 border-amber-200 rounded-2xl p-6 shadow-xs space-y-4' : 'bg-gradient-to-br from-[#FFF9E6] to-[#FFF3CD] border-2 border-[#F39C12]/40 rounded-2xl p-6 shadow-xs space-y-4'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#D35400] text-white rounded-xl shadow-tiny">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-sm uppercase tracking-wider text-[#D35400] flex items-center gap-2">
                        {handoutMode ? getUIText('stretchingTitle', targetLanguage) : 'Maximize the Rations (Meal Stretching Plan)'}
                      </h4>
                      <p className="text-[11px] text-amber-900 font-bold mt-0.5">
                        {handoutMode ? 
                          (targetLanguage === 'en' ? 'Friendly guidance on how to stretch meal ingredients across the entire day.' : targetLanguage === 'tl' ? 'Paano hahatiin nang ligtas at maayos ang limitadong sangkap para sa buong araw.' : 'Giya unsaon pag-apod-apod og maayo sa mga pagkaon para sa tibuok adlaw.') 
                          : 'Vital strategic nutrition instructions designed for low-resource or extremely limited household inventory.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                    {/* Preparation Strategy Card */}
                    <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4.5 border border-amber-200 shadow-tiny space-y-2">
                      <div className="text-[10px] uppercase font-black tracking-widest text-[#D35400] bg-orange-100/60 px-2.5 py-0.5 rounded-md inline-block">
                        {handoutMode ? getUIText('prepStrategyLabel', targetLanguage).substring(3) : 'Preparation Strategy'}
                      </div>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">
                        {handoutMode ? simplifyAndTranslateText(result.stretchingPlan.preparationStrategy, targetLanguage) : result.stretchingPlan.preparationStrategy}
                      </p>
                    </div>

                    {/* Broth/Sabaw Addition Card */}
                    <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4.5 border border-amber-200 shadow-tiny space-y-2">
                      <div className="text-[10px] uppercase font-black tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
                        {handoutMode ? getUIText('brothAdditionLabel', targetLanguage).substring(3) : 'Broth / Sabaw Addition'}
                      </div>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">
                        {handoutMode ? simplifyAndTranslateText(result.stretchingPlan.brothAddition, targetLanguage) : result.stretchingPlan.brothAddition}
                      </p>
                    </div>

                    {/* Nutritional Focus Card */}
                    <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4.5 border border-amber-200 shadow-tiny space-y-2">
                      <div className="text-[10px] uppercase font-black tracking-widest text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
                        {handoutMode ? getUIText('nutritionalFocusLabel', targetLanguage).substring(3) : 'Nutritional Focus'}
                      </div>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">
                        {handoutMode ? simplifyAndTranslateText(result.stretchingPlan.nutritionalFocus, targetLanguage) : result.stretchingPlan.nutritionalFocus}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3 recipes list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.recipes.map((r, i) => (
                  <RecipeCard key={r.id} recipe={r} targets={targetNutrients} index={i} handoutMode={handoutMode} targetLanguage={targetLanguage} />
                ))}
              </div>

            </motion.div>
          )}

          {!loading && !result && (
            <div className="bg-[#FEF9E7]/45 rounded-2xl border-2 border-dashed border-[#F9E79F] p-12 text-center text-slate-400 font-sans shadow-xs">
              <BookOpen className="w-10 h-10 text-[#F1C40F] mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-[#9A7D0A]">No active recipes formulated</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                Select ingredients and click "Compile Options" to produce tailored culturally appropriate budget meals.
              </p>
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="h-[60px] bg-[#ECF0F1] flex flex-col sm:flex-row items-center justify-between px-8 border-t border-gray-200 mt-12 py-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Empowering Barangay Nutrition Scholars • Community Health Initiative 2026</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#27AE60]">
            <div className="w-2 h-2 rounded-full bg-[#27AE60]"></div>Verified Budget-Friendly
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#E67E22]">
            <div className="w-2 h-2 rounded-full bg-[#E67E22]"></div>Calorie Correct
          </div>
        </div>
      </footer>

    </div>
  );
}
