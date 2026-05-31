import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI SDK Client to avoid crash-on-startup if key is absent.
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not defined. Please configure it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Thrift Crew Catalog Metadata for the system instruction
const PRODUCTS_DATA_SUMMARY = `
- ID 1: "Vintage Oversized Tee" (Category: T-Shirts) - 1299 INR
- ID 101: "Classic Athletic Tee" (Category: T-Shirts) - 999 INR
- ID 3: "Olive Quilted Jacket" (Category: Jackets) - 3499 INR
- ID 4: "Retro Graphic Hoodie" (Category: Jackets) - 1899 INR
- ID 102: "Suede Varsity Jacket" (Category: Jackets) - 4299 INR
- ID 103: "Classic Fleece Joggers" (Category: Trackpants) - 1799 INR
- ID 104: "Signature Side-Stripe Trackpants" (Category: Trackpants) - 1999 INR
- ID 2: "Utility Cargo Pants" (Category: Jeans) - 2499 INR
- ID 105: "Vaporwash Relaxed Denim" (Category: Jeans) - 2799 INR
- ID 106: "Vintage Football Jersey" (Category: Jerseys) - 1499 INR
- ID 107: "All-Star Basketball Jersey" (Category: Jerseys) - 1599 INR
- ID 108: "Classic Corduroy Cap" (Category: Caps) - 799 INR
- ID 109: "Retro Snapback Cap" (Category: Caps) - 999 INR
`;

// API routes first
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message input is required.' });
    }

    const ai = getGeminiAI();

    // Setup history formatted properly for GenAI chats or generateContent
    // Since we want to use responseSchema JSON support of Gemini 3.5 Flash for actions, 
    // it's easiest to do generateContent with the system prompt and full dialog trace.
    const systemInstruction = `You are "TC-9", the premium, chic, streetwear-loving AI Assistant for Thrift Crew, an elite online clothing thrift marketplace. 
Your goal is to look after customer queries, recommend stylish outfits, and physically guide or navigate them through the website by returning structural navigation actions alongside your message.

Always be polite, enthusiastic, cool, and helpful. Use streetwear terms occasionally like "fire find", "grails", "vintage staple", "drip", "thrift gem".

We have the following catalog of thrift grails:
${PRODUCTS_DATA_SUMMARY}

Website structure and action capabilities:
- If they want to go back home: action = "NAVIGATE_HOME", no payload.
- If they ask about policies (delivery, refund, shipping, terms): action = "NAVIGATE_POLICIES". Pick payload from: 'refund-return', 'shipping-delivery', 'privacy-policy', 'terms'.
- If they want to sign in, log in, or register: action = "NAVIGATE_AUTH", no payload.
- If they want to toggle dark mode / light mode interface style: action = "TOGGLE_DARK_MODE", no payload.
- If they ask questions from FAQ (how was Thrift Crew founded, where do clothes come from): action = "SCROLL_TO_FAQ", no payload.
- If they want to browse the shop catalog, scroll to category filter: action = "SCROLL_TO_SHOP", no payload.
- If they want to view details of their shopping cart: action = "OPEN_CART", no payload.
- If they ask about a specific product in our catalog: action = "VIEW_PRODUCT", payload must be the matching ID number as a string (e.g. "1" or "102").
- If they want to look at a particular category (e.g. jackets, trackpants, caps, t-shirts, jeans, jerseys): action = "FILTER_CATEGORY", payload must be one of: 'T-Shirts', 'Jackets', 'Trackpants', 'Jeans', 'Jerseys', 'Caps'.

IMPORTANT: You can only navigate them when they ask for it or when you refer to a specific page/product/policy so that you genuinely guide them. Otherwise (for general chatter) specify action = null.

You MUST respond strictly in JSON matching the specified schema. Dont wrap with markdown unless required, let the schema force it.`;

    // Map conversation history into model input
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));

    // Append the latest user query
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'The natural text response to the customer. Use nice, readable spacing and occasionally brief markdown bullet points if listing styles/features.'
            },
            action: {
              type: Type.STRING,
              description: 'Optional action name to automatically trigger on the customer screen.',
              enum: [
                'NAVIGATE_HOME',
                'NAVIGATE_POLICIES',
                'NAVIGATE_AUTH',
                'TOGGLE_DARK_MODE',
                'SCROLL_TO_FAQ',
                'SCROLL_TO_SHOP',
                'OPEN_CART',
                'VIEW_PRODUCT',
                'FILTER_CATEGORY'
              ]
            },
            actionPayload: {
              type: Type.STRING,
              description: 'The optional string payload parameter for the action (eg. category name or product ID).'
            }
          },
          required: ['reply']
        }
      }
    });

    const bodyText = response.text || '{}';
    let result;
    try {
      result = JSON.parse(bodyText.trim());
    } catch {
      result = { reply: bodyText, action: null };
    }

    res.json(result);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      reply: 'Sorry, I couldn\'t connect to the Thrift Crew style base right now. Let me know if there\'s anything else or try again!',
      error: error.message 
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
