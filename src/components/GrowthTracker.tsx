/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  TooltipProps
} from 'recharts';
import { ChildMetrics } from '../types';
import { TrendingUp, Plus, Trash2, Calendar, Scale, Ruler, Award, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface GrowthMilestone {
  id: string;
  childName: string;
  date: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  notes?: string;
}

interface GrowthTrackerProps {
  metrics: ChildMetrics;
  onUpdateMetrics?: (updated: ChildMetrics) => void;
}

// WHO / Philippine National Growth Reference Data (Ages 6 to 60 Months)
const GROWTH_STANDARDS = [
  { ageMonths: 6,  severeUnderweight: 5.7,  moderateUnderweight: 6.4,  medianWeight: 7.9,  excellentWeight: 9.2,  severeStunting: 61.2, moderateStunting: 63.0, medianHeight: 67.0, excellentHeight: 70.0 },
  { ageMonths: 9,  severeUnderweight: 6.4,  moderateUnderweight: 7.1,  medianWeight: 8.9,  excellentWeight: 10.2, severeStunting: 64.0, moderateStunting: 66.2, medianHeight: 70.5, excellentHeight: 73.5 },
  { ageMonths: 12, severeUnderweight: 7.1,  moderateUnderweight: 7.9,  medianWeight: 9.6,  excellentWeight: 11.2, severeStunting: 69.0, moderateStunting: 71.0, medianHeight: 76.0, excellentHeight: 79.0 },
  { ageMonths: 15, severeUnderweight: 7.6,  moderateUnderweight: 8.5,  medianWeight: 10.3, excellentWeight: 12.2, severeStunting: 72.0, moderateStunting: 74.3, medianHeight: 79.2, excellentHeight: 82.2 },
  { ageMonths: 18, severeUnderweight: 8.2,  moderateUnderweight: 9.1,  medianWeight: 11.0, excellentWeight: 13.0, severeStunting: 75.0, moderateStunting: 76.8, medianHeight: 82.3, excellentHeight: 85.5 },
  { ageMonths: 21, severeUnderweight: 8.6,  moderateUnderweight: 9.5,  medianWeight: 11.5, excellentWeight: 13.7, severeStunting: 77.5, moderateStunting: 79.8, medianHeight: 85.1, excellentHeight: 88.5 },
  { ageMonths: 24, severeUnderweight: 9.0,  moderateUnderweight: 10.0, medianWeight: 12.2, excellentWeight: 14.5, severeStunting: 78.5, moderateStunting: 81.0, medianHeight: 87.5, excellentHeight: 91.0 },
  { ageMonths: 30, severeUnderweight: 10.0, moderateUnderweight: 11.2, medianWeight: 13.3, excellentWeight: 15.8, severeStunting: 83.0, moderateStunting: 86.0, medianHeight: 92.1, excellentHeight: 96.1 },
  { ageMonths: 36, severeUnderweight: 10.8, moderateUnderweight: 12.2, medianWeight: 14.3, excellentWeight: 17.0, severeStunting: 87.0, moderateStunting: 90.0, medianHeight: 96.5, excellentHeight: 101.0 },
  { ageMonths: 42, severeUnderweight: 11.8, moderateUnderweight: 13.3, medianWeight: 15.5, excellentWeight: 18.5, severeStunting: 90.0, moderateStunting: 93.5, medianHeight: 100.5, excellentHeight: 105.0 },
  { ageMonths: 48, severeUnderweight: 12.7, moderateUnderweight: 14.3, medianWeight: 16.5, excellentWeight: 20.0, severeStunting: 93.0, moderateStunting: 97.0, medianHeight: 104.0, excellentHeight: 109.0 },
  { ageMonths: 54, severeUnderweight: 13.5, moderateUnderweight: 15.2, medianWeight: 17.6, excellentWeight: 21.2, severeStunting: 96.0, moderateStunting: 100.0, medianHeight: 107.2, excellentHeight: 112.5 },
  { ageMonths: 60, severeUnderweight: 14.2, moderateUnderweight: 16.0, medianWeight: 18.5, excellentWeight: 22.5, severeStunting: 98.0, moderateStunting: 102.5, medianHeight: 110.0, excellentHeight: 115.5 }
];

export default function GrowthTracker({ metrics, onUpdateMetrics }: GrowthTrackerProps) {
  const [history, setHistory] = useState<GrowthMilestone[]>([]);
  const [activeTab, setActiveTab] = useState<'weight' | 'height'>('weight');
  const [chartEngine, setChartEngine] = useState<'recharts' | 'd3'>('recharts');
  const [hoveredD3Point, setHoveredD3Point] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New milestone form state
  const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 10));
  const [formAgeMonths, setFormAgeMonths] = useState<number>(18);
  const [formWeight, setFormWeight] = useState<string>('9.5');
  const [formHeight, setFormHeight] = useState<string>('80.0');
  const [formNotes, setFormNotes] = useState<string>('');

  // Child identifier name to group records
  const childKey = (metrics.name || 'Unnamed Child').trim().toLowerCase();
  const displayName = metrics.name || 'Unnamed Child';

  // Load growth milestones on boot
  useEffect(() => {
    const cached = localStorage.getItem('bns_growth_history_v1');
    if (cached) {
      try {
        setHistory(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse growth milestones', err);
      }
    } else {
      // Seed initial demo logs if nothing exists
      const demoLogs: GrowthMilestone[] = [
        { id: 'dl-1', childName: 'baby juan', date: '2025-12-10', ageMonths: 12, weightKg: 8.2, heightCm: 74.0, notes: 'Initial assessment at center' },
        { id: 'dl-2', childName: 'baby juan', date: '2026-03-10', ageMonths: 15, weightKg: 9.0, heightCm: 77.5, notes: 'Follow-up checks' },
        { id: 'dl-3', childName: 'baby juan', date: '2026-06-10', ageMonths: 18, weightKg: 9.8, heightCm: 81.0, notes: 'Current target metrics' }
      ];
      localStorage.setItem('bns_growth_history_v1', JSON.stringify(demoLogs));
      setHistory(demoLogs);
    }
  }, []);

  // Filter milestones that belong to the current active child name input
  const childMilestones = history.filter(
    item => item.childName.trim().toLowerCase() === childKey
  ).sort((a, b) => a.ageMonths - b.ageMonths);

  // Helper to map current metric's single age bracket to approximate age in months
  const getApproximateAgeMonths = (ageBracket: string): number => {
    switch (ageBracket) {
      case '6-11 months':
        return 9;
      case '12-23 months':
        return 18;
      case '24-35 months':
        return 30;
      case '3-5 years':
      default:
        return 48;
    }
  };

  const currentAgeMonths = getApproximateAgeMonths(metrics.age);

  // Build plotted dataset: combining WHO standards with the child's actual recorded points
  const chartData = GROWTH_STANDARDS.map(std => {
    // Find if the child has a milestone point for this age in months
    // Or we find the closest one if there is any mismatch, but let's map exact matched months,
    // and interpolate or place nearby for visual comparison.
    const milestone = childMilestones.find(m => m.ageMonths === std.ageMonths);
    
    // Check if the current assessment metrics can be displayed at its age point
    const isCurrentAge = std.ageMonths === currentAgeMonths;

    return {
      ...std,
      childWeight: milestone ? milestone.weightKg : (isCurrentAge ? metrics.weightKg : undefined),
      childHeight: milestone ? milestone.heightCm : (isCurrentAge ? metrics.heightCm : undefined),
      isCurrentAssessment: isCurrentAge && !milestone
    };
  });

  // Calculate standard diagnostic assessments based on current weight/height compared to WHO
  const getGrowthStatus = () => {
    const std = GROWTH_STANDARDS.find(s => s.ageMonths === currentAgeMonths) || GROWTH_STANDARDS[4];
    
    // Weight assessment
    let weightStatus = 'Normal';
    let weightColor = 'text-v-green';
    if (metrics.weightKg <= std.severeUnderweight) {
      weightStatus = 'Severe Underweight (High Risk)';
      weightColor = 'text-red-600';
    } else if (metrics.weightKg <= std.moderateUnderweight) {
      weightStatus = 'Moderate Underweight (Mild Risk)';
      weightColor = 'text-orange-600';
    } else if (metrics.weightKg >= std.excellentWeight) {
      weightStatus = 'Excellent Robust Growth';
      weightColor = 'text-emerald-700';
    }

    // Height assessment
    let heightStatus = 'Normal Height';
    let heightColor = 'text-v-green';
    if (metrics.heightCm <= std.severeStunting) {
      heightStatus = 'Severe Stunted Height (High Risk)';
      heightColor = 'text-red-600';
    } else if (metrics.heightCm <= std.moderateStunting) {
      heightStatus = 'Moderate Stunted (Short stature)';
      heightColor = 'text-orange-600';
    }

    return { weightStatus, weightColor, heightStatus, heightColor, std };
  };

  const { weightStatus, weightColor, heightStatus, heightColor, std: currentRef } = getGrowthStatus();

  // Add a new milestone record
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(formWeight);
    const parsedHeight = parseFloat(formHeight);
    
    if (isNaN(parsedWeight) || isNaN(parsedHeight)) return;

    const newMilestone: GrowthMilestone = {
      id: `milestone-${Date.now()}`,
      childName: displayName,
      date: formDate,
      ageMonths: formAgeMonths,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      notes: formNotes.trim() || undefined
    };

    const updatedHistory = [...history, newMilestone];
    localStorage.setItem('bns_growth_history_v1', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    
    // If the entered milestone matches current age, optionally sync back to App assessment Form
    if (formAgeMonths === currentAgeMonths && onUpdateMetrics) {
      onUpdateMetrics({
        ...metrics,
        weightKg: parsedWeight,
        heightCm: parsedHeight
      });
    }

    // Reset Form
    setFormNotes('');
    setShowAddForm(false);
  };

  // Delete a milestone record
  const handleDeleteMilestone = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('bns_growth_history_v1', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  // Safe Tooltip formulation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isWeight = activeTab === 'weight';
      const unit = isWeight ? 'kg' : 'cm';
      const labelText = isWeight ? 'Weight' : 'Height';

      return (
        <div className="bg-white border-2 border-slate-100 p-3 rounded-xl shadow-md font-sans text-xs space-y-1.5 leading-tight">
          <p className="font-black text-slate-800">Age: {label} months</p>
          {payload.map((pld, idx) => {
            const isChild = pld.dataKey === 'childWeight' || pld.dataKey === 'childHeight';
            const valueColor = isChild ? 'text-pink-600 font-extrabold' : 'text-slate-500 font-medium';
            return (
              <div key={idx} className="flex items-center gap-1.5 justify-between">
                <span className="text-slate-400 capitalize">{pld.name}:</span>
                <span className={valueColor}>{pld.value?.toFixed(1)} {unit}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // ----------------------------------------------------
  // D3 COMPONENT ENGINE CONFIGURATION (declarative SVG)
  // ----------------------------------------------------
  const d3Width = 600;
  const d3Height = 280;
  const d3Padding = { top: 25, right: 30, bottom: 40, left: 45 };

  // D3 X Scale: Fixed WHO Age range (6 - 60 Months)
  const d3XScale = d3.scaleLinear()
    .domain([6, 60])
    .range([d3Padding.left, d3Width - d3Padding.right]);

  // Combine milestones with transient/live form weight to plot complete historical + modern tracking
  const rawD3Points: Array<{ id: string; date: string; ageMonths: number; weightKg: number; isLive?: boolean }> = childMilestones.map(m => ({
    id: m.id,
    date: m.date,
    ageMonths: m.ageMonths,
    weightKg: m.weightKg
  }));

  const hasCurrentWeight = metrics.weightKg !== undefined && metrics.weightKg > 0;
  const isCurrentAgeMapped = childMilestones.some(m => m.ageMonths === currentAgeMonths);

  if (hasCurrentWeight && !isCurrentAgeMapped) {
    rawD3Points.push({
      id: 'current-unsaved-live',
      date: 'Live Form',
      ageMonths: currentAgeMonths,
      weightKg: metrics.weightKg,
      isLive: true
    });
  }

  // Sort by months for progressive line pathing
  rawD3Points.sort((a, b) => a.ageMonths - b.ageMonths);

  // Dynamic D3 Y Scale based on actual weights recorded
  const allD3Weights = rawD3Points.map(p => p.weightKg);
  const d3MinWeight = Math.max(0, Math.min(...allD3Weights, 4) - 1.5);
  const d3MaxWeight = Math.max(25, Math.max(...allD3Weights, 20) + 1.5);

  const d3YScale = d3.scaleLinear()
    .domain([d3MinWeight, d3MaxWeight])
    .range([d3Height - d3Padding.bottom, d3Padding.top]);

  // Generators
  const d3LineGenerator = d3.line<any>()
    .x(d => d3XScale(d.ageMonths))
    .y(d => d3YScale(d.weightKg))
    .curve(d3.curveMonotoneX);

  const d3AreaGenerator = d3.area<any>()
    .x(d => d3XScale(d.ageMonths))
    .y0(d3Height - d3Padding.bottom)
    .y1(d => d3YScale(d.weightKg))
    .curve(d3.curveMonotoneX);

  const d3MilestonesPath = rawD3Points.length > 0 ? d3LineGenerator(rawD3Points) : '';
  const d3MilestonesArea = rawD3Points.length > 0 ? d3AreaGenerator(rawD3Points) : '';

  // Standard Median and Underweight WHO Curves
  const d3MedianLineGenerator = d3.line<any>()
    .x(d => d3XScale(d.ageMonths))
    .y(d => d3YScale(d.medianWeight))
    .curve(d3.curveMonotoneX);

  const d3SevereLineGenerator = d3.line<any>()
    .x(d => d3XScale(d.ageMonths))
    .y(d => d3YScale(d.severeUnderweight))
    .curve(d3.curveMonotoneX);

  const d3MedianCurvePath = d3MedianLineGenerator(GROWTH_STANDARDS) || '';
  const d3SevereCurvePath = d3SevereLineGenerator(GROWTH_STANDARDS) || '';

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-6 shadow-xs space-y-6">
      
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
            <TrendingUp className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h2 className="font-sans font-black text-sm uppercase tracking-widest text-[#C2185B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0"></span>
              Growth Curve & Milestone Logs
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Tracking WHO Growth Percentiles for: <strong className="text-slate-700 capitalize">{displayName}</strong></p>
          </div>
        </div>

        {/* Display metric selectors and Engine toggle */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto font-sans">
          {/* Dual Engine Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setChartEngine('recharts')}
              className={`px-2.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                chartEngine === 'recharts'
                  ? 'bg-white text-slate-800 shadow-tiny'
                  : 'text-slate-450 hover:text-slate-705'
              }`}
            >
              Standard WHO
            </button>
            <button
              type="button"
              onClick={() => setChartEngine('d3')}
              className={`px-2.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                chartEngine === 'd3'
                  ? 'bg-white text-slate-800 shadow-tiny'
                  : 'text-slate-450 hover:text-slate-705'
              }`}
            >
              D3 Timeline
            </button>
          </div>

          <span className="hidden sm:inline text-slate-300 font-extralight text-xs">|</span>

          {chartEngine === 'recharts' ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('weight')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'weight'
                    ? 'bg-[#C2185B] text-white shadow-tiny'
                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5 inline mr-1" />
                Weight Curve
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('height')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'height'
                    ? 'bg-[#C2185B] text-white shadow-tiny'
                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}
              >
                <Ruler className="w-3.5 h-3.5 inline mr-1" />
                Height Curve
              </button>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black uppercase tracking-wide flex items-center gap-1 shrink-0">
              <span className="animate-pulse text-emerald-600">●</span>
              <span>D3 Interactive Track</span>
            </div>
          )}
        </div>
      </div>

      {/* Target Status indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weight assessment indicator */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Weight status for {currentAgeMonths} mos (RENI approx)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-black text-slate-800">{metrics.weightKg} kg</span>
              <span className="text-[11px] text-slate-400 font-medium">vs ref {currentRef?.medianWeight} kg</span>
            </div>
            <span className={`text-[11px] font-black flex items-center gap-1 mt-1 ${weightColor}`}>
              ● {weightStatus}
            </span>
          </div>
        </div>

        {/* Height assessment indicator */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-v-blue flex items-center justify-center shrink-0">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Height status for {currentAgeMonths} pos</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-black text-slate-800">{metrics.heightCm} cm</span>
              <span className="text-[11px] text-slate-400 font-medium">vs ref {currentRef?.medianHeight} cm</span>
            </div>
            <span className={`text-[11px] font-black flex items-center gap-1 mt-1 ${heightColor}`}>
              ● {heightStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Card */}
      <div className="bg-[#FAF9F5]/40 rounded-xl border border-slate-200/60 p-4 relative">
        {chartEngine === 'recharts' ? (
          <>
            <div className="h-64 sm:h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 15, right: 15, left: -15, bottom: 15 }}
                >
                  <defs>
                    <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#2ECC71" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="ageMonths" 
                    type="number"
                    domain={[6, 60]}
                    ticks={[6, 12, 18, 24, 30, 36, 42, 48, 54, 60]}
                    fontSize={10} 
                    fontWeight={700}
                    stroke="#94a3b8"
                    tickFormatter={(val) => `${val}m`}
                  />
                  <YAxis 
                    type="number"
                    domain={activeTab === 'weight' ? [4, 25] : [55, 125]}
                    tickCount={7}
                    fontSize={10}
                    fontWeight={700}
                    stroke="#94a3b8"
                    tickFormatter={(val) => `${val}${activeTab === 'weight' ? 'kg' : 'cm'}`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* standard reference curves */}
                  <Line 
                    type="monotone" 
                    dataKey={activeTab === 'weight' ? 'excellentWeight' : 'excellentHeight'} 
                    name="Excellent (+1 SD)" 
                    stroke="#3498DB" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={activeTab === 'weight' ? 'medianWeight' : 'medianHeight'} 
                    name="Healthy Median (WHO)" 
                    stroke="#2ECC71" 
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={activeTab === 'weight' ? 'moderateUnderweight' : 'moderateStunting'} 
                    name="Mild Malnourishment Limit (-2 SD)" 
                    stroke="#E67E22" 
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={activeTab === 'weight' ? 'severeUnderweight' : 'severeStunting'} 
                    name="Severe Malnourishment Limit (-3 SD)" 
                    stroke="#E74C4C" 
                    strokeWidth={2}
                    dot={false}
                  />

                  {/* The child's growth curve points */}
                  <Line
                    type="monotone"
                    dataKey={activeTab === 'weight' ? 'childWeight' : 'childHeight'}
                    name={`${displayName}'s Milestones`}
                    stroke="#C2185B"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#C2185B', stroke: '#FFF', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                    connectNulls
                  />

                  {/* Live marker representing active unsaved assessment form values */}
                  {metrics.weightKg && metrics.heightCm && (
                    <ReferenceDot
                      x={currentAgeMonths}
                      y={activeTab === 'weight' ? metrics.weightKg : metrics.heightCm}
                      r={6}
                      fill="#FFF"
                      stroke="#E67E22"
                      strokeWidth={3}
                      name="Current Assessment Point"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Custom, responsive, beautifully wrapped HTML Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 pb-3 pt-2 justify-center text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-100">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3498DB] shrink-0" />
                <span>Excellent (+1 SD)</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] shrink-0" />
                <span>Healthy Median (WHO)</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E67E22] shrink-0" />
                <span>Mild Malnourishment (-2 SD)</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E74C4C] shrink-0" />
                <span>Severe Malnourishment (-3 SD)</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2185B] shrink-0" />
                <span className="capitalize">{displayName}'s Milestones</span>
              </div>
            </div>

            {/* Legend/Annotation note */}
            <div className="flex items-start sm:items-center gap-2 mt-3 text-[10px] text-slate-500 bg-white border border-slate-100 p-2.5 rounded-lg">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E67E22] bg-white flex items-center justify-center text-[8px] font-bold text-[#E67E22] shrink-0 mt-0.5 sm:mt-0">●</span>
              <span className="leading-relaxed">
                The <strong>white dot with orange ring</strong> highlights your live unsaved Assessment form figures ({activeTab === 'weight' ? `${metrics.weightKg} kg` : `${metrics.heightCm} cm`} at {currentAgeMonths} months).
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-3">
            {rawD3Points.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold space-y-2">
                <span>📊 No logged entries found for {displayName} to compile D3 timeline.</span>
                <span className="text-[10px] text-slate-400">Click "Log Milestone record" below to populate indices!</span>
              </div>
            ) : (
              <>
                <div className="w-full h-auto overflow-hidden">
                  <svg 
                    viewBox={`0 0 ${d3Width} ${d3Height}`} 
                    className="w-full h-auto overflow-visible select-none"
                    style={{ maxHeight: '280px' }}
                  >
                    <defs>
                      <linearGradient id="d3AreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C2185B" stopOpacity={0.16}/>
                        <stop offset="100%" stopColor="#C2185B" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>

                    {/* Y Gridlines and axis labels */}
                    <g id="y-gridlines">
                      {d3YScale.ticks(6).map((val: number, idx: number) => {
                        const y = d3YScale(val);
                        return (
                          <g key={`y-grid-${idx}`}>
                            <line 
                              x1={d3Padding.left} 
                              y1={y} 
                              x2={d3Width - d3Padding.right} 
                              y2={y} 
                              stroke="#e2e8f0" 
                              strokeWidth={1} 
                              strokeDasharray="2 3" 
                            />
                            <text 
                              x={d3Padding.left - 8} 
                              y={y + 3} 
                              textAnchor="end" 
                              fontSize={9} 
                              fontWeight={800} 
                              fill="#94a3b8"
                              className="font-mono"
                            >
                              {val.toFixed(0)}kg
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    {/* X Gridlines and axis labels */}
                    <g id="x-gridlines">
                      {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map((val, idx) => {
                        const x = d3XScale(val);
                        return (
                          <g key={`x-grid-${idx}`}>
                            <line 
                              x1={x} 
                              y1={d3Padding.top} 
                              x2={x} 
                              y2={d3Height - d3Padding.bottom} 
                              stroke="#e2e8f0" 
                              strokeWidth={1} 
                              strokeDasharray="2 3" 
                            />
                            <text 
                              x={x} 
                              y={d3Height - d3Padding.bottom + 14} 
                              textAnchor="middle" 
                              fontSize={9} 
                              fontWeight={850} 
                              fill="#94a3b8"
                              className="font-mono"
                            >
                              {val}m
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    {/* WHO Reference standard curves plotted in background */}
                    <g id="std-reference-curves" strokeOpacity={0.35}>
                      {/* WHO Median standard path */}
                      <path 
                        d={d3MedianCurvePath} 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth={1.5} 
                        strokeDasharray="4 3" 
                      />
                      {/* WHO Severe Undernutrition standard path */}
                      <path 
                        d={d3SevereCurvePath} 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth={1.5} 
                        strokeDasharray="4 3" 
                      />
                    </g>

                    {/* Child's D3 Area Fill */}
                    {d3MilestonesArea && (
                      <path 
                        d={d3MilestonesArea} 
                        fill="url(#d3AreaGrad)" 
                      />
                    )}

                    {/* Child's D3 Line Progression */}
                    {d3MilestonesPath && (
                      <path 
                        d={d3MilestonesPath} 
                        fill="none" 
                        stroke="#C2185B" 
                        strokeWidth={3} 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    )}

                    {/* Interactive Alignment vertical line */}
                    {hoveredD3Point && (
                      <line 
                        x1={d3XScale(hoveredD3Point.ageMonths)} 
                        y1={d3Padding.top} 
                        x2={d3XScale(hoveredD3Point.ageMonths)} 
                        y2={d3Height - d3Padding.bottom} 
                        stroke="#C2185B" 
                        strokeWidth={1.2} 
                        strokeDasharray="4 4" 
                        strokeOpacity={0.6} 
                      />
                    )}

                    {/* Milestones circles checkpoints */}
                    <g id="milestone-interactive-dots">
                      {rawD3Points.map((pt, idx) => {
                        const cx = d3XScale(pt.ageMonths);
                        const cy = d3YScale(pt.weightKg);
                        const isLiveMarker = pt.isLive;
                        return (
                          <g key={`pt-${idx}`}>
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r={isLiveMarker ? 7 : 5} 
                              fill={isLiveMarker ? '#ffffff' : '#C2185B'} 
                              stroke={isLiveMarker ? '#e67e22' : '#ffffff'} 
                              strokeWidth={isLiveMarker ? 3 : 2} 
                              className="cursor-pointer transition-all hover:scale-130"
                              onMouseEnter={() => setHoveredD3Point(pt)}
                              onMouseLeave={() => setHoveredD3Point(null)}
                            />
                          </g>
                        );
                      })}
                    </g>

                    {/* Interactive D3 Tooltip overlay panel drawn strictly inside SVG boundary */}
                    {hoveredD3Point && (
                      <g id="tooltip-group" style={{ pointerEvents: 'none' }}>
                        {(() => {
                          const tooltipXOffset = d3XScale(hoveredD3Point.ageMonths) > d3Width / 2 ? -155 : 15;
                          const tX = d3XScale(hoveredD3Point.ageMonths) + tooltipXOffset;
                          const tY = Math.min(d3Height - 85, Math.max(15, d3YScale(hoveredD3Point.weightKg) - 30));
                          const isLive = hoveredD3Point.isLive;
                          return (
                            <>
                              <rect 
                                x={tX} 
                                y={tY} 
                                width={140} 
                                height={55} 
                                rx={8} 
                                fill="#2d3748" 
                                opacity={0.96} 
                              />
                              <text 
                                x={tX + 10} 
                                y={tY + 18} 
                                fontSize={10} 
                                fontWeight={900} 
                                fill="#ffffff" 
                                fontFamily="sans-serif"
                              >
                                {isLive ? '🔴 LIVE FORM POINT' : '📅 MILESTONE LOG'}
                              </text>
                              <text 
                                x={tX + 10} 
                                y={tY + 34} 
                                fontSize={10} 
                                fontWeight={800} 
                                fill="#cbd5e1" 
                                fontFamily="sans-serif"
                              >
                                Age: {hoveredD3Point.ageMonths} mos
                              </text>
                              <text 
                                x={tX + 10} 
                                y={tY + 46} 
                                fontSize={10} 
                                fontWeight={900} 
                                fill="#f472b6" 
                                fontFamily="sans-serif"
                              >
                                Weight: {hoveredD3Point.weightKg.toFixed(1)} kg
                              </text>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </svg>
                </div>

                {/* D3 Styled Footer Legend */}
                <div className="flex flex-wrap gap-y-2 gap-x-4 justify-center border-t border-slate-100 pt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-[#10b981] shrink-0" />
                    <span>WHO Median Ref</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-[#ef4444] shrink-0" />
                    <span>Severe limit (-3 SD)</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2185B] shrink-0" />
                    <span className="capitalize">{displayName}'s Path</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#e67e22] bg-white shrink-0" />
                    <span>Live Input</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 bg-white border border-slate-100 p-2.5 rounded-lg text-center font-semibold">
                  💡 <em>Hover point bubbles to reveal diagnostic weight data. Powered by pure D3 scales.</em>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual Milestones Listing & Entry Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-black tracking-wider text-[#C2185B]">Milestone Log Registry</span>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[10px] font-black uppercase text-[#C2185B] bg-pink-50 hover:bg-pink-100/75 border border-pink-100 rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close panel' : 'Log Milestone record'}</span>
          </button>
        </div>

        {/* Inline Add Record Panel */}
        {showAddForm && (
          <form onSubmit={handleAddMilestone} className="p-4 bg-pink-50/50 border border-pink-100 rounded-xl space-y-3">
            <h4 className="text-xs font-black text-pink-900 uppercase">Record New Health Milestone</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 capitalize mb-1">Assessment Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg focus:outline-none focus:border-pink-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 capitalize mb-1">Age (Months)</label>
                <select
                  value={formAgeMonths}
                  onChange={(e) => setFormAgeMonths(Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg focus:outline-none focus:border-pink-300"
                >
                  <option value={6}>6 Months</option>
                  <option value={9}>9 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={15}>15 Months</option>
                  <option value={18}>18 Months</option>
                  <option value={21}>21 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={30}>30 Months</option>
                  <option value={36}>36 Months</option>
                  <option value={42}>42 Months</option>
                  <option value={48}>48 Months</option>
                  <option value={54}>54 Months</option>
                  <option value={60}>60 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 capitalize mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="40"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg focus:outline-none focus:border-pink-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 capitalize mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="40"
                  max="140"
                  value={formHeight}
                  onChange={(e) => setFormHeight(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg focus:outline-none focus:border-pink-300 font-mono"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Diagnostic check-up details or notes (optional)"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-pink-300"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-[#C2185B] hover:bg-pink-700 text-white font-black text-[10px] uppercase tracking-wider py-2 px-4 rounded-lg cursor-pointer"
              >
                Log Entry
              </button>
            </div>
          </form>
        )}

        {/* Milestones list table */}
        <div className="max-h-44 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50">
          {childMilestones.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 font-medium">
              No historical logged entries yet for <strong className="capitalize">{displayName}</strong>.
              <button
                type="button"
                onClick={() => {
                  // Pre-fill with matching age value to encourage quick starting log
                  setFormAgeMonths(currentAgeMonths);
                  setFormWeight(metrics.weightKg.toString());
                  setFormHeight(metrics.heightCm.toString());
                  setShowAddForm(true);
                }}
                className="text-[#C2185B] font-bold underline hover:no-underline ml-1 cursor-pointer inline"
              >
                Log current status as baseline
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {childMilestones.map((m) => (
                <div key={m.id} className="p-3 hover:bg-white flex items-center justify-between text-xs transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <div className="font-bold text-slate-700">
                        {m.ageMonths} Months Milestone
                        <span className="text-[10px] text-slate-400 font-medium ml-2">{m.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Weight: <strong className="text-slate-700 font-sans">{m.weightKg} kg</strong> • Height: <strong className="text-slate-700 font-sans">{m.heightCm} cm</strong>
                        {m.notes && <span className="italic block text-slate-450 mt-0.5">"{m.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="p-1.5 text-slate-450 hover:text-red-650 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                    title="Delete milestone entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
