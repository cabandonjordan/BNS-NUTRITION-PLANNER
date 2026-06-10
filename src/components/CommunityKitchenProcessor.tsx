import React, { useState } from 'react';
import { 
  Users, 
  Warehouse, 
  Cpu, 
  CheckCircle, 
  HelpCircle, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  Loader2,
  FileText,
  UtensilsCrossed,
  Download
} from 'lucide-react';
import { CommunalChildCase, CommunalBatchRecipe } from '../types';

interface CommunityKitchenProcessorProps {
  isDemoMode: boolean;
  onAlert: (msg: string) => void;
}

const DEFAULT_CASES: CommunalChildCase[] = [
  {
    id: 'case_1',
    name: 'Maria Clara Santos',
    bnsWorker: 'BNS Maria',
    ageMonths: 18,
    condition: 'Underweight',
    householdSupplies: ['NFA Rice', 'Canned Sardines']
  },
  {
    id: 'case_2',
    name: 'Juan dela Cruz Jr.',
    bnsWorker: 'BNS Maria',
    ageMonths: 24,
    condition: 'Wasting',
    householdSupplies: ['NFA Rice', 'Fresh Chicken Egg']
  },
  {
    id: 'case_3',
    name: 'Baby Amihan Dizon',
    bnsWorker: 'BNS Juan',
    ageMonths: 12,
    condition: 'Stunting',
    householdSupplies: ['NFA Rice', 'Squash (Kalabasa)']
  }
];

const parseNumberValue = (qtyString: string): number => {
  const match = qtyString.match(/^([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
};

const parseUnit = (qtyString: string): string => {
  return qtyString.replace(/^[\d.\s]+/, '').trim() || 'units';
};

const DEFAULT_STOCKS = [
  { id: 'stk_1', name: 'NFA Rice', quantity: '150 kg', category: 'relief', threshold: 50 },
  { id: 'stk_2', name: 'Canned Sardines (Tomato Sauce)', quantity: '180 cans', category: 'relief', threshold: 65 },
  { id: 'stk_3', name: 'Canned Tuna in Oil', quantity: '120 cans', category: 'pantry', threshold: 45 },
  { id: 'stk_4', name: 'Fresh Chicken Eggs', quantity: '160 pieces', category: 'pantry', threshold: 50 },
  { id: 'stk_5', name: 'Squash (Kalabasa)', quantity: '8 pieces', category: 'local', threshold: 15 },
  { id: 'stk_6', name: 'Malunggay Leaves (Moringa)', quantity: '5 bundles', category: 'local', threshold: 12 }
];

export default function CommunityKitchenProcessor({ isDemoMode, onAlert }: CommunityKitchenProcessorProps) {
  const [cases, setCases] = useState<CommunalChildCase[]>(DEFAULT_CASES);
  const [stocks, setStocks] = useState(DEFAULT_STOCKS);
  const [loading, setLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState<CommunalBatchRecipe | null>(null);

  // Interactive AI inline edits state
  const [editedGuide, setEditedGuide] = useState<string[]>([]);
  const [regeneratingStepIdx, setRegeneratingStepIdx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
    stepIdx: number;
  }>({ visible: false, x: 0, y: 0, text: '', stepIdx: -1 });

  // Sync edited instructions state whenever compile results are refreshed
  React.useEffect(() => {
    if (recipeResult) {
      setEditedGuide(recipeResult.batchPreparationGuide);
    } else {
      setEditedGuide([]);
    }
  }, [recipeResult]);

  // Click-outside listener to hide floating prompt tooltip
  React.useEffect(() => {
    const handleMouseAway = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.ai-quick-edit-tooltip')) {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener('mousedown', handleMouseAway);
    return () => document.removeEventListener('mousedown', handleMouseAway);
  }, []);

  // New Case Input Form state
  const [newName, setNewName] = useState('');
  const [newBNS, setNewBNS] = useState('BNS Maria');
  const [newAge, setNewAge] = useState(18);
  const [newCondition, setNewCondition] = useState<'Underweight' | 'Wasting' | 'Stunting' | 'Healthy'>('Underweight');
  const [newSupplies, setNewSupplies] = useState<string[]>(['NFA Rice']);

  // New Stock Input Form state
  const [newStockName, setNewStockName] = useState('');
  const [newStockQty, setNewStockQty] = useState('');
  const [newStockCat, setNewStockCat] = useState<'relief' | 'pantry' | 'local'>('relief');
  const [newStockThreshold, setNewStockThreshold] = useState<number>(15);

  // Handle adding child case
  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      onAlert('Please specify a child name/alias.');
      return;
    }
    const newCaseItem: CommunalChildCase = {
      id: 'case_' + Date.now(),
      name: newName,
      bnsWorker: newBNS,
      ageMonths: Number(newAge),
      condition: newCondition,
      householdSupplies: [...newSupplies]
    };
    setCases([...cases, newCaseItem]);
    setNewName('');
    setNewSupplies(['NFA Rice']);
  };

  // Remove child case
  const handleRemoveCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
  };

  // Toggle ingredient supply for child's family
  const toggleFamilySupply = (supply: string) => {
    if (newSupplies.includes(supply)) {
      setNewSupplies(newSupplies.filter(s => s !== supply));
    } else {
      setNewSupplies([...newSupplies, supply]);
    }
  };

  // Handle adding stocks
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockName.trim() || !newStockQty.trim()) {
      onAlert('Please specify both stock ingredient name and quantity.');
      return;
    }
    const newStk = {
      id: 'stk_' + Date.now(),
      name: newStockName,
      quantity: newStockQty,
      category: newStockCat,
      threshold: Number(newStockThreshold) || 15
    };
    setStocks([...stocks, newStk]);
    setNewStockName('');
    setNewStockQty('');
    setNewStockThreshold(15);
  };

  // Remove stock
  const handleRemoveStock = (id: string) => {
    setStocks(stocks.filter(s => s.id !== id));
  };

  // Execute processing logic
  const handleComposeCommunalPlan = async () => {
    if (cases.length === 0) {
      onAlert('Cannot process empty case sheets! Provide at least 1 child record.');
      return;
    }

    setLoading(true);
    setRecipeResult(null);

    if (isDemoMode) {
      // Simulate real-world public health analysis report
      setTimeout(() => {
        // Deterministic analysis report calculation based on case sheet constraints
        const total = cases.length;
        const underweightCount = cases.filter(c => c.condition === 'Underweight').length;
        const wastingCount = cases.filter(c => c.condition === 'Wasting').length;
        const stuntingCount = cases.filter(c => c.condition === 'Stunting').length;

        const uPct = Math.round((underweightCount / total) * 100);
        const wPct = Math.round((wastingCount / total) * 100);
        const sPct = Math.round((stuntingCount / total) * 100);

        const summary = `### Collective Case Sheet Diagnostic Analysis
Report compiled for ${total} children monitored across Puroks.

1. **High-Risk Clusters & Malnutrition Distribution:**
   - **${uPct}% of children** are flagged as **Underweight**. These toddlers require urgent carbohydrate and essential fat supplementation.
   - **${wPct}% of cases** manifest severe **Wasting** (low weight-for-height). This is a critical indicator of emergency protein deficits.
   - **${sPct}% display chronic Stunting**. These kids require high bioavailability of calcium, zinc, and iron to foster core linear skeletal height expansion.

2. **Resource Allocation Advice (This Week's Local Priorities):**
   - Critical domestic dry supply shortages identified in family larders! Most households lack protein. It is highly advised that the Barangay Captain priority-distribute **Canned Tuna** and **Fresh Eggs** this week to Maria's clusters.
   - For stunting prevention, instruct Juan's scholars to distribute fresh, yard-grown **Malunggay (Moringa)** and vitamin-rich **Squash** to provide crucial immunological support.

3. **Strategic Public Health Action:**
   - We recommend cooking the communal dish below in a double-boiler communal stove to feed all children simultaneously in a safe, controlled community kitchen environment.`;

        const demoRecipe: CommunalBatchRecipe = {
          title: 'Arroz Caldo de Salubong (Communal Fortified Rice & Egg Soup)',
          totalServings: Math.round(total * 1.5),
          aggregatedNeedsSummary: summary,
          scaledIngredients: [
            { name: 'NFA Rice (Energy Core)', quantity: `${total * 0.25} kg`, category: 'relief' },
            { name: 'Canned Sardines (Solid Proteins & Lipids)', quantity: `${Math.round(total * 1.2)} cans`, category: 'relief' },
            { name: 'Fresh Chicken Eggs (Essential Growth Amino Acids)', quantity: `${Math.round(total * 1)} pieces`, category: 'pantry' },
            { name: 'Mashed Squash / Kalabasa (Beta-carotene for vision & immunity)', quantity: `${Math.round(total * 0.3)} whole veggies`, category: 'local' },
            { name: 'Washed Malunggay Leaves (Iron powerhouse)', quantity: `${Math.round(total * 0.55)} bundles`, category: 'local' }
          ],
          batchPreparationGuide: [
            'In a massive 15-liter community stockpot, boil clean filtered water over steady high flame.',
            'Stir in the scaled NFA Rice continuously for 20 minutes until grains swell open to form a smooth, calorie-rich porridge (lugaw).',
            'Mash the whole ripe Squash into a smooth paste and slowly incorporate into the simmering porridge to distribute the protective Vitamin A uniformly.',
            'Flake the Canned Sardines in their rich tomato sauce into the pot, ensuring calcium-dense bone softened matrices dissolve completely into the soup.',
            'Crack the Fresh Chicken Eggs directly into the hot boiling broth, whisking aggressively to distribute cooked ribbon proteins consistently throughout all child servings.',
            'Sprinkle fresh Moringa / Malunggay leaves in the last 2 minutes. Extinguish direct heat, cover, and rest before serving the children.'
          ],
          dietarySuitability: `Highly suitable communal formulation! High in calorie coverage (NFA Rice), double protein reinforcements (eggs + sardines), and high absorption bone iron/calcium indicators from Malunggay. Excellent for kids with severe underweight, wasting, or chronic physical height delays.`
        };

        setRecipeResult(demoRecipe);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const resp = await fetch('/api/generate-communal-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases, warehouseStock: stocks })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Server error compositing communal action plan.');
      }
      setRecipeResult(data);
    } catch (err: any) {
      console.error(err);
      onAlert('Failed calling AI model. Operating in BNS Reference local database mode instead.');
      // Auto-fallback
      const total = cases.length;
      const summary = `### LOCAL ACTION PLAN (EMERGENCY REFERENCE REPORT)
Operating in standard reference mode. Registered ${total} children.

1. **High-Risk Clusters detected:** Common deficits in child weight and essential micronutrients.
2. **Resource Allocation:** Priority distribution of iron-dense relief supplies (Sardines, Tuna) to help households meet RENI standards.
3. **Communal Action:** Utilize the kitchen guide below to feed children high protein/iron lugaw.`;

      const demoRecipe: CommunalBatchRecipe = {
        title: 'Arroz Caldo de Salubong (Communal Fortified Rice & Egg Soup)',
        totalServings: Math.round(total * 1.5),
        aggregatedNeedsSummary: summary,
        scaledIngredients: [
          { name: 'NFA Rice (Energy Core)', quantity: `${total * 0.25} kg`, category: 'relief' },
          { name: 'Canned Sardines (Solid Proteins & Lipids)', quantity: `${Math.round(total * 1.2)} cans`, category: 'relief' },
          { name: 'Fresh Chicken Eggs', quantity: `${Math.round(total * 1)} pieces`, category: 'pantry' },
          { name: 'Mashed Squash / Kalabasa', quantity: `${Math.round(total * 0.3)} whole veggies`, category: 'local' }
        ],
        batchPreparationGuide: [
          'In a massive community pot, boil clean filtered water over steady high flame.',
          'Stir in NFA Rice for 20 minutes until soft porridge forms.',
          'Add mashed Squash into the porridge to distribute Vitamin A.',
          'Add flaked Canned Sardines in their tomato sauce to fortify the meal.',
          'Crack Fresh Chicken Eggs directly into the hot boiling porridge, whisking to distribute cooked proteins.',
          'Serve warm to children.'
        ],
        dietarySuitability: 'Excellent for rapid underweight and wasting recovery, utilizing basic pantry items.'
      };
      setRecipeResult(demoRecipe);
    } finally {
      setLoading(false);
    }
  };

  // Text selection change listener for detecting highlighted cooking methods
  const handleTextSelection = (e: React.MouseEvent, stepIdx: number) => {
    const selection = window.getSelection();
    if (!selection) return;
    const selectedText = selection.toString().trim();
    
    // Listen for small targets/culinary action verbs (2 to 25 chars max)
    if (selectedText.length >= 2 && selectedText.length <= 25) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setTooltip({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
          text: selectedText,
          stepIdx
        });
      } catch (err) {
        // Range selection calculation error
      }
    }
  };

  // Immediate AI Step adaptation request
  const promptStepRegen = async (stepIdx: number, originalText: string, highlightedWord: string, newMethod: string) => {
    setTooltip(prev => ({ ...prev, visible: false }));
    setRegeneratingStepIdx(stepIdx);

    if (isDemoMode) {
      // Direct simulation mode
      setTimeout(() => {
        let updatedText = originalText;
        const lowerText = originalText.toLowerCase();
        const lowerHighlight = highlightedWord.toLowerCase();
        
        if (lowerText.includes(lowerHighlight)) {
          const regex = new RegExp(highlightedWord, 'i');
          updatedText = originalText.replace(regex, `${newMethod.toLowerCase()} (AI Modified)`);
        } else {
          // General replacements of standard verbs
          updatedText = originalText.replace(/(boil|stir|mash|flake|crack|sprinkle|cook|bake|grill|steam|pour|serve)/gi, (match) => {
            return `${newMethod} (AI Modified)`;
          });
        }
        
        const nextGuide = [...editedGuide];
        nextGuide[stepIdx] = updatedText;
        setEditedGuide(nextGuide);
        setRegeneratingStepIdx(null);
        onAlert(`AI adapted Step ${stepIdx + 1} to use "${newMethod}" successfully.`);
      }, 1000);
      return;
    }

    try {
      const resp = await fetch('/api/regenerate-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepText: originalText,
          newMethod,
          dishTitle: recipeResult?.title || 'Communal Recipe'
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Server rejected step modification.');
      }

      const nextGuide = [...editedGuide];
      nextGuide[stepIdx] = data.updatedStep;
      setEditedGuide(nextGuide);
      onAlert(`AI updated Step ${stepIdx + 1} to "${newMethod}" cooking method!`);
    } catch (err: any) {
      console.error(err);
      
      // Fallback local operation
      const regex = new RegExp(highlightedWord, 'i');
      const updatedText = originalText.replace(regex, `${newMethod.toUpperCase()} (BNS alternative)`);
      const nextGuide = [...editedGuide];
      nextGuide[stepIdx] = updatedText;
      setEditedGuide(nextGuide);
      onAlert(`Step adjusted to "${newMethod}" via baseline fallback.`);
    } finally {
      setRegeneratingStepIdx(null);
    }
  };

  // Export batch details and stock status as CSV report
  const handleExportCSV = () => {
    if (!recipeResult) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const csvRows: string[] = [];
    
    csvRows.push('"BARANGAY HEALTH OFFICE - COMMUNITY KITCHEN FEEDING PROGRAM REPORT"');
    csvRows.push(`"Report Generated On","${timestamp} UTC"`);
    csvRows.push('');
    
    csvRows.push('"BATCH RECIPE OVERVIEW"');
    csvRows.push(`"Recipe Title","${recipeResult.title.replace(/"/g, '""')}"`);
    csvRows.push(`"Target Meal Volume","${recipeResult.totalServings} Servings"`);
    csvRows.push(`"Dietary Profile","${recipeResult.dietarySuitability.replace(/"/g, '""')}"`);
    csvRows.push('');
    
    csvRows.push('"COMMUNAL BATCH INGREDIENT SCALING REPORT"');
    csvRows.push('"Ingredient Title","Required Quantity","Sourcing Class"');
    recipeResult.scaledIngredients.forEach(ing => {
      csvRows.push(`"${ing.name.replace(/"/g, '""')}","${ing.quantity.replace(/"/g, '""')}","${ing.category.toUpperCase()}"`);
    });
    csvRows.push('');
    
    csvRows.push('"PARTICIPATING REGISTERED CHILD CASES"');
    csvRows.push('"Patient Name / Alias","Age (Months)","Nutrition Classification","Field Scholar (BNS)","Available Household Pantry"');
    cases.forEach(c => {
      const suppliesText = c.householdSupplies ? c.householdSupplies.join(', ') : 'None';
      csvRows.push(`"${c.name.replace(/"/g, '""')}",${c.ageMonths},"${c.condition}","${c.bnsWorker.replace(/"/g, '""')}","${suppliesText.replace(/"/g, '""')}"`);
    });
    csvRows.push('');
    
    csvRows.push('"WAREHOUSE DISPATCH AND LOCAL HARVEST SECURITY AUDIT"');
    csvRows.push('"Storage Item","Current Registered Sacks/Qty","Category Class","Min Safe Threshold","Status"');
    stocks.forEach(s => {
      const gNum = parseNumberValue(s.quantity);
      const isLow = gNum < (s.threshold || 15);
      csvRows.push(`"${s.name.replace(/"/g, '""')}","${s.quantity.replace(/"/g, '""')}","${s.category.toUpperCase()}",${s.threshold || 15},"${isLow ? 'SHORTAGE ALERT' : 'SAFE'}"`);
    });

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Barangay_San_Jose_Communal_Kitchen_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="bg-emerald-55 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 shadow-tiny">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800">Monitored Cases</span>
            <p className="text-2xl font-black text-slate-800">{cases.length} Children</p>
          </div>
        </div>

        <div className="bg-amber-55 border border-amber-100 rounded-2xl p-5 flex items-center gap-4 shadow-tiny">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-800">Warehouse Stocks</span>
            <p className="text-2xl font-black text-slate-800">{stocks.length} Items</p>
          </div>
        </div>

        <div className="bg-[#EAF2F8] border border-blue-100 rounded-2xl p-5 flex items-center gap-4 shadow-tiny">
          <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-blue-800">Action Efficiency</span>
            <p className="text-2xl font-black text-slate-800">98.5% Safe</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start font-sans">
        
        {/* Child Cases List Editor */}
        <div id="cases-editor-card" className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
                👥 Multi-Patient Aggregated Casework
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Field scholar entries synchronized at Barangay Hall.</p>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase">
              {cases.length} Active Records
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {cases.map((c) => (
              <div key={c.id} className="border border-slate-150 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-xs text-slate-800">{c.name}</span>
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full ${
                      c.condition === 'Wasting' ? 'bg-red-100 text-red-800' :
                      c.condition === 'Underweight' ? 'bg-amber-100 text-amber-800' :
                      c.condition === 'Stunting' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.condition}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-450 font-bold">
                    <span>Age: {c.ageMonths} mos</span>
                    <span>•</span>
                    <span className="text-slate-500 font-semibold">Filed by: {c.bnsWorker}</span>
                    <span>•</span>
                    <span className="text-emerald-700 italic">Has: {c.householdSupplies?.join(', ') || 'No pantry'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCase(c.id)}
                  className="p-1.5 text-slate-400 hover:text-red-650 rounded-lg cursor-pointer transition-colors"
                  title="Remove case"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Child Case form popup/drawer inside pane */}
          <form onSubmit={handleAddCase} className="bg-slate-50/70 rounded-xl p-4 border border-slate-150 space-y-3 mt-4">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">✍️ Log New Case Profile</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Child Name / Alias</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g. Maria Clara Santos"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Scholar (BNS Representative)</label>
                <select 
                  value={newBNS} 
                  onChange={(e) => setNewBNS(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold font-sans text-slate-700 focus:outline-emerald-500"
                >
                  <option value="BNS Maria">BNS Maria (Field Scholar)</option>
                  <option value="BNS Juan">BNS Juan (Field Scholar)</option>
                  <option value="BNS Lita">BNS Lita (Field Scholar)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Age (Months)</label>
                <input 
                  type="number" 
                  min={6} 
                  max={60}
                  value={newAge} 
                  onChange={(e) => setNewAge(Number(e.target.value))} 
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Nutritional Status Diagnosis</label>
                <select 
                  value={newCondition} 
                  onChange={(e) => setNewCondition(e.target.value as any)} 
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold font-sans text-slate-700 focus:outline-emerald-500"
                >
                  <option value="Underweight">Underweight</option>
                  <option value="Wasting">Wasting</option>
                  <option value="Stunting">Stunting</option>
                  <option value="Healthy">Healthy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Child's Current Home Supplies (Pantry check)</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {['NFA Rice', 'Canned Sardines', 'Fresh Chicken Egg', 'Squash (Kalabasa)', 'Malunggay Leaves'].map((supply) => {
                  const hasIt = newSupplies.includes(supply);
                  return (
                    <button
                      key={supply}
                      type="button"
                      onClick={() => toggleFamilySupply(supply)}
                      className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wide transition-all border ${
                        hasIt 
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                          : 'bg-white border-slate-200 text-slate-550'
                      }`}
                    >
                      {supply}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-650 text-white rounded-lg py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              Add Case to Session Sheet
            </button>
          </form>
        </div>

        {/* Warehouse Stocks Inventory */}
        <div id="warehouse-stocks-card" className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
                📦 Community Warehouse Stock Levels
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Barangay Hall storage facilities current catalog.</p>
            </div>
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase">
              {stocks.length} Stock items
            </span>
          </div>

          {/* Core warning banner if ingredients are below safe levels */}
          {(() => {
            const lowStockItems = stocks.filter(s => parseNumberValue(s.quantity) < ((s as any).threshold !== undefined ? (s as any).threshold : 20));
            if (lowStockItems.length > 0) {
              return (
                <div className="bg-red-50 border border-red-200 text-red-800 text-[11px] rounded-xl p-3.5 flex items-start gap-2.5 text-left font-semibold animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold uppercase text-[9.5px] tracking-wider text-red-950 block">Communal Batch Alert: Shortages Monitored</span>
                    <p className="text-[#7B241C] mt-0.5">
                      The warehouse is low on **{lowStockItems.length} essential items** ({lowStockItems.map(i => i.name).join(', ')}). Ensure garden foragers gather malunggay or buy local crop supplements before scaling the kitchen wash.
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {stocks.map((s) => {
              const qtyNum = parseNumberValue(s.quantity);
              const threshold = (s as any).threshold !== undefined ? (s as any).threshold : 20;
              const isLowStock = qtyNum < threshold;

              return (
                <div 
                  key={s.id} 
                  className={`border rounded-xl p-2.5 flex items-center justify-between transition-all ${
                    isLowStock 
                      ? 'border-red-350 bg-red-50/40 hover:bg-red-50/70 shadow-xs' 
                      : 'border-slate-150 bg-slate-50/30 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    {isLowStock && (
                      <div className="text-red-650 shrink-0 select-none animate-pulse" title="Insufficient stock levels for the feeding program!">
                        <AlertTriangle className="w-4 h-4 fill-red-100 animate-pulse" />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-sans font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
                        <span>{s.name}</span>
                        {isLowStock && (
                          <span className="text-[7.5px] bg-red-650 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            LOW
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[8.5px] font-black uppercase tracking-wider text-slate-400">
                        <span className={`font-bold ${isLowStock ? 'text-red-700' : 'text-slate-550'}`}>{s.quantity}</span>
                        <span>•</span>
                        <span className={
                          s.category === 'relief' ? 'text-red-500' :
                          s.category === 'local' ? 'text-emerald-600' : 'text-blue-500'
                        }>{s.category}</span>
                        <span>•</span>
                        <span className="text-slate-450 font-semibold lowercase">min: {threshold} {parseUnit(s.quantity)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStock(s.id)}
                    className="p-1 text-slate-400 hover:text-red-650 cursor-pointer shrink-0 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Stock item mini form */}
          <form onSubmit={handleAddStock} className="bg-slate-50/70 rounded-xl p-4 border border-slate-150 space-y-3 mt-4 animate-fade-in">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">📦 Catalog Warehouse Stock Shipment</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Item Title</label>
                <input 
                  type="text" 
                  value={newStockName} 
                  onChange={(e) => setNewStockName(e.target.value)} 
                  placeholder="e.g. Canned Tuna"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Storage Volume Qty</label>
                <input 
                  type="text" 
                  value={newStockQty} 
                  onChange={(e) => setNewStockQty(e.target.value)} 
                  placeholder="e.g. 50 kg, 30 cans"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Safe Min. Threshold</label>
                <input 
                  type="number" 
                  min={1}
                  value={newStockThreshold} 
                  onChange={(e) => setNewStockThreshold(Number(e.target.value) || 0)} 
                  placeholder="e.g. 15"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] uppercase font-black tracking-wider text-slate-500 block mb-1">Item Category Class</label>
              <div className="flex gap-2">
                {[
                  { key: 'relief', val: 'Relief Goods (Aid)' },
                  { key: 'pantry', val: 'Barangay Pantry' },
                  { key: 'local', val: 'Backyard Crops' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setNewStockCat(item.key as any)}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border text-center cursor-pointer ${
                      newStockCat === item.key 
                        ? 'bg-amber-100 border-amber-300 text-amber-800' 
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {item.val}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-650 text-white rounded-lg py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              Archive Stock Container
            </button>
          </form>

        </div>

      </div>

      {/* Compiler Trigger button section */}
      <div className="bg-[#FAF9F5] border-2 border-slate-200 rounded-2xl p-6 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-1">
          <h4 className="font-sans font-black text-sm text-slate-800 uppercase tracking-widest flex items-center justify-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600 animate-pulse" />
            Barangay Action Room Compiler
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            Synthesize children diagnostics, analyze common food shortages, and create the optimal community-kitchen large-batch meal dynamically.
          </p>
        </div>

        <button
          type="button"
          onClick={handleComposeCommunalPlan}
          disabled={loading || cases.length === 0}
          className="bg-[#27AE60] hover:bg-[#219653] disabled:opacity-50 text-white rounded-xl py-3 px-8 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Collective Deficiencies & Compiling...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>Simulate Strategy & Communal Dish</span>
            </>
          )}
        </button>
      </div>

      {/* Synthesis Display Sheet */}
      {recipeResult && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-md antialiased text-slate-800 animate-fade-in">
          
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#27AE60] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ✓ Strategic Community Consultation Report
              </span>
              <h3 className="text-xl md:text-2xl font-sans font-black text-slate-800 uppercase tracking-tight leading-none mt-2">
                {recipeResult.title}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                title="Download CSV report for the Barangay Health Office"
              >
                <Download className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>Export Report (.CSV)</span>
              </button>

              <div className="bg-[#FFF5F5] border border-red-200 rounded-xl px-4 py-2.5 text-center shadow-tiny">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700 block">COMMUNAL FEEDING CAPACITY</span>
                <span className="text-xl font-sans font-black text-red-700">{recipeResult.totalServings} Children Servings</span>
              </div>
            </div>
          </div>

          {/* 3-Part Strategic Summary Section */}
          <div className="space-y-4">
            <h4 className="font-sans font-black text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Barangay Nutrition Action Summary
            </h4>
            
            {/* Display compiled AI report markdown text inside styled callout container */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs text-slate-700 font-sans leading-relaxed space-y-4 shadow-inner">
              {/* Highlight specific markdown features with structured sections */}
              <div className="space-y-3 prose max-w-none text-left">
                {recipeResult.aggregatedNeedsSummary.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h5 key={index} className="font-serif font-black text-sm text-emerald-800 border-b border-emerald-100 pb-1 mt-3">
                        {paragraph.replace('###', '').trim()}
                      </h5>
                    );
                  }
                  if (paragraph.includes('**') || paragraph.includes('-')) {
                    // Quick beautiful bullet translation
                    const lines = paragraph.split('\n');
                    return (
                      <ul key={index} className="space-y-2 list-none pl-0">
                        {lines.map((line, lIdx) => {
                          const cleaned = line.replace(/^\s*-\s*/, '').replace(/\*\*/g, '');
                          return (
                            <li key={lIdx} className="flex items-start gap-2 text-slate-750 font-semibold p-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                              <span className="text-emerald-600 font-black mt-0.5">●</span>
                              <span>{cleaned}</span>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="font-sans text-slate-600 font-medium">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scaled Ingredients List Grid */}
          <div className="space-y-3">
            <h4 className="font-sans font-black text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              COMMUNAL INGREDIENT RATIO SCALING
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recipeResult.scaledIngredients.map((ing, idx) => (
                <div key={idx} className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800">{ing.name}</span>
                    <p className="text-[8.5px] uppercase font-bold text-slate-450">{ing.category} Stock Allocations</p>
                  </div>
                  <div className="bg-[#27AE60] text-white px-2.5 py-1 rounded-lg text-xs font-sans font-black uppercase shadow-tiny">
                    {ing.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communal Preparation Checklist Timeline */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h4 className="font-sans font-black text-xs text-slate-500 uppercase tracking-widest">
                👨‍🍳 INTEGRATED COMMUNITY KITCHEN TIMELINE
              </h4>
              <span className="text-[9.5px] bg-amber-50 border border-amber-250 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                💡 AI Quick-Edit Active
              </span>
            </div>

            <p className="text-[10.5px] font-sans font-semibold text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-200">
              ⚡ <strong>BNS Action Tip:</strong> Drag your cursor to <strong>highlight any word</strong> (like <em>&quot;boil&quot;</em> or <em>&quot;mash&quot;</em>) in the recipe steps below, or double-click culinary verbs to trigger the interactive <strong>AI Quick Edit Tool</strong> and adapt cooking methods immediately! Click steps to edit inline too.
            </p>

            <div className="space-y-3">
              {editedGuide.map((step, idx) => {
                const isRegenerating = regeneratingStepIdx === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border rounded-xl p-4 flex items-start gap-3.5 transition-all text-left ${
                      isRegenerating 
                        ? 'border-emerald-350 bg-emerald-50/20 animate-pulse' 
                        : 'border-slate-150 bg-slate-50/30 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6.5 h-6.5 rounded-full bg-emerald-600 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-tiny">
                      {idx + 1}
                    </div>

                    <div 
                      className="w-full"
                      onMouseUp={(e) => handleTextSelection(e, idx)}
                    >
                      {isRegenerating ? (
                        <div className="flex items-center gap-2 py-1 text-xs text-emerald-800 font-extrabold">
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>AI Adaptation in progress: adapts text to chosen culinary method...</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const updated = [...editedGuide];
                              updated[idx] = e.currentTarget.textContent || '';
                              setEditedGuide(updated);
                            }}
                            className="border-b border-dashed border-transparent hover:border-slate-350 focus:outline-none focus:border-emerald-500 px-0.5 rounded cursor-text transition-all block w-full text-xs text-slate-650 font-bold leading-relaxed focus:bg-white"
                          >
                            {step}
                          </span>
                          
                          <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wide text-zinc-400 mt-1 select-none">
                            <span>✎ Inline Editable Step</span>
                            <span className="text-indigo-400 font-black">Highlight cooking verbs to trigger AI Edit</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Balanced Dietary Suitability Callout */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 flex items-start gap-3.5 text-left shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#27AE60] text-white flex items-center justify-center shrink-0 shadow-tiny">
              <CheckCircle className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1E8449]">CLINICAL NUTRITIONAL SUITABILITY PROFILE</span>
              <p className="text-xs text-slate-750 font-bold leading-relaxed mt-1">
                {recipeResult.dietarySuitability}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Floating AI Quick-Edit Instruction adaptive tooltip */}
      {tooltip.visible && (
        <div 
          className="ai-quick-edit-tooltip fixed z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-2.5 p-2 md:p-3 text-[10.5px] font-sans antialiased animate-fade-in"
          style={{ 
            top: `${tooltip.y}px`, 
            left: `${tooltip.x}px`,
            transform: 'translate(-50%, -100%)'
          }}
          onMouseDown={(e) => e.stopPropagation()} // Stop propagation from triggering general click-away hide
        >
          <div className="flex items-center gap-1.5 border-b md:border-b-0 md:border-r border-slate-800 pb-1.5 md:pb-0 md:pr-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-extrabold text-[9px] text-[#A3E635] tracking-widest uppercase select-none">
              AI Quick-Adapt: &quot;{tooltip.text.substring(0, 10)}{tooltip.text.length > 10 ? '...' : ''}&quot;
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 justify-center">
            {['Steam', 'Mash', 'Grill', 'Stir-fry', 'Boil'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => promptStepRegen(tooltip.stepIdx, editedGuide[tooltip.stepIdx], tooltip.text, method)}
                className="bg-slate-800 hover:bg-emerald-600 active:bg-emerald-700 text-white px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all"
              >
                {method}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTooltip(p => ({ ...p, visible: false }))}
            className="text-slate-500 hover:text-white px-1 font-black cursor-pointer text-xs"
            title="Dismiss tool"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
