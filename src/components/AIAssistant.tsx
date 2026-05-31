import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, MessageSquare, ArrowRight, CornerDownLeft, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionExecuted?: string;
}

interface AIAssistantProps {
  onExecuteAction: (action: string, payload?: string) => void;
  isDarkMode: boolean;
}

const QUICK_SUGGESTIONS = [
  { text: "⚡ Show me Jackets", query: "Can you filter by Jackets?" },
  { text: "🛒 Open my cart", query: "Please open my shopping cart." },
  { text: "📍 Delivery/Refund terms", query: "Where is your Refund and Return policy?" },
  { text: "🌓 Toggle Dark/Light mode", query: "Can you toggle dark mode?" },
  { text: "🌟 What are your main FAQs?", query: "Could you scroll us to the FAQ section?" }
];

export function AIAssistant({ onExecuteAction, isDarkMode }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey there! I am **TC-Bot**, your virtual style advisor and guide for **Thrift Crew**.\n\nLooking for some style recommendations, fresh drop filters, delivery terms, or want to checkout? Ask me anything and I can physically navigate you there! ✨",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Map existing messages (skipping welcome since it's system-styled markdown) to match server expected format
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-20) // Keep history tight to reduce token usage
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history
        })
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Sorry, I generated an empty response.",
        timestamp: new Date()
      };

      if (data.action) {
        // Execute Action callback inside App.tsx
        onExecuteAction(data.action, data.actionPayload);
        assistantMsg.actionExecuted = getActionHumanLabel(data.action, data.actionPayload);
        
        // Show floating HUD notification for interactive feedback
        showActionToast(data.action, data.actionPayload);
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Sorry about that! It seems my connection is temporarily overloaded. Please try again in an instant. 🌟",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionHumanLabel = (action: string, payload?: string): string => {
    switch (action) {
      case 'NAVIGATE_HOME': return 'Navigated to Home Page';
      case 'NAVIGATE_POLICIES': return `Navigated to Policies Page (${payload || 'General'})`;
      case 'NAVIGATE_AUTH': return 'Opened Login & Register Page';
      case 'TOGGLE_DARK_MODE': return 'Toggled Dark Mode preference';
      case 'SCROLL_TO_FAQ': return 'Scrolled down to FAQ';
      case 'SCROLL_TO_SHOP': return 'Scrolled to Main Catalog';
      case 'OPEN_CART': return 'Opened Shopping Cart';
      case 'VIEW_PRODUCT': return 'Opened Product Details';
      case 'FILTER_CATEGORY': return `Filtered shop catalog to: "${payload}"`;
      default: return 'Guided navigation';
    }
  };

  const showActionToast = (action: string, payload?: string) => {
    const label = getActionHumanLabel(action, payload);
    setActionAlert(`✨ TC-9: ${label}`);
    setTimeout(() => {
      setActionAlert(null);
    }, 4500);
  };

  return (
    <>
      {/* Floating Action Badge HUD in top corner when action is dispatched */}
      <AnimatePresence>
        {actionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-[9999] bg-[#0A2540] dark:bg-[#121212] text-white border border-[#BEB49B]/30 px-5 py-3.5 rounded shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center gap-3"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#BEB49B] animate-ping" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BEB49B]">AUTO PILOT GUIDING</span>
              <span className="text-xs font-mono font-medium">{actionAlert}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button (Bottom-Right, avoiding overlays) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => {
            setIsOpen(prev => !prev);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative group h-14 w-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(10,37,64,0.3)] border transition-all duration-300 ${
            isOpen 
              ? 'bg-[#4C2D3C] border-[#BEB49B]/40 text-white' 
              : 'bg-[#0A2540] dark:bg-[#BEB49B] border-[#0A2540]/10 text-[#F5F1E8] dark:text-[#0A2540]'
          }`}
          title="Ask TC-9 style AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#BEB49B] dark:bg-[#4C2D3C] rounded-full border-2 border-[#0A2540] dark:border-[#BEB49B] animate-pulse" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={
              isMinimized 
                ? { height: '52px', width: '260px', opacity: 1, y: 0, scale: 1 }
                : { height: '480px', width: 'min(350px, calc(100vw - 32px))', opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 bg-white dark:bg-[#0F0F0F] rounded-lg border border-[#0A2540]/15 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col max-h-[calc(100vh-140px)] overflow-hidden"
          >
            {/* Header branding */}
            <div className="px-4 py-3 bg-[#0A2540] dark:bg-[#151515] text-white flex items-center justify-between shrink-0 border-b border-[#BEB49B]/20">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="h-7 w-7 rounded-full bg-white dark:bg-[#1f1f1f] flex items-center justify-center border border-[#BEB49B]/30 select-none font-bold text-[10px] font-mono text-[#0A2540] dark:text-[#BEB49B]">
                    TC
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#8EA885] rounded-full border-2 border-[#0A2540] dark:border-[#151515]" />
                </div>
                <div>
                  <h3 id="bot-assistant-header-title" className="font-heading font-bold text-[11px] uppercase tracking-wider text-[#BEB49B] dark:text-amber-200">TC-Bot Assistant</h3>
                  <p id="bot-assistant-header-subtitle" className="text-[8px] font-mono text-white/55 dark:text-neutral-300">THRIFT AUTO PILOT</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(prev => !prev)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white cursor-pointer"
                  title={isMinimized ? "Restore chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Close chat"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Chat Body Components */}
            {!isMinimized && (
              <>
                {/* Scrollable logs area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F5F1E8]/10 dark:bg-black/20">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[88%] ${
                        msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div
                        className={`rounded px-3 py-2.5 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#0A2540] text-white dark:bg-[#BEB49B] dark:text-[#0A2540] rounded-br-none font-medium'
                            : 'bg-[#F2EDDF]/40 dark:bg-[#1a1a1a] text-[#111111] dark:text-neutral-200 border border-[#111111]/5 dark:border-white/5 rounded-bl-none'
                        }`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {/* Process simple bold markdown in messages */}
                        {msg.content.split('**').map((chunk, index) => 
                          index % 2 === 1 ? <strong key={index} className="font-bold text-[#4C2D3C] dark:text-white">{chunk}</strong> : chunk
                        )}
                      </div>

                      {/* Info message confirming pilot auto-action was taken */}
                      {msg.actionExecuted && (
                        <span className="text-[8px] font-mono font-bold tracking-wider text-[#A28F6E] dark:text-[#BEB49B]/70 uppercase mt-0.5">
                          ✓ Auto Guided: {msg.actionExecuted}
                        </span>
                      )}

                      <span className="text-[8px] font-mono text-[#111111]/30 dark:text-white/20 mt-0.5 uppercase">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}

                  {/* Typing State Indicator */}
                  {isLoading && (
                    <div className="self-start items-start flex flex-col max-w-[88%]">
                      <div className="rounded px-3 py-2 bg-[#F2EDDF]/20 dark:bg-[#151515] text-[10px] font-mono text-neutral-400 dark:text-neutral-500 rounded-bl-none border border-neutral-100 dark:border-white/5 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 animate-spin text-[#BEB49B]" />
                        <span>TC-9 style logs...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions segment */}
                <div className="border-t border-[#111111]/5 dark:border-white/5 px-3 py-2 bg-[#F5F1E8]/20 dark:bg-[#121212] select-none shrink-0 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar scroll-smooth">
                  {QUICK_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      disabled={isLoading}
                      onClick={() => handleSendMessage(sug.query)}
                      className="px-2.5 py-1 bg-white dark:bg-[#1e1e1e] hover:bg-[#0A2540] dark:hover:bg-[#BEB49B] hover:text-white dark:hover:text-[#0A2540] border border-[#0A2540]/10 dark:border-white/10 rounded-full text-[10px] font-mono font-medium text-[#0A2540] dark:text-neutral-300 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {sug.text}
                    </button>
                  ))}
                </div>

                {/* Input Controls Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                  className="p-2 border-t border-[#111111]/5 dark:border-white/10 flex items-center gap-1.5 bg-white dark:bg-[#0c0c0c] shrink-0"
                >
                  <input
                    type="text"
                    disabled={isLoading}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask TC-9 style queries or navigate..."
                    className="flex-1 bg-neutral-100 dark:bg-[#151515] border border-none rounded-sm px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#BEB49B] text-[#111111] dark:text-white outline-none placeholder-[#111111]/40 dark:placeholder-white/40 font-medium"
                    maxLength={350}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="h-8 w-8 shrink-0 bg-[#0A2540] dark:bg-[#BEB49B] text-white dark:text-[#0A2540] hover:bg-[#4C2D3C] dark:hover:bg-white rounded-sm flex items-center justify-center transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
