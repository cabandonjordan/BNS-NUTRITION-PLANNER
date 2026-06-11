/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ingredient } from '../types';
import { Package, Leaf, Plus, Minus, PlusCircle, Trash, HelpCircle } from 'lucide-react';

interface IngredientSelectorProps {
  ingredients: Ingredient[];
  onChange: (updated: Ingredient[]) => void;
}

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Relief Packs
  { id: 'nfa_rice', name: 'NFA Rice', category: 'relief', unit: 'kg', count: 1, selected: true, unitCost: 45 },
  { id: 'sardines', name: 'Canned Sardines (Tomato Sauce)', category: 'relief', unit: 'can(s)', count: 2, selected: true, unitCost: 20 },
  { id: 'canned_tuna', name: 'Canned Tuna (Oil / Flakes)', category: 'relief', unit: 'can(s)', count: 1, selected: false, unitCost: 35 },
  { id: 'corned_beef', name: 'Canned Corned Beef', category: 'relief', unit: 'can(s)', count: 1, selected: false, unitCost: 50 },
  { id: 'instant_noodles', name: 'Instant Noodles (Chicken/Beef)', category: 'relief', unit: 'pack(s)', count: 2, selected: false, unitCost: 12 },
  { id: 'powdered_milk', name: 'Powdered Milk (e.g. Bear Brand)', category: 'relief', unit: 'pack(s)', count: 1, selected: false, unitCost: 70 },
  
  // Local Backyard/Garden Harvest
  { id: 'malunggay', name: 'Malunggay Leaves (Moringa)', category: 'local', unit: 'bundle(s)', count: 1, selected: true, unitCost: 5 },
  { id: 'kalabasa', name: 'Squash (Kalabasa)', category: 'local', unit: 'slice/whole', count: 1, selected: true, unitCost: 25 },
  { id: 'egg', name: 'Fresh Chicken Egg', category: 'local', unit: 'pcs', count: 2, selected: true, unitCost: 8 },
  { id: 'kamote', name: 'Kamote (Sweet Potato)', category: 'local', unit: 'pcs', count: 2, selected: false, unitCost: 15 },
  { id: 'kamote_tops', name: 'Kamote Tops (Leaves)', category: 'local', unit: 'bundle(s)', count: 1, selected: false, unitCost: 10 },
  { id: 'soy_sauce', name: 'Toyo or Patis (Basic Seasoning)', category: 'pantry', unit: 'small bottle', count: 1, selected: false, unitCost: 15 },
];

export default function IngredientSelector({ ingredients, onChange }: IngredientSelectorProps) {
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newCategory, setNewCategory] = useState<'relief' | 'local' | 'pantry'>('local');

  const handleToggle = (id: string) => {
    const updated = ingredients.map((ing) => {
      if (ing.id === id) {
        return { ...ing, selected: !ing.selected };
      }
      return ing;
    });
    onChange(updated);
  };

  const handleAdjustCount = (id: string, delta: number) => {
    const updated = ingredients.map((ing) => {
      if (ing.id === id) {
        const newCount = Math.max(1, ing.count + delta);
        return { ...ing, count: newCount };
      }
      return ing;
    });
    onChange(updated);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    const uniqueId = 'custom_' + Date.now();
    const newIng: Ingredient = {
      id: uniqueId,
      name: newIngredientName.trim(),
      category: newCategory,
      unit: newCategory === 'relief' ? 'can/pack' : 'pcs/cup',
      count: 1,
      selected: true,
    };

    onChange([...ingredients, newIng]);
    setNewIngredientName('');
  };

  const handleDeleteCustom = (id: string) => {
    const updated = ingredients.filter((ing) => ing.id !== id);
    onChange(updated);
  };

  const reliefItems = ingredients.filter((ing) => ing.category === 'relief');
  const localItems = ingredients.filter((ing) => ing.category === 'local');
  const pantryItems = ingredients.filter((ing) => ing.category === 'pantry');

  const renderIngredientCard = (ing: Ingredient) => {
    return (
      <div
        key={ing.id}
        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
          ing.selected
            ? 'border-[#ABEBC6] bg-[#E9F7EF] shadow-xs'
            : 'border-slate-150 bg-white hover:bg-[#F4F7F6]'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={ing.selected}
            onChange={() => handleToggle(ing.id)}
            className="rounded-sm border-slate-300 text-[#27AE60] focus:ring-[#27AE60] h-4.5 w-4.5 cursor-pointer accent-[#27AE60]"
          />
          <div className="min-w-0">
            <span className={`text-xs font-black uppercase tracking-tight block truncate ${ing.selected ? 'text-[#1E8449]' : 'text-slate-600'}`}>
              {ing.name}
            </span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">
              {ing.unit} available
            </span>
          </div>
        </div>

        {ing.selected ? (
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border-2 border-[#E2E8F0] shadow-tiny">
            <button
              type="button"
              onClick={() => handleAdjustCount(ing.id, -1)}
              className="p-1 hover:bg-[#FEF9E7] text-slate-500 rounded-sm hover:text-v-orange transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-black font-mono text-v-dark min-w-5 text-center">
              {ing.count}
            </span>
            <button
              type="button"
              onClick={() => handleAdjustCount(ing.id, 1)}
              className="p-1 hover:bg-[#E9F7EF] text-slate-500 rounded-sm hover:text-v-green transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : ing.id.startsWith('custom_') ? (
          <button
            type="button"
            onClick={() => handleDeleteCustom(ing.id)}
            className="p-1.5 text-slate-300 hover:text-v-orange rounded-lg hover:bg-[#FDF2E9] transition-colors"
            title="Delete custom ingredient"
          >
            <Trash className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dynamic selection card */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <div className="p-2.5 bg-[#E8F8F5] text-v-green rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-black text-sm uppercase tracking-widest text-[#27AE60] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-v-orange"></span>
              Available Stock Inventory
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Toggle specific items currently present in the family home
            </p>
          </div>
        </div>

        {/* Section 1: Relief goods */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-v-green mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>Relief Goods / NFA Packets</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reliefItems.map(renderIngredientCard)}
          </div>
        </div>

        {/* Section 2: Backyard/Local crops */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-v-green mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>Backyard Harvest & Market Add-ons</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {localItems.map(renderIngredientCard)}
          </div>
        </div>

        {/* Section 3: Extra Kitchen Pantry ingredients */}
        {pantryItems.length > 0 && (
          <div className="mb-6 border-t border-gray-100 pt-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#BDB52F] mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Available Seasonings / Other Kitchen Spices</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pantryItems.map(renderIngredientCard)}
            </div>
          </div>
        )}

        {/* Form to inject a custom item */}
        <div className="border-t border-gray-100 pt-5 mt-6">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
            Add Other Item (Market purchases / Local garden harvest)
          </h4>
          <form onSubmit={handleAddCustom} className="flex gap-2.5">
            <input
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder="e.g. Saging na Saba, Miki Noodles, Munggo..."
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 px-4 text-sm text-v-dark placeholder:text-slate-400 focus:outline-hidden focus:ring-4 focus:ring-[#27AE60]/10 focus:border-[#27AE60] transition-all font-sans font-semibold"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 px-3 text-xs text-slate-600 font-bold focus:outline-hidden focus:ring-4 focus:ring-[#27AE60]/10 cursor-pointer"
            >
              <option value="relief">Relief Stock</option>
              <option value="local">Backyard</option>
              <option value="pantry">Seasoning</option>
            </select>
            <button
              type="submit"
              className="bg-[#27AE60] hover:bg-[#1E8449] text-white rounded-xl py-2.5 px-4 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1 shadow-xs hover:shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
