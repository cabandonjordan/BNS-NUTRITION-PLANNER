/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useAnimation, PanInfo } from 'motion/react';
import { SavedMealPlan } from '../types';
import { FileText, Calendar, Trash2, ArrowUpRight, Award, ChevronRight, AlertCircle } from 'lucide-react';

interface SavedPlansListProps {
  plans: SavedMealPlan[];
  onSelect: (plan: SavedMealPlan) => void;
  onDelete: (id: string) => void;
  onPurgeOld: () => void;
  selectedPlanId: string | null;
  privacyMode: boolean;
}

function SwipeablePlanItem({ 
  plan, 
  isSelected, 
  displayName, 
  privacyMode, 
  onSelect, 
  onDelete 
}: { 
  plan: SavedMealPlan, 
  isSelected: boolean, 
  displayName: string, 
  privacyMode: boolean, 
  onSelect: (plan: SavedMealPlan) => void, 
  onDelete: (id: string) => void 
}) {
  const controls = useAnimation();

  const handleDragEnd = (event: any, info: PanInfo) => {
    // If swiped far enough to the left, delete
    if (info.offset.x < -80) {
      onDelete(plan.id);
    } else {
      // Snap back to original position
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 transition-all ${isSelected ? 'border-v-green' : 'border-slate-100'}`}>
      {/* Background Delete Button (revealed on swipe) */}
      <div className="absolute inset-y-0 right-0 w-24 bg-red-50 flex items-center justify-end pr-5">
        <div className="flex flex-col items-center text-red-600 gap-1">
          <Trash2 className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-widest">Delete</span>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        onClick={() => onSelect(plan)}
        style={{ touchAction: 'pan-y' }} // Allows native vertical scrolling
        className={`relative flex items-center justify-between p-3.5 cursor-pointer bg-white transition-colors ${
          isSelected ? 'bg-[#E9F7EF]' : 'hover:bg-[#F4F7F6]'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-v-green text-white' : 'bg-slate-100 text-slate-500'}`}>
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 pointer-events-none">
            <h4 className="text-xs font-black text-v-dark uppercase tracking-tight truncate flex items-center gap-2">
              {displayName}
              {privacyMode && <span className="bg-slate-700 text-white text-[8px] px-1 rounded">MASKED</span>}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 font-semibold">
              <span className="bg-[#FEF9E7] text-[#9A7D0A] px-1.5 py-0.2 rounded font-black uppercase tracking-wide">{plan.childMetrics.age}</span>
              <span>•</span>
              <div className="flex items-center gap-0.5">
                <Calendar className="w-2.5 h-2.5" />
                <span>{new Date(plan.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {/* Desktop Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plan.id);
            }}
            className="hidden sm:block p-1.5 text-slate-300 hover:text-v-orange hover:bg-orange-50 rounded-lg transition-all"
            title="Delete case record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          {/* Mobile Swipe Hint */}
          <div className="sm:hidden flex flex-col items-center text-slate-300 mr-1">
            <span className="text-[10px] leading-none mb-0.5">&larr;</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">Swipe</span>
          </div>

          <ChevronRight className={`w-4 h-4 hidden sm:block ${isSelected ? 'text-v-green' : 'text-slate-400'}`} />
        </div>
      </motion.div>
    </div>
  );
}

export default function SavedPlansList({ plans, onSelect, onDelete, onPurgeOld, selectedPlanId, privacyMode }: SavedPlansListProps) {
  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 text-center text-slate-400">
        <FileText className="w-8 h-8 text-[#BDC3C7] mx-auto mb-2" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">No saved plans yet</p>
        <p className="text-[11px] text-slate-400 mt-1 font-medium">Generated plans will appear here for record-keeping</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-3">
        <div>
          <h2 className="font-sans font-black text-sm uppercase tracking-widest text-[#27AE60] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-v-orange"></span>
            Case Logs & History
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">Quick access to previously drafted child plans</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={onPurgeOld}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-[9px] font-black uppercase tracking-wider"
            title="PhilDPA: Purge records older than 30 days"
          >
            <AlertCircle className="w-3 h-3" />
            Purge &gt; 30d
          </button>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#E8F8F5] text-v-green rounded-full">
            {plans.length} Records
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 overflow-x-hidden">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          
          let displayName = plan.childMetrics.name || 'Case Client';
          if (privacyMode && plan.childMetrics.name) {
            const parts = plan.childMetrics.name.trim().split(' ');
            if (parts.length > 1) {
              displayName = parts[0] + ' ' + parts[parts.length - 1].charAt(0) + '****';
            } else {
              displayName = parts[0].charAt(0) + '****';
            }
          }

          return (
            <SwipeablePlanItem
              key={plan.id}
              plan={plan}
              isSelected={isSelected}
              displayName={displayName}
              privacyMode={privacyMode}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}
