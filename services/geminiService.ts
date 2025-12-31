
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getDashboardInsights = async (userName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 short, professional "Civic Service Insights" for a dashboard for a citizen named ${userName}. 
      Topics should be: Local Governance, Community Safety, and Public Infrastructure. 
      Keep each insight under 20 words. Focus on urban improvement and civic duty.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ["topic", "summary"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return [
      { topic: "Infrastructure", summary: "Streetlight repairs are trending up in your local sector this week." },
      { topic: "Sanitation", summary: "New waste management protocols are being deployed by the Municipality." },
      { topic: "Engagement", summary: "Community participation in civic reporting has increased by 15%." }
    ];
  }
};

export const searchLeaderInfo = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title);

    return { text, sources };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { 
      text: "Unable to retrieve real-time verified data at the moment. Please try again later.", 
      sources: [] 
    };
  }
};

/**
 * Dynamically discover a political leader profile using AI if not in our local DB
 */
export const discoverLeaderProfile = async (name: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the official political profile for ${name} in India. Provide role (MP/MLA), Party, Constituency, and State. 
      Also provide estimated performance scores (0-100) for Attendance, Bills, Debates, and Questions based on available records.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            party: { type: Type.STRING },
            constituency: { type: Type.STRING },
            state: { type: Type.STRING },
            attendance: { type: Type.NUMBER },
            bills: { type: Type.NUMBER },
            debates: { type: Type.NUMBER },
            questions: { type: Type.NUMBER },
            sinceYear: { type: Type.NUMBER }
          },
          required: ["name", "role", "party", "constituency", "state"]
        }
      }
    });
    return JSON.parse(response.text || "null");
  } catch (error) {
    console.error("Discover Leader Error:", error);
    return null;
  }
};

/**
 * Compare two leaders using real-time search data
 */
export const compareLeadersAI = async (leader1: string, leader2: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a detailed side-by-side comparison of ${leader1} and ${leader2}. 
      Compare their:
      1. Recent parliamentary activity (last 3-6 months).
      2. Key public stances or major policy debates they were involved in.
      3. Any recent controversies or major achievements.
      4. Ground-level impact in their respective constituencies.
      Focus on objective data and verified news.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title);

    return { text, sources };
  } catch (error) {
    console.error("AI Comparison Error:", error);
    return { text: "AI comparison currently unavailable. Please try again.", sources: [] };
  }
};

/**
 * Fetch and verify political promises from live news/records
 */
export const fetchAndVerifyPromises = async (query: string = "latest election promises by Indian political parties BJP Congress AAP") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for and list 5 authentic, specific political promises or commitments made by Indian political leaders or parties in the last 12 months. 
      Only include promises that can be verified via news sources. 
      For each promise, provide:
      - title: Short title of the promise.
      - description: Detailed description.
      - authority: Who made it (leader name).
      - party: Which party they belong to.
      - date: Date when promised.
      - targetDate: Expected completion date if mentioned, else set as "TBD".
      - status: 'Active', 'Processing', 'Completed', or 'Delayed'.
      - category: One of 'Infrastructure', 'Healthcare', 'Education', 'Social Welfare', 'Agriculture', 'Environment'.
      - progress: estimated percentage (0-100).
      - scope: 'Centre' or 'State'.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              authority: { type: Type.STRING },
              party: { type: Type.STRING },
              date: { type: Type.STRING },
              targetDate: { type: Type.STRING },
              status: { type: Type.STRING },
              category: { type: Type.STRING },
              progress: { type: Type.NUMBER },
              scope: { type: Type.STRING }
            },
            required: ["title", "description", "authority", "party", "status", "category"]
          }
        }
      }
    });

    const promises = JSON.parse(response.text || "[]");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title);

    return { promises, sources };
  } catch (error) {
    console.error("Fetch Promises Error:", error);
    return { promises: [], sources: [] };
  }
};

/**
 * Fetch Live Events and Ongoing Major Projects in India using Google Search
 */
export const fetchLiveEventsAndProjects = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for currently happening (LIVE) political events in India (parliament sessions, rallies, summits) 
      AND major ONGOING infrastructure/government projects in India (Metro expansions, Expressways, Smart Cities, Energy projects).
      
      Return a list of 10 items. For each item provide:
      - id: unique string
      - title: Name of event or project
      - description: 1-2 sentence summary
      - category: 'Parliament', 'Political Event', 'Infrastructure', 'Social Project', or 'Summit'
      - status: 'Live', 'Upcoming', or 'Ongoing'
      - date: formatted date string
      - time: formatted time string or 'All Day'
      - views: estimate number or 0
      - highlights: array of 3 major points or milestones.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              status: { type: Type.STRING },
              date: { type: Type.STRING },
              time: { type: Type.STRING },
              views: { type: Type.NUMBER },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "description", "category", "status", "date", "highlights"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title);

    return { data, sources };
  } catch (error) {
    console.error("Fetch Live Events Error:", error);
    return { data: [], sources: [] };
  }
};
