import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a code analysis AI. Analyze the provided code and return a JSON object with this exact structure:
{
  "totalScore": number (0-100, higher = more debt),
  "complexityScore": number (0-100),
  "duplicationScore": number (0-100),
  "codeSmellScore": number (0-100),
  "modules": [
    {
      "moduleName": string,
      "filePath": string,
      "debtScore": number (0-100),
      "complexity": number,
      "linesOfCode": number,
      "codeSmells": [{"type": string, "description": string, "severity": "low"|"medium"|"high"}]
    }
  ],
  "dependencies": [
    {"source": string, "target": string, "type": "import"|"inheritance"|"composition", "weight": number}
  ],
  "refactoringTasks": [
    {
      "title": string,
      "description": string,
      "moduleName": string,
      "priority": "low"|"medium"|"high"|"critical",
      "estimatedEffort": "low"|"medium"|"high",
      "riskLevel": number (0-1)
    }
  ]
}
Only return valid JSON, no markdown.`
          },
          {
            role: "user",
            content: `Analyze this ${language || "code"} for technical debt:\n\n${code}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_code",
              description: "Return technical debt analysis results",
              parameters: {
                type: "object",
                properties: {
                  totalScore: { type: "number" },
                  complexityScore: { type: "number" },
                  duplicationScore: { type: "number" },
                  codeSmellScore: { type: "number" },
                  modules: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        moduleName: { type: "string" },
                        filePath: { type: "string" },
                        debtScore: { type: "number" },
                        complexity: { type: "number" },
                        linesOfCode: { type: "number" },
                        codeSmells: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              type: { type: "string" },
                              description: { type: "string" },
                              severity: { type: "string", enum: ["low", "medium", "high"] }
                            },
                            required: ["type", "description", "severity"]
                          }
                        }
                      },
                      required: ["moduleName", "filePath", "debtScore", "complexity", "linesOfCode", "codeSmells"]
                    }
                  },
                  dependencies: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        source: { type: "string" },
                        target: { type: "string" },
                        type: { type: "string", enum: ["import", "inheritance", "composition"] },
                        weight: { type: "number" }
                      },
                      required: ["source", "target", "type", "weight"]
                    }
                  },
                  refactoringTasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        moduleName: { type: "string" },
                        priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                        estimatedEffort: { type: "string", enum: ["low", "medium", "high"] },
                        riskLevel: { type: "number" }
                      },
                      required: ["title", "description", "moduleName", "priority", "estimatedEffort", "riskLevel"]
                    }
                  }
                },
                required: ["totalScore", "complexityScore", "duplicationScore", "codeSmellScore", "modules", "dependencies", "refactoringTasks"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_code" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const analysis = typeof toolCall.function.arguments === 'string' 
        ? JSON.parse(toolCall.function.arguments) 
        : toolCall.function.arguments;
      
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse from content
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return new Response(jsonMatch[0], {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Could not parse AI response");
  } catch (e) {
    console.error("analyze-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
