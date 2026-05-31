import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-gemini-chat',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/gemini/chat' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const { message, history } = parsed;

                  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                  if (!apiKey) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                      reply: "Hey there! Please make sure to configure your **GEMINI_API_KEY** under the **Settings > Secrets** panel in AI Studio so I can connect to my style brain and start assisting you! 🚀" 
                    }));
                    return;
                  }

                  const ai = new GoogleGenAI({
                    apiKey: apiKey,
                    httpOptions: {
                      headers: { 'User-Agent': 'aistudio-build' }
                    }
                  });

                  const systemInstruction = `You are "TC-Bot" (also known as "TC-9"), the premium, chic, streetwear-loving AI Assistant for Thrift Crew, an elite online clothing thrift marketplace. 
Your goal is to look after customer queries, recommend stylish outfits, and physically guide or navigate them through the website by returning structural navigation actions alongside your message.

Always be polite, enthusiastic, cool, and helpful. Use streetwear terms occasionally like "fire find", "grails", "vintage staple", "drip", "thrift gem".

We have the following catalog of thrift grails:
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

Website structure and action capabilities:
- If they want to go back home: action = "NAVIGATE_HOME", no payload.
- If they ask about policies (delivery, refund, shipping, terms): action = "NAVIGATE_POLICIES". Pick payload from: 'refund-return', 'shipping-delivery', 'privacy-policy', 'terms'.
- If they want to sign in, log in, or register: action = "NAVIGATE_AUTH", no payload.
- If they want to toggle dark mode / light mode interface style: action = "TOGGLE_DARK_MODE", no payload.
- If they ask questions from FAQ (how was Thrift Crew founded, where do clothes come from): action = "SCROLL_TO_FAQ", no payload.
- If they want to browse the shop catalog, scroll to category filter: action = "SCROLL_TO_SHOP", no payload.
- If they want to view details of their shopping cart: action = "OPEN_CART", no payload.
- If they want to proceed to checkout / buy items: action = "NAVIGATE_CHECKOUT", no payload.
- If they ask about a specific product in our catalog: action = "VIEW_PRODUCT", payload must be the matching ID number as a string (e.g. "1" or "102").
- If they want to look at a particular category (e.g. jackets, trackpants, caps, t-shirts, jeans, jerseys): action = "FILTER_CATEGORY", payload must be one of: 'T-Shirts', 'Jackets', 'Trackpants', 'Jeans', 'Jerseys', 'Caps'.

IMPORTANT: You can only navigate them when they ask for it or when you refer to a specific page/product/policy so that you genuinely guide them. Otherwise (for general chatter) specify action = null.

You MUST respond strictly in JSON matching the specified schema. Dont wrap with markdown unless required, let the schema force it.`;

                  const formattedHistory = (history || []).map((h: any) => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content }]
                  }));

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
                            description: 'Optional action to trigger',
                            enum: [
                              'NAVIGATE_HOME',
                              'NAVIGATE_POLICIES',
                              'NAVIGATE_AUTH',
                              'TOGGLE_DARK_MODE',
                              'SCROLL_TO_FAQ',
                              'SCROLL_TO_SHOP',
                              'OPEN_CART',
                              'NAVIGATE_CHECKOUT',
                              'VIEW_PRODUCT',
                              'FILTER_CATEGORY'
                            ]
                          },
                          actionPayload: {
                            type: Type.STRING,
                            description: 'The optional string payload parameter for the action'
                          }
                        },
                        required: ['reply']
                      }
                    }
                  });

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(response.text || '{}');
                } catch (e: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ reply: 'Sorry, style server error: ' + e.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
