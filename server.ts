/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Gemini initialisation getter to prevent module-level load crashes
  let aiInstance: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please locate the secrets panel in Settings > Secrets to link your key.");
    }
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiInstance;
  }

  // API endpoint for generating recipes
  app.post("/api/generate-meal-plan", async (req, res) => {
    try {
      const { childMetrics, availableIngredients, targetNutrients } = req.body;

      if (!childMetrics || !availableIngredients) {
        return res.status(400).json({ error: "Missing required child metrics or materials." });
      }

      // Quick sanity check on API Key
      try {
        getGemini();
      } catch (keyErr: any) {
        return res.status(403).json({ 
          error: keyErr.message, 
          needsKey: true 
        });
      }

      const gemini = getGemini();

      const prompt = `
You are an expert community nutritionist assisting a Barangay Nutrition Scholar (BNS) in the Philippines.
Your goal is to help draft personalized, budget-friendly meal plans for malnourished or underweight children.

Your primary directive is absolute realism regarding poverty and resource scarcity:
- NEVER suggest, imply, or include ingredients outside the provided stock/ingredients list below (except basic water, a pinch of salt, and a drop of cooking oil). Absolutely no other spices, vegetables, seasoning packs, or proteins are permissible (NO garlic, onion, pepper, ginger, soy sauce, sugar, vinegar) UNLESS they are explicitly listed in the available ingredients.
- Assume families have very limited cooking equipment (e.g., wood fire, single charcoal stove, basic pots/pans) and NO refrigeration whatsoever. Do not mention or require baking, chilling, or blending.
- Keep recipes deeply culturally aligned with low-resource Filipino barangay life (e.g., utilizing sabaw/soup to stretch fluid/volume of meals, mixing garden crops/potatoes with canned fish from relief goods, making warm soft mashes/lugaw).
- Prioritize caloric density, healthy fats (from eggs or canned fish oil), and critical micronutrients (Iron, Vitamin A, Protein) for malnourished children.
- Write steps in clear, highly accessible English that a local BNS can easily translate or explain to a mother in Tagalog/Visayan.

Child Metrics & Diagnosis:
- Child Name/Alias: ${childMetrics.name || "Malnourished Child"}
- Age Bracket: ${childMetrics.age}
- Target Diagnostic Concerns: ${childMetrics.nutritionalNeeds?.join(", ") || "Caloric & Protein shortages"}
- Current Weight: ${childMetrics.weightKg || "N/A"} kg
- Current Height: ${childMetrics.heightCm || "N/A"} cm
- BNS Health Worker Notes & Special Constraints: ${childMetrics.bnsFeedback || "None specified."}

Recommended Daily Nutrient Targets (FNRI RENI):
- Calories Goal: ${targetNutrients?.energyKcal || "1000"} kcal
- Protein Goal: ${targetNutrients?.proteinG || "15"} g
- Iron Goal: ${targetNutrients?.ironMg || "8"} mg

Available relief goods and local garden harvests currently inside the family's house:
${availableIngredients.map((ing: any) => `- ${ing.name} (Count/Amount: ${ing.count} ${ing.unit || "unit"}) [Category: ${ing.category}]`).join("\n")}

Tasks and Directives:
1. Provide exactly three (3) distinct, culturally appropriate recipe options familiar to low-income Filipino families.
2. Use ONLY the items listed in the "Available relief goods and local garden harvests" above (and strictly obey any ingredient exclusions from the BNS Feedback above).
3. Write simple, numbering-based preparation guides assuming simple equipment based on the BNS Feedback (e.g. if limited to boiling/charcoal, only use boiling/mashing, do not fry or sauté).
4. Explain clearly and warmly how this food addresses the child's calorie, protein, or micronutrient (iron, beta-carotene/squash) gaps.
5. Compose an empathetic, extremely supportive, Taglish-friendly brief summarizing and encouraging BNS workers and the health caregiver.
6. CRITICAL DIRECTION ON BNS FEEDBACK: Always strictly apply BNS Feedback & Household Constraints. If an ingredient was restricted (e.g., "allergic to squash"), you must NEVER use it or suggest it in any recipes. If cooking equipment is restricted (e.g., "only charcoal to boil water"), alter the preparation methods of ALL recipes to boil or mash instead of frying or stir-frying.
7. MEAL STRETCHING RATIONS PLAN: Provide a detailed strategic section detailing how the BNS/mother can stretch these specific ingredients to make them last safely for the entire day. Explicitly cover:
   A. Preparation Strategy: How to divide or prepare the limited ingredients to make them last for 3 feeds (Breakfast, Lunch, Dinner).
   B. Broth/Sabaw Addition: How to safely use boiled clean water and salt to increase the volume of the meal for hydration, thermal comfort, and satiety.
   C. Nutritional Focus: The best way to ensure the recovering child gets the absolute cream of the nutrients (e.g., prioritizing fish solids/fats, adding Moringa directly to the child's portion).

Create your responses formatted exactly according to the requested JSON layout.
`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { 
                      type: Type.STRING, 
                      description: "Simple Taglish/Filipino dish title (e.g., 'Porridge with Kalabasa', 'Sardinas at Kamote Tops', 'Tortang Kalabasa at Itlog')." 
                    },
                    ingredientsUsed: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Exact subset of ingredients used (e.g., ['1 can sardines', '1 cup NFA rice', 'malunggay leaves'])."
                    },
                    preparationGuide: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Minimal numbered cooking steps."
                    },
                    nutritionalValue: { 
                      type: Type.STRING, 
                      description: "A summary explaining weight-gain assistance, energy-density, protein enhancement, or why vitamin extraction is effective in this dish." 
                    },
                    nutritionalBrief: {
                      type: Type.OBJECT,
                      properties: {
                        caloriesEstimate: { type: Type.INTEGER, description: "Portion energy estimate (e.g., 340)" },
                        proteinEstimate: { type: Type.NUMBER, description: "Protein content estimate in grams (e.g., 14.5)" },
                        ironEstimate: { type: Type.NUMBER, description: "Iron content estimate in milligrams (e.g., 3.2)" },
                        whyGood: { type: Type.STRING, description: "Why this helps weight recovery or counteracting anemia." }
                      },
                      required: ["caloriesEstimate", "proteinEstimate", "ironEstimate", "whyGood"]
                    }
                  },
                  required: ["id", "name", "ingredientsUsed", "preparationGuide", "nutritionalValue", "nutritionalBrief"]
                }
              },
              stretchingPlan: {
                type: Type.OBJECT,
                description: "Strategy to stretch and maximize severely restricted rations for the toddler.",
                properties: {
                  preparationStrategy: {
                    type: Type.STRING,
                    description: "Specific instructions to slice, section, or portion the ingredients so they last across Breakfast, Lunch, and Dinner."
                  },
                  brothAddition: {
                    type: Type.STRING,
                    description: "Explicit methods to boil water and add salt (sabaw) to puff up rice, amplify volume, and safely warm and hydrate the child."
                  },
                  nutritionalFocus: {
                    type: Type.STRING,
                    description: "How to steer the most nutrient-packed edible solids directly into the target child's feeding bowl."
                  }
                },
                required: ["preparationStrategy", "brothAddition", "nutritionalFocus"]
              },
              nutritionistNote: { 
                type: Type.STRING, 
                description: "A motivational note for the Barangay worker to read or share, addressing sanitation, hydration, safe milk-dilution, or local feeding advice." 
              }
            },
            required: ["recipes", "stretchingPlan", "nutritionistNote"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response received from the nutrition compiler engine.");
      }

      const mealPlanData = JSON.parse(responseText.trim());
      res.json(mealPlanData);

    } catch (error: any) {
      console.error("Meal planner server error:", error);
      res.status(500).json({ 
        error: error.message || "An unexpected error occurred while compiling recipes. Check your API token configuration." 
      });
    }
  });

  // API endpoint for generating communal community kitchen recipes
  app.post("/api/generate-communal-recipe", async (req, res) => {
    try {
      const { cases, warehouseStock } = req.body;

      if (!cases || !warehouseStock) {
        return res.status(400).json({ error: "Missing required children cases or warehouse stock configuration." });
      }

      // Quick check on API Key - if missing, we will throw a clear message
      try {
        getGemini();
      } catch (keyErr: any) {
        return res.status(403).json({ 
          error: keyErr.message, 
          needsKey: true 
        });
      }

      const gemini = getGemini();

      const prompt = `
You are a public health nutrition consultant and expert community dietitian analyzing aggregated health case records submitted by multiple Barangay Nutrition Scholars (BNS) in a Philippine village.

Your task is to analyze these collective child cases, detect risk clusters, evaluate available local warehouse relief inventory at the Barangay Hall, and compile a single large-batch strategic recipe for communal kitchen cooking.

CHILD DEPT CASE RECORDS MONITORED:
${cases.map((c: any, index: number) => `Case ${index + 1} (${c.bnsWorker || "BNS Worker"}): ${c.name}, ${c.ageMonths} months old, Condition: ${c.condition}. Supplies at home: ${c.householdSupplies?.join(", ") || "None."}`).join("\n")}

AVAILABLE WAREHOUSE STOCK INVENTORY AT BARANGAY HALL:
${warehouseStock.map((s: any) => `- ${s.name}: ${s.quantity} [Category: ${s.category}]`).join("\n")}

You must output a single JSON structured block containing:
1. "aggregatedNeedsSummary": A concise 3-part strategic summary including:
   - High-Risk Clusters: Diagnose common nutritional deficiencies across these cases (e.g., "70% of the cases show a severe protein-energy malnutrition risk").
   - Resource Allocation Advice: Based on the collective pantry shortages observed in children's homes, which relief goods should the Barangay priority-distribute to these specific families this week?
   - Nutritional focus explanation.
2. "title": A warm, culturally fitting Filipino large-batch communal recipe (e.g., "Sardinas at Tinapa Lugaw with Fortified Squash Mash", "COMMUNAL GINATAANG MALUNGGAY WITH SARDINE GOLD").
3. "totalServings": Integer representing the batch size suitable for feeding all monitored children plus a few extra portions (e.g., matching count of cases * 1.5).
4. "scaledIngredients": An array of ingredients scaled up for a communal kitchen batch, prioritizing using the listed warehouse stocks. Each should contain "name", "quantity", and "category".
5. "batchPreparationGuide": A clean numbered list of instruction steps for cooking in a community communal kitchen or large vat.
6. "dietarySuitability": Explicit explanation of why this communal dish is perfectly balanced to treat Underweight, Stunting, and Wasting simultaneously using natural, yard-sourced or relief-pantry ingredients.

Create your responses formatted exactly according to the requested JSON layout.
`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              totalServings: { type: Type.INTEGER },
              aggregatedNeedsSummary: { type: Type.STRING },
              scaledIngredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    category: { type: Type.STRING }
                  },
                  required: ["name", "quantity", "category"]
                }
              },
              batchPreparationGuide: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              dietarySuitability: { type: Type.STRING }
            },
            required: ["title", "totalServings", "aggregatedNeedsSummary", "scaledIngredients", "batchPreparationGuide", "dietarySuitability"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response received from the communal cooking engine.");
      }

      const parsedJSON = JSON.parse(responseText.trim());
      res.json(parsedJSON);

    } catch (error: any) {
      console.error("Communal chef server error:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while compiling community recipe. Check your API token configuration."
      });
    }
  });

  // API endpoint for regenerating a single cooking step interactively
  app.post("/api/regenerate-step", async (req, res) => {
    try {
      const { stepText, newMethod, dishTitle } = req.body;
      if (!stepText || !newMethod) {
        return res.status(400).json({ error: "Missing required stepText or newMethod parameters." });
      }

      // Check on API Key - if missing, throw clear message
      try {
        getGemini();
      } catch (keyErr: any) {
        return res.status(403).json({ 
          error: keyErr.message, 
          needsKey: true 
        });
      }

      const gemini = getGemini();

      const prompt = `
You are an expert community dining chef and public health dietitian in the Philippines.
We have an existing step from our large-batch communal recipe titled "${dishTitle || 'Communal Recipe'}":
Step: "${stepText}"

We want to modify this step on behalf of a Barangay Nutrition Scholar (BNS) because of a specific preparation adjustment request:
Change the primary cooking/processing style/action/technique in this step to use the method: "${newMethod}" (e.g., if it says 'boil', transition it to 'steam', 'mash', 'grill', 'stir-fry' or another suitable technique).

Tasks:
1. Rewrite this single step instruction clearly, keeping it highly descriptive, culturally aligned, and practical for low-resource community kitchens in Philippines.
2. Maintain the same general ingredient details, portioning, or sequence relative to the original step, but switch the culinary technique as instructed.
3. Keep the output extremely clean. Return ONLY the rewritten step instruction text as a plain string, with NO extra conversational dialogue, NO quote marks around the outer text, and NO markdown prefixes.
`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      const responseText = response.text?.trim() || stepText;
      res.json({ updatedStep: responseText });

    } catch (error: any) {
      console.error("Step regeneration error:", error);
      res.status(500).json({
        error: error.message || "Failed to regenerate step."
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", keyStatus: !!process.env.GEMINI_API_KEY });
  });

  // Vite dev or production router config
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BNS Assistant server listening on http://localhost:${PORT}`);
  });
}

startServer();
