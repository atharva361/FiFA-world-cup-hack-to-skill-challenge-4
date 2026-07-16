import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini Client Utility with Lazy Initialization
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. Chatbot endpoint (Stateless multi-turn conversation)
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, selectedStadium } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid 'messages' format. Must be an array of message objects." });
      return;
    }

    const ai = getGemini();

    // Map client messages into Gemini parts structure
    const geminiContents = messages.map((m: any) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content }],
      };
    });

    const systemInstruction = `You are StadiumGPT, a state-of-the-art AI Operations and Fan Experience Assistant for the FIFA World Cup 2026. 
You are currently providing guidance for the venue: "${selectedStadium || "All Stadiums"}".
Provide helpful, professional, and friendly information regarding stadium gates, crowd management, match times, security procedures, public transport routes, parking details, accessibility options, food & beverage services, sustainability initiatives, and emergency procedures.
Keep your answers engaging, well-formatted, and direct. Use bullet points or numbers when listing steps or guides. Do not output markdown code blocks unless necessary. Use professional FIFA World Cup style.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || "I apologize, I was unable to generate a response at this moment.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 3. AI-driven operations and recommendations endpoint (Structured JSON Output)
app.post("/api/gemini/recommendations", async (req, res) => {
  try {
    const { crowdLoad, openGates, queueTime, weather, incidentCount, activeStadium } = req.body;
    const ai = getGemini();

    const prompt = `Analyze current stadium operational metrics for ${activeStadium || "FIFA World Cup 2026 Stadium"}:
- Crowd Capacity / Occupancy: ${crowdLoad || 50}%
- Open Entry/Exit Gates: ${openGates || 8} gates
- Average Queue Wait Time: ${queueTime || 15} minutes
- Weather Conditions: ${weather || "Clear, 22°C"}
- Active Security / Medical Incidents: ${incidentCount || 0}

Generate real-time AI stadium operational recommendations, safety ratings, and dynamic warnings. Your response must be in strict JSON format matching the schema requested.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the StadiumGPT Lead Operations AI Engine. Generate smart, actionable operational adjustments for safety, crowd flow, public transport coordination, and venue coordination.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stadiumStatus: {
              type: Type.STRING,
              description: "Overall status indicator. E.g. Optimal, High Flow, Congested, Emergency Action.",
            },
            crowdSafetyIndex: {
              type: Type.NUMBER,
              description: "A safety rating from 0 to 100 based on metrics.",
            },
            alerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Alert headlines for the operations dashboard.",
            },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title of operational action." },
                  severity: { type: Type.STRING, description: "Severity of action (e.g. Critical, High, Moderate, Info)." },
                  desc: { type: Type.STRING, description: "Clear implementation guidelines." },
                  targetDept: { type: Type.STRING, description: "Target department (e.g. Security, Guest Services, Transit, Volunteers)." }
                },
                required: ["title", "severity", "desc", "targetDept"]
              }
            }
          },
          required: ["stadiumStatus", "crowdSafetyIndex", "alerts", "actions"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in /api/gemini/recommendations:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 4. Translation Proxy
app.post("/api/gemini/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      res.status(400).json({ error: "Missing required fields 'text' or 'targetLang'." });
      return;
    }

    const ai = getGemini();
    const prompt = `Translate the following text into the language with code/name "${targetLang}". Keep any specific FIFA World Cup 2026 names, stadium terms, and formatting intact. Return ONLY the translated text, with absolutely no additional explanations, intros, or markdown block styling:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ translatedText: response.text?.trim() || text });
  } catch (error: any) {
    console.error("Error in /api/gemini/translate:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 5. Crowd Insights Generator (Generates analytical advice for Dashboard)
app.post("/api/gemini/analytics-insights", async (req, res) => {
  try {
    const { metricsSummary } = req.body;
    const ai = getGemini();

    const prompt = `As the AI Operations Coordinator, write a highly professional, concise, bulleted analytics summary (3 key points max, 2 sentences per point) regarding these crowd statistics:\n${metricsSummary || "Normal Operations"}. Emphasize dynamic traffic adjustments, gate pacing, and shuttle deployment. Avoid generic fluff.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the StadiumGPT AI Director. You speak in a highly precise, technical, operations-focused manner. No emojis, no sales fluff."
      }
    });

    res.json({ insights: response.text?.trim() || "Operations stable. Continue monitoring crowd metrics." });
  } catch (error: any) {
    console.error("Error in /api/gemini/analytics-insights:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// ==========================================
// VITE AND STATIC SERVING MIDDLEWARE
// ==========================================

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite server creators for development environment
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    // Production: serve built static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files serving enabled.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StadiumGPT server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to bootstrap the StadiumGPT fullstack server:", err);
});
