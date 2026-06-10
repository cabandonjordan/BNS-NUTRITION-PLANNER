/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Recipe, NutrientTarget } from '../types';
import { Utensils, Heart, Flame, Sparkles, Printer, CheckCircle2, CheckSquare, Square, AlertCircle, Smile } from 'lucide-react';
import { simplifyAndTranslateText, translateIngredient, getUIText, TargetLanguage } from '../lib/translation';

interface RecipeCardProps {
  key?: any;
  recipe: Recipe;
  targets: NutrientTarget;
  index: number;
  handoutMode?: boolean;
  targetLanguage?: TargetLanguage;
}

export default function RecipeCard({ recipe, targets, index, handoutMode = false, targetLanguage = 'en' }: RecipeCardProps) {
  // Track completed ingredients and step checklists in Mother's Handout Mode
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [safePrepChecked, setSafePrepChecked] = useState<Record<string, boolean>>({});

  // Compute percentage fills for Professional view
  const calPercent = Math.min(100, Math.round((recipe.nutritionalBrief.caloriesEstimate / targets.energyKcal) * 100));
  const protPercent = Math.min(100, Math.round((recipe.nutritionalBrief.proteinEstimate / targets.proteinG) * 100));
  const ironPercent = Math.min(100, Math.round((recipe.nutritionalBrief.ironEstimate / targets.ironMg) * 100));

  const toggleIngredient = (ingName: string) => {
    setCheckedIngredients(prev => ({ ...prev, [ingName]: !prev[ingName] }));
  };

  const toggleStep = (stepIdx: number) => {
    setCheckedSteps(prev => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const togglePrep = (key: string) => {
    setSafePrepChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    if (handoutMode) {
      // PRINT NAND HANDOUT MODULE - Dynamic local, friendly translation, free of technical jargon, clean printable checklist!
      const titleTrans = simplifyAndTranslateText(recipe.name, targetLanguage);
      const ingredientsList = recipe.ingredientsUsed.map(i => translateIngredient(i, targetLanguage));
      const prepInstructions = recipe.preparationGuide.map(s => simplifyAndTranslateText(s, targetLanguage));
      const childBenefitTrans = simplifyAndTranslateText(recipe.nutritionalBrief.whyGood, targetLanguage);
      const childReasonDetailed = simplifyAndTranslateText(recipe.nutritionalValue, targetLanguage);

      const tIngredientTitle = getUIText('ingredientsTitle', targetLanguage);
      const tInstructionsTitle = getUIText('instructionsTitle', targetLanguage);
      const tChecklistTitle = getUIText('checklistTitle', targetLanguage);
      const tWhyGoodTitle = getUIText('whyGoodTitle', targetLanguage);
      const tTip1 = getUIText('motherTip1', targetLanguage);
      const tTip2 = getUIText('motherTip2', targetLanguage);
      const tEncouraging = getUIText('encouragingClosing', targetLanguage);

      printWindow.document.write(`
        <html>
          <head>
            <title>Giya sa Pagluto para kay Nanay: ${titleTrans}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
              .card { border: 3px solid #fbcfe8; border-radius: 20px; padding: 30px; max-width: 650px; margin: 0 auto; background-color: #fffdfa; }
              .header { text-align: center; border-bottom: 2px dashed #fbcfe8; padding-bottom: 20px; margin-bottom: 20px; }
              .heart-icon { font-size: 30px; color: #db2777; margin-bottom: 5px; }
              .pamphlet-badge { background: #fdf2f8; color: #db2777; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; display: inline-block; border: 1px solid #fbcfe8; }
              .title { font-size: 24px; font-weight: 800; color: #be185d; margin: 8px 0 0 0; }
              .mother-reason { font-size: 14px; font-style: italic; color: #be185d; background: #fff1f2; border: 1px solid #fecdd3; padding: 12px; border-radius: 12px; margin: 15px 0; font-weight: 600; text-align: left; }
              
              .strength-box { display: grid; grid-template-cols: repeat(3, 1fr); gap: 10px; margin: 15px 0; text-align: center; }
              .strength-badge { background: #fffbeb; border: 1px solid #fde68a; color: #b45309; border-radius: 10px; padding: 8px; font-size: 12px; font-weight: bold; }

              .section-title { font-size: 15px; text-transform: uppercase; font-weight: bold; color: #be185d; margin-top: 25px; margin-bottom: 12px; border-bottom: 2px solid #fbcfe8; padding-bottom: 4px; }
              .checklist-item { display: flex; align-items: start; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; font-weight: 500; }
              .checkbox-box { width: 16px; height: 16px; border: 2px solid #db2777; border-radius: 4px; margin-top: 2px; }
              
              .tip-container { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 15px; margin-top: 20px; }
              .tip-title { font-weight: bold; color: #047857; font-size: 13px; text-transform: uppercase; margin-bottom: 6px; }
              
              .closing-msg { background: #fef2f2; border: 1.5px solid #fecdd3; border-radius: 12px; padding: 15px; font-size: 13px; font-style: italic; color: #881337; line-height: 1.5; margin-top: 25px; }
              .bhc-sign { font-size: 11px; font-weight: bold; text-align: center; margin-top: 35px; color: #be185d; border-top: 1px dashed #fbcfe8; padding-top: 15px; text-transform: uppercase; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <div class="heart-icon">💝</div>
                <div class="pamphlet-badge">GABAY SA PAGKAIN PARA KAY NANAY</div>
                <h1 class="title">${titleTrans}</h1>
              </div>

              <div class="mother-reason">
                <strong>Gabay para sa kalusugan ni baby:</strong><br/>
                ${childBenefitTrans}. ${childReasonDetailed}
              </div>

              <div class="strength-box">
                <div class="strength-badge">💪 Lakas at Enerhiya</div>
                <div class="strength-badge" style="background:#fef2f2; border-color:#fecdd3; color:#9f1239;">🍖 Pampatibay ng Unod</div>
                <div class="strength-badge" style="background:#eff6ff; border-color:#bfdbfe; color:#1e40af;">🩸 Pampasigla ng Dugo</div>
              </div>

              <div class="section-title">✔ ${tIngredientTitle}</div>
              ${ingredientsList.map(ing => `
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
              ${prepInstructions.map((step, sidx) => `
                <div class="checklist-item">
                  <div class="checkbox-box"></div>
                  <div><strong>Hakbang ${sidx + 1}:</strong> ${step}</div>
                </div>
              `).join('')}

              <div class="tip-container">
                <div class="tip-title">🛡 ${tChecklistTitle}</div>
                <div class="checklist-item" style="border:none; padding:4px 0;">
                  <div class="checkbox-box" style="border-color:#10b981;"></div>
                  <div style="font-size:12px; color:#1e293b;">${tTip1}</div>
                </div>
                <div class="checklist-item" style="border:none; padding:4px 0;">
                  <div class="checkbox-box" style="border-color:#10b981;"></div>
                  <div style="font-size:12px; color:#1e293b;">${tTip2}</div>
                </div>
              </div>

              <div class="closing-msg">
                ${tEncouraging.replace(/\n/g, '<br/>')}
              </div>

              <div class="bhc-sign">
                Inihandog ng inyong Barangay Health Center at BNS Helper • 2026
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
    } else {
      // PRINT REGULAR PROFESSIONAL CARD
      printWindow.document.write(`
        <html>
          <head>
            <title>BNS Nutritionist Recipe: ${recipe.name}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #334155; }
              .card { border: 2px solid #e2e8f0; border-radius: 16px; padding: 30px; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
              .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
              .title { font-size: 24px; font-weight: bold; color: #e11d48; margin: 0; }
              .subtitle { font-size: 13px; color: #64748b; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
              .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; color: #475569; margin-top: 25px; margin-bottom: 10px; border-left: 4px solid #e11d48; padding-left: 8px; }
              .ingredient-list { list-style: none; padding: 0; }
              .ingredient-item { padding: 6px 0; border-bottom: 1px dashed #f1f5f9; font-size: 14px; }
              .step-list { padding-left: 20px; }
              .step-item { font-size: 14px; margin-bottom: 10px; line-height: 1.5; }
              .stats-grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 15px; margin: 20px auto; text-align: center; }
              .stat-box { border: 1px solid #f1f5f9; background-color: #fafafa; border-radius: 10px; padding: 10px; }
              .stat-num { font-size: 16px; font-weight: bold; color: #1e293b; }
              .stat-label { font-size: 11px; color: #64748b; margin-top: 2px; }
              .footer-note { font-size: 12px; font-style: italic; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <p class="subtitle">Barangay Nutrition Scholar Relief Recipe</p>
                <h1 class="title">${recipe.name}</h1>
              </div>
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-num">${recipe.nutritionalBrief.caloriesEstimate} kcal</div>
                  <div class="stat-label">Calories (${calPercent}% Daily)</div>
                </div>
                <div class="stat-box">
                  <div class="stat-num">${recipe.nutritionalBrief.proteinEstimate}g</div>
                  <div class="stat-label">Protein (${protPercent}% Daily)</div>
                </div>
                <div class="stat-box text-rose-500">
                  <div class="stat-num">${recipe.nutritionalBrief.ironEstimate}mg</div>
                  <div class="stat-label">Iron (${ironPercent}% Daily)</div>
                </div>
              </div>
              <div class="section-title">Ingredients Needed</div>
              <ul class="ingredient-list">
                ${recipe.ingredientsUsed.map(i => `<li class="ingredient-item">✔ ${i}</li>`).join('')}
                <li class="ingredient-item" style="color:#64748b;">✔ Basic clean water, small oil, & tiny pinch of salt</li>
              </ul>
              <div class="section-title">Preparation Instructions</div>
              <ol class="step-list">
                ${recipe.preparationGuide.map(step => `<li class="step-item">${step}</li>`).join('')}
              </ol>
              <div class="section-title">Nutrition Impact</div>
              <p style="font-size: 13px; line-height: 1.5; margin: 5px 0;">${recipe.nutritionalBrief.whyGood}</p>
              <p style="font-size: 13px; line-height: 1.5; color:#64748b; margin: 10px 0;">${recipe.nutritionalValue}</p>
              <div class="footer-note">Handed over by your friendly Barangay Nutrition Scholar helper. Parasite screening and regular weight check is advised.</div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
    }
    printWindow.document.close();
  };

  const borderColors = [
    'border-l-8 border-[#F1C40F]', // Yellow option 1
    'border-l-8 border-[#E67E22]', // Orange option 2
    'border-l-8 border-[#27AE60]', // Green option 3
  ];

  const cardBorderAndShadow = borderColors[index % borderColors.length];

  // MOTHER FRIENDLY HANDOUT VIEW MODE
  if (handoutMode) {
    const tIngredients = getUIText('ingredientsTitle', targetLanguage);
    const tInstructions = getUIText('instructionsTitle', targetLanguage);
    const tChecklistTitle = getUIText('checklistTitle', targetLanguage);
    const tWhyGoodTitle = getUIText('whyGoodTitle', targetLanguage);
    const tTip1 = getUIText('motherTip1', targetLanguage);
    const tTip2 = getUIText('motherTip2', targetLanguage);
    const tTip3 = getUIText('motherTip3', targetLanguage);
    const tEncouraging = getUIText('encouragingClosing', targetLanguage);

    const translatedTitle = simplifyAndTranslateText(recipe.name, targetLanguage);
    const translatedWhyGood = simplifyAndTranslateText(recipe.nutritionalBrief.whyGood, targetLanguage);
    const translatedValue = simplifyAndTranslateText(recipe.nutritionalValue, targetLanguage);

    return (
      <div className="bg-[#FFFDF6] rounded-2xl border-2 border-pink-200 shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between font-sans">
        <div>
          {/* Handout Banner */}
          <div className="bg-[#FFF3f8] p-5 border-b border-pink-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                <Heart className="w-6 h-6 animate-pulse shrink-0" />
              </div>
              <div>
                <span className="text-[9px] font-black bg-pink-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Nanay's Handout Checklist
                </span>
                <h3 className="font-sans font-black text-base text-pink-800 uppercase mt-1 tracking-tight">
                  {translatedTitle}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrintCard}
              className="p-2 text-pink-500 hover:text-white bg-white hover:bg-pink-600 border-2 border-pink-100 hover:border-pink-600 shadow-tiny rounded-xl transition-all cursor-pointer"
              title="Print Mother's Handout Flyer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* Terminology-free highlight box */}
          <div className="m-5 p-4.5 bg-[#FFF5F7] rounded-xl border border-pink-200">
            <h4 className="text-[11px] font-black uppercase text-pink-700 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Smile className="w-4 h-4 text-pink-600 inline shrink-0" />
              {tWhyGoodTitle}
            </h4>
            <p className="text-xs text-pink-950 font-bold leading-relaxed">
              {translatedWhyGood}. {translatedValue}
            </p>
          </div>

          {/* Friendly simple checkable targets (Free of numbers if requested, or simplified) */}
          <div className="px-5 pb-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">
                <span className="text-[14px] block mb-0.5">💪</span>
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800">
                  {targetLanguage === 'en' ? 'Energy' : targetLanguage === 'tl' ? 'Lakas' : 'Kusog'}
                </span>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2 text-center2 text-center">
                <span className="text-[14px] block mb-0.5">🍖</span>
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-800">
                  {targetLanguage === 'en' ? 'Growth' : targetLanguage === 'tl' ? 'Pampatibay' : 'Pampadako'}
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-center">
                <span className="text-[14px] block mb-0.5">🩸</span>
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-800">
                  {targetLanguage === 'en' ? 'Good Blood' : targetLanguage === 'tl' ? 'Dugo' : 'Dugo'}
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients checkable List */}
          <div className="px-5 py-3 border-t border-dotted border-gray-100">
            <p className="text-[11px] uppercase font-black tracking-wider text-pink-700 mb-2">
              🛒 {tIngredients}
            </p>
            <div className="space-y-1.5">
              {recipe.ingredientsUsed.map((ing, idx) => {
                const transIng = translateIngredient(ing, targetLanguage);
                const isChecked = !!checkedIngredients[ing];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleIngredient(ing)}
                    className="w-full text-left flex items-start gap-3 p-2 rounded-lg bg-white border border-gray-100 hover:border-pink-200 transition-all cursor-pointer text-xs"
                  >
                    <div className="shrink-0 mt-0.5 text-pink-600">
                      {isChecked ? <CheckSquare className="w-4 h-4 fill-pink-50" /> : <Square className="w-4 h-4" />}
                    </div>
                    <span className={`font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {transIng}
                    </span>
                  </button>
                );
              })}
              {/* Basic elements water, oil, salt */}
              <button
                type="button"
                onClick={() => toggleIngredient('basic_elements')}
                className="w-full text-left flex items-start gap-3 p-2 rounded-lg bg-white border border-gray-100 hover:border-pink-200 transition-all cursor-pointer text-xs"
              >
                <div className="shrink-0 mt-0.5 text-pink-600">
                  {checkedIngredients['basic_elements'] ? <CheckSquare className="w-4 h-4 fill-pink-50" /> : <Square className="w-4 h-4" />}
                </div>
                <span className={`font-semibold italic text-slate-400 ${checkedIngredients['basic_elements'] ? 'line-through' : ''}`}>
                  {targetLanguage === 'en' ? 'Clean Water, a pinch of Salt, & drop of Cooking Oil' :
                   targetLanguage === 'tl' ? 'Malinis na tubig, kaunting asin, at patak ng mantika' :
                   'Limpyo nga tubig, gamay nga asin, ug patak sa mantika'}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Steps list */}
          <div className="px-5 py-4 border-t border-dotted border-gray-100 space-y-3">
            <p className="text-[11px] uppercase font-black tracking-wider text-pink-700">
              🍳 {tInstructions}
            </p>
            <div className="space-y-2.5">
              {recipe.preparationGuide.map((step, idx) => {
                const transStep = simplifyAndTranslateText(step, targetLanguage);
                const isChecked = !!checkedSteps[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-pink-200 transition-all cursor-pointer text-xs group"
                  >
                    <div className="shrink-0 mt-0.5 text-pink-600">
                      {isChecked ? (
                        <CheckSquare className="w-4.5 h-4.5 fill-pink-50" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full bg-pink-100 text-pink-600 font-bold text-[10px] flex items-center justify-center group-hover:bg-pink-200">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className={`font-sans font-medium leading-relaxed ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {transStep}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clean Sanitation Checklist Tip */}
        <div className="mx-5 mb-5 p-4 bg-emerald-50/75 rounded-2xl border border-emerald-200 space-y-2">
          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
            🛡 {tChecklistTitle}
          </span>
          
          <button
            type="button"
            onClick={() => togglePrep('wash')}
            className="w-full text-left flex items-start gap-2.5 cursor-pointer text-[11px] text-emerald-950 font-semibold"
          >
            <div className="shrink-0 mt-0.5 text-emerald-600">
              {safePrepChecked['wash'] ? <CheckSquare className="w-3.5 h-3.5 fill-emerald-50" /> : <Square className="w-3.5 h-3.5" />}
            </div>
            <span className={safePrepChecked['wash'] ? 'line-through text-emerald-600/60' : ''}>
              {tTip1}
            </span>
          </button>

          <button
            type="button"
            onClick={() => togglePrep('boil')}
            className="w-full text-left flex items-start gap-2.5 cursor-pointer text-[11px] text-emerald-950 font-semibold border-t border-emerald-200/50 pt-2"
          >
            <div className="shrink-0 mt-0.5 text-emerald-600">
              {safePrepChecked['boil'] ? <CheckSquare className="w-3.5 h-3.5 fill-emerald-50" /> : <Square className="w-3.5 h-3.5" />}
            </div>
            <span className={safePrepChecked['boil'] ? 'line-through text-emerald-600/60' : ''}>
              {tTip2}
            </span>
          </button>

          <button
            type="button"
            onClick={() => togglePrep('small')}
            className="w-full text-left flex items-start gap-2.5 cursor-pointer text-[11px] text-emerald-950 font-semibold border-t border-emerald-200/50 pt-2"
          >
            <div className="shrink-0 mt-0.5 text-emerald-600">
              {safePrepChecked['small'] ? <CheckSquare className="w-3.5 h-3.5 fill-emerald-50" /> : <Square className="w-3.5 h-3.5" />}
            </div>
            <span className={safePrepChecked['small'] ? 'line-through text-emerald-600/60' : ''}>
              {tTip3}
            </span>
          </button>
        </div>

        {/* Short, sweet closing statement from the Health Center */}
        <div className="mx-5 mb-5 p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-[11px] text-rose-800 leading-relaxed italic font-medium">
          {tEncouraging.split('\n').map((line, lidx) => (
            <span key={lidx} className="block mt-0.5 font-sans">
              {line}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // STANDARD CLINICAL / PROFESSIONAL VIEW MODE
  return (
    <div className={`bg-white rounded-2xl border-2 border-[#E2E8F0] ${cardBorderAndShadow} shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between`}>
      <div>
        {/* Banner/Header */}
        <div className="bg-[#FAF9F5] p-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDFCF0] border-2 border-[#E2E8F0] rounded-xl flex items-center justify-center text-v-dark font-black">
              {index + 1}
            </div>
            <div>
              <p className="text-[10px] font-bold text-v-green uppercase tracking-widest">Recipe Option</p>
              <h3 className="font-sans font-black text-sm text-v-dark uppercase tracking-tight">{recipe.name}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePrintCard}
            className="p-2 text-slate-400 hover:text-v-green bg-white border-2 border-slate-100 hover:border-v-green/45 shadow-xs rounded-xl transition-all cursor-pointer"
            title="Print recipe handout for parent"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Nutritional Fill bar graph */}
        <div className="p-5 border-b border-gray-100 bg-[#FDFCF0]/50">
          <p className="text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">RENI Goal Coverage (Per serving)</p>
          <div className="grid grid-cols-3 gap-3">
            
            {/* Calories percentage bubble */}
            <div className="bg-[#FEF9E7] p-2.5 rounded-lg border-2 border-[#F9E79F]/40 text-center">
              <span className="text-[10px] font-bold text-[#7D6608] block mb-1">Calories</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mb-1 border-slate-35 border-tiny overflow-hidden">
                <div className="bg-[#F1C40F] h-full rounded-full" style={{ width: `${calPercent}%` }} />
              </div>
              <span className="text-xs font-black font-mono text-v-dark">
                {recipe.nutritionalBrief.caloriesEstimate} <span className="text-[9px] font-bold text-[#7D6608]">kcal</span>
              </span>
              <span className="text-[9px] block text-[#7D6608] font-black mt-0.5">{calPercent}% daily</span>
            </div>

            {/* Protein percentage bubble */}
            <div className="bg-[#FDF2E9] p-2.5 rounded-lg border-2 border-[#F5CBA7]/40 text-center">
              <span className="text-[10px] font-bold text-v-orange-dark block mb-1">Protein</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mb-1 border-slate-35 border-tiny overflow-hidden">
                <div className="bg-[#E67E22] h-full rounded-full" style={{ width: `${protPercent}%` }} />
              </div>
              <span className="text-xs font-black font-mono text-v-dark">
                {recipe.nutritionalBrief.proteinEstimate}<span className="text-[9px] font-bold text-v-orange-dark">g</span>
              </span>
              <span className="text-[9px] block text-[#A04000] font-black mt-0.5">{protPercent}% daily</span>
            </div>

            {/* Iron percentage bubble */}
            <div className="bg-[#E9F7EF] p-2.5 rounded-lg border-2 border-[#ABEBC6]/40 text-center">
              <span className="text-[10px] font-bold text-[#1E8449] block mb-1">Iron</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mb-1 border-slate-35 border-tiny overflow-hidden">
                <div className="bg-[#27AE60] h-full rounded-full" style={{ width: `${ironPercent}%` }} />
              </div>
              <span className="text-xs font-black font-mono text-v-dark">
                {recipe.nutritionalBrief.ironEstimate}<span className="text-[9px] font-bold text-v-green">mg</span>
              </span>
              <span className="text-[9px] block text-[#1E8449] font-black mt-0.5">{ironPercent}% daily</span>
            </div>

          </div>
        </div>

        {/* Ingredients required */}
        <div className="p-5 border-b border-slate-50">
          <p className="text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">Ingredients Used</p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredientsUsed.map((ing, idx) => (
              <span key={idx} className="text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-[#E9F7EF] text-[#27AE60] rounded-md border-2 border-[#ABEBC6]/40">
                {ing}
              </span>
            ))}
            <span className="text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-[#F4F7F6] text-slate-500 rounded-md border-2 border-slate-200">
              Basic Water / Cooking Oil / Salt
            </span>
          </div>
        </div>

        {/* Preparation Guide steps */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Preparation Guide</p>
          <div className="space-y-2.5">
            {recipe.preparationGuide.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-[#EBF5FB] text-v-blue font-black text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs text-v-dark leading-relaxed font-sans font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maternal guidance info footer */}
      <div className="mx-5 mb-5 p-3.5 bg-[#FEF9E7] rounded-xl border-2 border-[#F9E79F]/40 text-[11px] text-[#7D6608] font-sans leading-relaxed flex items-start gap-2.5">
        <Heart className="w-4 h-4 text-v-orange shrink-0 mt-0.5" />
        <div>
          <span className="font-black uppercase tracking-wider text-v-dark block">BNS Nutrition Impact</span>
          <span className="block text-slate-600 font-bold mb-1">{recipe.nutritionalBrief.whyGood}</span>
          <p className="text-slate-600 leading-normal font-medium">{recipe.nutritionalValue}</p>
        </div>
      </div>
    </div>
  );
}
