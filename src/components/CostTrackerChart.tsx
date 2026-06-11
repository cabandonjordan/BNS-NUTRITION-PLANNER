import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SavedMealPlan, Ingredient } from '../types';
import { Coins, Info } from 'lucide-react';

interface CostTrackerChartProps {
  plans: SavedMealPlan[];
  allIngredients: Ingredient[];
}

export default function CostTrackerChart({ plans, allIngredients }: CostTrackerChartProps) {
  const chartData = useMemo(() => {
    // We want to sort plans by date ascending
    const sortedPlans = [...plans].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return sortedPlans.map((plan, idx) => {
      // Calculate total cost for this plan
      let totalCost = 0;
      plan.recipes.forEach(recipe => {
        recipe.ingredientsUsed.forEach(ingName => {
          const found = allIngredients.find(
            (avail) => ingName.toLowerCase().includes(avail.name.toLowerCase()) || avail.name.toLowerCase().includes(ingName.toLowerCase())
          );
          totalCost += (found?.unitCost || 0);
        });
      });
      
      const dateObj = new Date(plan.date);
      const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()} #${idx + 1}`;
      
      return {
        id: plan.id,
        label,
        date: plan.date,
        cost: totalCost,
        recipesCount: plan.recipes.length,
      };
    });
  }, [plans, allIngredients]);

  // Display nothing if no plans
  if (chartData.length === 0) {
    return null;
  }

  const averageCost = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.cost, 0) / chartData.length
    : 0;

  return (
    <div className="bg-white border text-left border-indigo-100 rounded-3xl p-6 shadow-sm mb-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-xl">
            <Coins className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Financial Timeline</h2>
            <p className="text-xs font-semibold text-slate-500">Meal Plan Estimated Cost Trajectory</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Cost / Plan</span>
          <span className="text-lg flex items-center justify-end font-black text-indigo-600 gap-1 mt-0.5">
            <Coins className="w-4 h-4" /> ₱{averageCost.toFixed(0)}
          </span>
        </div>
      </div>
      
      <div className="h-64 mt-4 relative w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₱${value}`}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              dx={-10}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
                      <p className="text-xs font-black text-white uppercase tracking-wider mb-1">
                        {data.label}
                      </p>
                      <p className="text-sm font-black text-indigo-400 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" /> ₱{data.cost.toFixed(0)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        Includes {data.recipesCount} recipes
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="cost" 
              fill="#6366f1" 
              radius={[6, 6, 6, 6]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mt-4 bg-indigo-50 p-3 flex-wrap rounded-xl border border-indigo-100">
        <Info className="w-4 h-4 shrink-0 text-indigo-500" />
        <span className="text-[10px] sm:text-xs font-semibold text-indigo-800 font-sans leading-tight">
          Calculates estimated total cost by tracing ingredients required for all meals against standard unit cost profiles. Useful for managing Barangay meal budget ceilings.
        </span>
      </div>
    </div>
  );
}
