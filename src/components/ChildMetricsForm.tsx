/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChildMetrics, NutrientTarget } from '../types';
import { Baby, Scale, Ruler, AlertTriangle, ChevronRight, User } from 'lucide-react';

interface ChildMetricsFormProps {
  metrics: ChildMetrics;
  onChange: (updated: ChildMetrics) => void;
  targetNutrients: NutrientTarget;
}

export const getRENITarget = (age: string): NutrientTarget => {
  switch (age) {
    case '6-11 months':
      return { energyKcal: 720, proteinG: 12, ironMg: 10 };
    case '12-23 months':
      return { energyKcal: 1000, proteinG: 14, ironMg: 8 };
    case '24-35 months':
      return { energyKcal: 1070, proteinG: 16, ironMg: 8 };
    case '3-5 years':
    default:
      return { energyKcal: 1350, proteinG: 20, ironMg: 9 };
  }
};

const NUTRITIONAL_NEEDS_OPTIONS = [
  { id: 'Underweight', label: 'Severe Underweight (Low weight-for-age)' },
  { id: 'Wasting', label: 'Wasted or Thin (Low weight-for-height)' },
  { id: 'Stunting', label: 'Stunted or Short (Low height-for-age)' },
  { id: 'Protein-Energy Malnutrition', label: 'Protein-Energy Malnutrition (PEM)' },
  { id: 'Iron-Deficiency Anemia', label: 'Anemic or Pale (Iron deficiency)' },
  { id: 'Vitamin A Deficiency', label: 'Frequent sickness (Vitamin A deficiency)' },
];

export default function ChildMetricsForm({ metrics, onChange, targetNutrients }: ChildMetricsFormProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...metrics, [name]: name === 'weightKg' || name === 'heightCm' ? Number(value) : value };
    
    if (name === 'age') {
      // Auto recommend nutritional targets based on age band if needed
    }
    onChange(updated);
  };

  const handleCheckboxChange = (needId: string) => {
    const currentNeeds = [...metrics.nutritionalNeeds];
    const index = currentNeeds.indexOf(needId);
    if (index > -1) {
      currentNeeds.splice(index, 1);
    } else {
      currentNeeds.push(needId);
    }
    onChange({ ...metrics, nutritionalNeeds: currentNeeds });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 shadow-xs">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <div className="p-2.5 bg-[#E8F8F5] text-v-green rounded-xl">
          <Baby className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-sans font-black text-sm uppercase tracking-widest text-v-green flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-v-orange"></span>
            Child assessment
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">Input child metrics to estimate RENI deficiencies</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Child Identifier */}
        <div>
          <label htmlFor="child_name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Child Name / Case ID
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="child_name"
              type="text"
              name="name"
              value={metrics.name}
              onChange={handleTextChange}
              placeholder="e.g., Baby Juan or Case A-102"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-v-dark placeholder:text-slate-400 focus:outline-hidden focus:ring-4 focus:ring-v-green/10 focus:border-v-green transition-all font-sans"
            />
          </div>
        </div>

        {/* Age Band Selector */}
        <div>
          <label htmlFor="child_age" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            RENI Age Bracket (Philippines Standards)
          </label>
          <select
            id="child_age"
            name="age"
            value={metrics.age}
            onChange={handleTextChange}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 px-4 text-sm text-v-dark focus:outline-hidden focus:ring-4 focus:ring-v-green/10 focus:border-v-green transition-all font-sans cursor-pointer"
          >
            <option value="6-11 months">6 to 11 months (Infant)</option>
            <option value="12-23 months">12 to 23 months (Toddler Phase 1)</option>
            <option value="24-35 months">24 to 35 months (Toddler Phase 2)</option>
            <option value="3-5 years">3 to 5 years (Preschool stage)</option>
          </select>
        </div>

        {/* Weight and Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="child_weight" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Weight (kg)
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="child_weight"
                type="number"
                step="0.1"
                min="1"
                max="50"
                name="weightKg"
                value={metrics.weightKg || ''}
                onChange={handleTextChange}
                placeholder="0.0"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-sm text-v-dark focus:outline-hidden focus:ring-4 focus:ring-v-green/10 focus:border-v-green transition-all font-sans font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
            </div>
          </div>

          <div>
            <label htmlFor="child_height" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Height (cm)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="child_height"
                type="number"
                step="0.1"
                min="30"
                max="150"
                name="heightCm"
                value={metrics.heightCm || ''}
                onChange={handleTextChange}
                placeholder="0.0"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-sm text-v-dark focus:outline-hidden focus:ring-4 focus:ring-v-green/10 focus:border-v-green transition-all font-sans font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">cm</span>
            </div>
          </div>
        </div>

        {/* Nutritional concerns */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Nutritional Gaps / Diagnostic Flags
          </label>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 border-2 border-slate-100 rounded-xl p-3 bg-[#F4F7F6]">
            {NUTRITIONAL_NEEDS_OPTIONS.map((option) => {
              const checked = metrics.nutritionalNeeds.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    checked
                      ? 'border-v-orange bg-[#FDF2E9] text-v-dark'
                      : 'border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="mt-0.5 rounded-sm border-slate-300 text-v-orange focus:ring-v-orange h-4.5 w-4.5 cursor-pointer accent-v-orange"
                  />
                  <div className="text-xs">
                    <span className={`font-bold block ${checked ? 'text-v-orange-dark' : 'text-slate-800'}`}>
                      {option.id}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{option.label}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* BNS Health Worker Notes / Feedback */}
          <div className="mt-4">
            <label htmlFor="bns_feedback" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              BNS Feedback & Household Constraints
            </label>
            <textarea
              id="bns_feedback"
              name="bnsFeedback"
              value={metrics.bnsFeedback || ''}
              onChange={(e) => onChange({ ...metrics, bnsFeedback: e.target.value })}
              placeholder="e.g., child is allergic to squash, family only has charcoal stove to boil water (no frying/oil)"
              rows={2}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 px-4 text-xs text-v-dark placeholder:text-slate-400 focus:outline-hidden focus:ring-4 focus:ring-v-green/10 focus:border-v-green transition-all font-sans"
            />
          </div>

          {/* Targeted Warning banner at bottom of profile */}
          {metrics.nutritionalNeeds.length > 0 && (
            <div className="mt-4 bg-[#FADBD8] p-3 rounded-xl border border-[#E74C3C] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
              <p className="text-xs text-[#C0392B] font-bold leading-tight">
                TARGET CASE GAPS: Needs {metrics.nutritionalNeeds.includes('Iron-Deficiency Anemia') ? 'essential iron, ' : ''}
                {metrics.nutritionalNeeds.includes('Underweight') || metrics.nutritionalNeeds.includes('Wasting') ? 'high-density calories, ' : ''}
                {metrics.nutritionalNeeds.includes('Protein-Energy Malnutrition') ? 'complete protein building-blocks, ' : ''}
                vitamins and mineral bioavailability recovery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
