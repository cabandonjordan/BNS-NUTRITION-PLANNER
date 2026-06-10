import React from 'react';
import { motion } from 'motion/react';
import { 
  Baby, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Users, 
  Warehouse, 
  Utensils, 
  MapPin, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'bns' | 'captain') => void;
}

export default function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <div className="font-sans text-slate-800 bg-[#FDFCF0] min-h-screen">
      
      {/* Upper Micro Header */}
      <div className="bg-[#1E8449] text-white text-[10px] md:text-xs py-2 px-6 font-bold flex items-center justify-between border-b border-yellow-600/30">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
          <span>Region VII - Central Visayas • Barangay San Jose Health Center</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse"></span>
          <span>BNS Scholar Program Active</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-16 md:py-24 max-w-7xl mx-auto">
        {/* Abstract organic decoration shapes */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800 shadow-tiny">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Cohesive AI-Fortified Malnutrition Relief</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans leading-none text-slate-900 tracking-tight uppercase">
              AI-Fortified Rural Health & <span className="text-[#27AE60]">Child Growth</span> milestone Planner
            </h1>

            <p className="text-sm md:text-base text-slate-600 font-semibold leading-relaxed max-w-2xl">
              Empowering field Barangay Nutrition Scholars (BNS) to translate emergency pantry dry rations and backyward garden Moringa leaves into optimal daily meal schedules. Ensure your village children reclaim healthy weight percentiles smoothly in 2026.
            </p>

            {/* CTA Login Options Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              
              <button
                type="button"
                onClick={() => onSelectRole('bns')}
                className="bg-[#27AE60] hover:bg-[#219653] text-white rounded-xl py-4 px-8 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg active:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 stroke-[2.5]" />
                <span>BNS Login (Field Scholar)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('captain')}
                className="bg-v-orange hover:bg-v-orange-dark text-white rounded-xl py-4 px-8 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg active:translate-y-0.5 flex items-center justify-center gap-2 border border-orange-500/10"
              >
                <Warehouse className="w-4 h-4 stroke-[2.5]" />
                <span>Barangay Admin Login (Supervisor)</span>
              </button>

            </div>

            {/* Live Counter badge summary */}
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 font-bold">
              <div className="flex -space-x-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">M</span>
                <span className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">J</span>
                <span className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">A</span>
              </div>
              <p>Active Scholars: **Maria, Juan, Lita** monitoring **3 critical Puroks**</p>
            </div>

          </div>

          {/* Graphical Mock Illustration Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-2xl border-4 border-[#E2E8F0] p-6 shadow-xl w-full max-w-sm text-left rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#27AE60]">✓ Live Scholar Diagnostics</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <div className="space-y-4">
                <div className="bg-[#FAF9F5] rounded-xl p-3 border border-slate-150 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold block">CURRENT TODDLER MONITORED</p>
                    <p className="text-xs font-black text-slate-800">Maria Clara S. • 18 Months</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-550 border-b border-slate-50 pb-1">
                    <span>Clinical Weight Status:</span>
                    <span className="text-red-600 font-black uppercase">Severe Underweight</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-550 border-b border-slate-50 pb-1">
                    <span>Active Nutrition Goals:</span>
                    <span className="text-teal-700 font-black">High Protein, Calcium, Iron</span>
                  </div>
                </div>

                <div className="bg-[#E9F7EF] border border-[#ABEBC6] rounded-xl p-3 text-center">
                  <span className="text-[9px] font-extrabold uppercase text-emerald-800 tracking-wider">AI FORTIFICATION RECIPE OUTCOME</span>
                  <p className="text-[11px] font-sans font-black text-slate-800 mt-1 uppercase">Sardine and Moringa Golden Rice Mash</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Multi-User Workflows Section */}
      <section className="bg-white border-y border-slate-200 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-slate-900 uppercase">
              Consolidated Multi-User Barangay Workflow
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold">
              Specifically custom engineered to divide coordination access between community frontline field workers and the village Health Captains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Frontline BNS Card */}
            <div className="border-2 border-[#ABEBC6] rounded-2xl p-6 md:p-8 space-y-5 bg-[#FAF9F5]/40 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#27AE60] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ROLE A: FRONTLINE HEALTH SCHOLAR (BNS)
              </span>

              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                Direct Purok & Sitio Ward-Level Diagnostics
              </h3>

              <ul className="space-y-3">
                {[
                  'Sitio Digitized Logbooks: Centralize name, exact age months, height/weight logs with local storage.',
                  'Precision Growth Curve Tracker: Plots weights directly against WHO reference curves instantly.',
                  'Bilingual Maternal Handouts: Turn complex diagnostic schedules into simple 3-step meal guidelines and zero-cost recipes for Nanay.'
                ].map((item, idx) => {
                  const parts = item.split(':');
                  return (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">{parts[0]}:</strong>
                        {parts[1]}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => onSelectRole('bns')}
                className="w-full bg-[#27AE60] hover:bg-[#219653] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
              >
                Enter BNS field workspace
              </button>
            </div>

            {/* Health Captain Card */}
            <div className="border-2 border-orange-200 rounded-2xl p-6 md:p-8 space-y-5 bg-[#FAF9F5]/40 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-v-orange bg-orange-50 border border-orange-250 px-3 py-1 rounded-full">
                ROLE B: HEALTH CAPTAIN / SUPERVISOR (ADMIN)
              </span>

              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                Aggregated Command & Barangay-Wide Food Allocations
              </h3>

              <ul className="space-y-3">
                {[
                  'Consolidated Malnutrition Matrix: Analyze and view cases categorized by Underweight, Wasting and Stunting.',
                  'Warehouse Stock Inventory: Track sacks of NFA rice, sardines, tuna, fresh eggs, and local crops available at Barangay Hall.',
                  'Community Kitchen Batch Processor: Compile aggregated children charts to design large-scale community feeding soup menus.'
                ].map((item, idx) => {
                  const parts = item.split(':');
                  return (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-v-orange shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">{parts[0]}:</strong>
                        {parts[1]}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => onSelectRole('captain')}
                className="w-full bg-v-orange hover:bg-v-orange-dark text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
              >
                Access Supervisor Control Panel
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* The How It Works Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-sans font-black text-slate-900 uppercase tracking-tight">
            How It Works
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
            Three simple, actionable steps to alleviate child undernutrition in villages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#FAF9F5] border border-slate-200 rounded-2xl p-6 space-y-3 relative text-left">
            <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-[#1E8449] text-white font-mono text-sm font-black flex items-center justify-center shadow-tiny">
              1
            </span>
            <Baby className="w-8 h-8 text-[#27AE60] mb-2" />
            <h4 className="font-sans font-black text-xs text-slate-800 uppercase tracking-wider">Step 1: Check-In & Profile</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              BNS logs in and inputs a local family's current child weight, age months, stunting measurements, and any custom allergy constraints.
            </p>
          </div>

          <div className="bg-[#FAF9F5] border border-slate-200 rounded-2xl p-6 space-y-3 relative text-left">
            <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-v-orange text-white font-mono text-sm font-black flex items-center justify-center shadow-tiny">
              2
            </span>
            <Warehouse className="w-8 h-8 text-v-orange mb-2" />
            <h4 className="font-sans font-black text-xs text-slate-800 uppercase tracking-wider">Step 2: Inventory Match</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Review and select which humanitarian relief packages, canned sardines, fresh farm eggs, and backyard squash are physically available to the family.
            </p>
          </div>

          <div className="bg-[#FAF9F5] border border-slate-200 rounded-2xl p-6 space-y-3 relative text-left">
            <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-blue-600 text-white font-mono text-sm font-black flex items-center justify-center shadow-tiny">
              3
            </span>
            <Utensils className="w-8 h-8 text-blue-605 mb-2" />
            <h4 className="font-sans font-black text-xs text-slate-800 uppercase tracking-wider">Step 3: Direct Action</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Compile 3 instant, zero-cost recipes, print/pdf an editable visual layout handout for the mother, or design communal feeding large vats.
            </p>
          </div>

        </div>
      </section>

      {/* Community Security & Trust Section */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/25">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl md:text-2xl font-sans font-black uppercase tracking-tight text-white">
            🏡 Community Security, Compliance & Trust Protocol
          </h3>

          <p className="text-xs md:text-sm text-slate-300 font-semibold leading-relaxed max-w-2xl mx-auto">
            Our app operates using private local browser storage parameters conforming strictly to national cyber-health regulations. Patient names and health metrics remain fully localized, completely eliminating data leakages over intermittent village 3G/LTE connections.
          </p>

          <div className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase font-black tracking-widest">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Encrypted local logbook compliant</span>
          </div>
        </div>
      </section>

    </div>
  );
}
