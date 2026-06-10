/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NutrientTarget, ChildMetrics } from '../types';
import { Flame, Beef, Activity, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

interface NutritionCalculatorProps {
  metrics: ChildMetrics;
  targets: NutrientTarget;
}

export default function NutritionCalculator({ metrics, targets }: NutritionCalculatorProps) {
  // Simplified estimated Ideal Body Weight (IBW) based on age band for low-resource health tracking
  const getIdealWeightRange = (ageBand: string): { min: number; max: number; desc: string } => {
    switch (ageBand) {
      case '6-11 months':
        return { min: 7.2, max: 10.0, desc: 'Average: ~8.6kg' };
      case '12-23 months':
        return { min: 9.0, max: 12.5, desc: 'Average: ~10.5kg' };
      case '24-35 months':
        return { min: 11.2, max: 15.1, desc: 'Average: ~12.9kg' };
      case '3-5 years':
      default:
        return { min: 13.5, max: 19.5, desc: 'Average: ~16.5kg' };
    }
  };

  const ibw = getIdealWeightRange(metrics.age);
  const currentWeight = metrics.weightKg || 0;
  
  // Assess weight gap ratio
  const weightStatus = (() => {
    if (currentWeight === 0) return { label: 'Input Weight', color: 'text-slate-400 bg-slate-100' };
    if (currentWeight < ibw.min) return { label: 'Below Target Weight', color: 'text-rose-600 bg-rose-50 border-rose-100' };
    if (currentWeight > ibw.max) return { label: 'Above Typical Range', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    return { label: 'Healthy Weight Range', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
  })();

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <div className="p-2.5 bg-[#FEF9E7] text-v-orange rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-black text-sm uppercase tracking-widest text-[#9A7D0A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-v-orange"></span>
              RENI Targets
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Filipino Recommended Energy & Nutrient Intakes</p>
          </div>
        </div>

        {/* Ideal Weight Indicator */}
        <div className="mb-6 p-4 rounded-xl border-2 border-[#F9E79F] bg-[#FEF9E7] shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A7D0A]">Nutritional Diagnosis Helper</span>
            {currentWeight > 0 && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${weightStatus.color}`}>
                {weightStatus.label}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xs font-semibold text-slate-600">Ideal for {metrics.age}:</span>
            <span className="text-sm font-black text-[#9A7D0A] font-mono">{ibw.min}kg - {ibw.max}kg</span>
            <span className="text-[10px] text-[#7D6608] font-bold">({ibw.desc})</span>
          </div>
        </div>

        {/* Nutrient targets cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Daily Recommended Intake</h3>
          
          {/* Energy Kcal */}
          <div className="flex items-center justify-between p-3.5 bg-[#FEF9E7] rounded-xl border-2 border-[#F9E79F]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F1C40F]/10 text-[#9A7D0A] rounded-lg">
                <Flame className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#7D6608] block">Energy (Caloric Density)</span>
                <span className="text-[10px] text-slate-500">Essential for active play & recovery</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-v-dark font-mono">{targets.energyKcal} </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">kcal</span>
            </div>
          </div>

          {/* Protein */}
          <div className="flex items-center justify-between p-3.5 bg-[#FDF2E9] rounded-xl border-2 border-[#F5CBA7]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E67E22]/10 text-v-orange-dark rounded-lg">
                <Beef className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-v-orange-dark block">Protein (Growth)</span>
                <span className="text-[10px] text-slate-500">Builds muscle tissue & repairs cells</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-v-dark font-mono">{targets.proteinG} </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">grams</span>
            </div>
          </div>

          {/* Iron */}
          <div className="flex items-center justify-between p-3.5 bg-[#E9F7EF] rounded-xl border-2 border-[#ABEBC6]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27AE60]/10 text-v-green rounded-lg">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-v-green block">Iron (Anti-Anemia)</span>
                <span className="text-[10px] text-slate-500">Prevents anemia & boosts brain health</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-v-dark font-mono">{targets.ironMg} </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">mg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Micronutrient tips panel */}
      <div className="mt-6 bg-[#F4F7F6] p-4 rounded-xl border-2 border-slate-100 text-xs text-v-dark space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-v-green uppercase tracking-wide">
          <CheckCircle className="w-3.5 h-3.5 text-[#27AE60]" />
          <span>Nutrition Scholar Tip</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          Combining sardines or fish containing <span className="font-bold text-v-dark">Iron</span> with vitamin-rich <span className="font-bold text-v-dark">Kalabasa (Squash)</span> or <span className="font-bold text-v-dark">Malunggay leaves</span> vastly enhances micronutrient bioavailability and helps children gain weight.
        </p>
      </div>
    </div>
  );
}
