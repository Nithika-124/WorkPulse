import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, MessageCircle, Zap } from "lucide-react";

import { User } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { Avatar } from "../components/Avatar";
import { styles } from "../constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  thinking?: string;
  isLoading?: boolean;
}

const QUICK_PROMPTS = [
  "What's the team's overall performance this week?",
  "Show me who has blockers",
  "Generate a team report summary",
  "What projects are behind schedule?",
  "Who has logged the most hours?"
];

interface AIChatPageProps {
  user: User;
}

export default function AIChatPage({ user }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Hi! I'm your team insights assistant. I can help you analyze team performance, generate reports, and identify blockers. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const loadingMessage: Message = {
        id: `loading-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        thinking: "Analyzing your request...",
        isLoading: true
      };
      setMessages(prev => [...prev, loadingMessage]);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: `response-${Date.now()}`,
        role: "assistant",
        content: generateResponse(text),
        timestamp: new Date()
      };

      setMessages(prev => prev.slice(0, -1).concat(assistantMessage));
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const generateResponse = (prompt: string): string => {
    const lower = prompt.toLowerCase();

    if (lower.includes("performance") || lower.includes("team")) {
      return `Based on the latest analytics:\n\n**Team Performance**\n• Submission Compliance: 60% (3 of 5 team members)\n• Total Hours: 160h this week\n• Tasks Completed: 38 across team\n• Open Blockers: 2 items need attention\n\nTop performers this week:\n1. Sofia Reyes - 44 hours, 10 tasks\n2. Nadia Okafor - 42 hours, 11 tasks\n3. Marcus Chen - 38 hours, 7 tasks`;
    } else if (lower.includes("blocker")) {
      return `**Active Blockers**\n\n1. **Sofia Reyes** - "GPU quota limit on cloud provider"\n   Project: R&D\n   Status: In progress\n   Impact: High - blocking ML model benchmarking\n\n2. **James Osei** - "Unclear brief from stakeholders"\n   Project: Marketing\n   Status: Pending response\n   Impact: Medium - waiting on clarification`;
    } else if (lower.includes("report")) {
      return `**Weekly Team Summary - Jun 30 to Jul 6, 2026**\n\nTasks Completed: 38 items across 3 projects\nHours Logged: 160 hours\nSubmission Rate: 60%\n\nProject Breakdown:\n• Client Portal: 15 tasks completed, good progress\n• Internal Tooling: 12 tasks, pipeline improvements\n• R&D: 10 tasks, positive early results\n• Marketing: 1 task, behind on deliverables\n\nRecommendations:\n- Follow up with James Osei on Marketing project\n- Support Sofia's team on GPU resource allocation`;
    } else if (lower.includes("schedule") || lower.includes("behind")) {
      return `**Projects Behind Schedule**\n\n⚠️ **Marketing Project** - 20% complete (Due: Jul 31)\n• Current Lead: James Osei\n• Issue: Unclear stakeholder brief\n• Action: Schedule clarification meeting\n• Impact: Timeline at risk\n\n**Other Projects Status**\n✓ Client Portal - 78% complete (on track)\n✓ Internal Tooling - 55% complete (on track)\n✓ R&D - 30% complete (on track)\n\nOverall: 3 of 4 projects are on track.`;
    } else if (lower.includes("hours") || lower.includes("logged")) {
      return `**Hours Logged This Week**\n\n1. Sofia Reyes - 44 hours (R&D)\n2. Nadia Okafor - 42 hours (Client Portal)\n3. Priya Nair - 36 hours (QA)\n4. Marcus Chen - 38 hours (Internal Tooling)\n5. James Osei - 0 hours (Marketing) ⚠️\n\n**Team Average**: 32 hours/person\n**Total**: 160 hours\n\nJames' absence is notable and correlates with the Marketing project being behind schedule.`;
    } else {
      return `I can help you with:\n• Team performance analytics\n• Project status and blockers\n• Individual member reports\n• Hours and productivity trends\n• Report summaries and exports\n\nTry asking about team performance, blockers, or specific projects!`;
    }
  };

  return (
    <PageWrap pageKey="chat">
      <SectionHeader 
        title="AI Assistant" 
        subtitle="Get insights about your team with natural language queries"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-[calc(100vh-300px)]">
        <div className="lg:col-span-3 flex flex-col">
          <div className={`${styles.glass} rounded-2xl flex-1 overflow-hidden flex flex-col`}>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence mode="wait">
                {messages.map((message, i) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#4f7bff]/20 flex items-center justify-center">
                        <Zap size={16} style={{ color: "#4f7bff" }} />
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <Avatar name="You" size="sm" />
                      </div>
                    )}

                    <div className={`flex-1 max-w-[70%] ${message.role === "user" ? "text-right" : ""}`}>
                      {message.thinking && (
                        <div className="text-[11px] text-white/40 italic mb-1 flex items-center gap-1">
                          <Loader2 size={12} className="animate-spin" />
                          {message.thinking}
                        </div>
                      )}
                      {message.isLoading ? (
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full bg-white/40 animate-pulse"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                            message.role === "user"
                              ? "bg-[#4f7bff]/20 text-white"
                              : "bg-white/[0.05] text-white/80"
                          }`}
                        >
                          {message.content}
                        </div>
                      )}
                      <div className="text-[10px] text-white/30 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/[0.08] p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about team performance, blockers, projects..."
                  disabled={loading}
                  className={`${styles.inputCls} flex-1 text-sm`}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#4f7bff] hover:bg-[#4f7bff]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={`${styles.glass} rounded-2xl p-5`}>
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <MessageCircle size={14} />
              Quick Prompts
            </h3>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-[12px] text-white/70 hover:text-white/90 transition-all text-wrap disabled:opacity-50"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>

            <div className={`${styles.glass} rounded-xl p-3 mt-5 text-[11px] text-white/40`}>
              <p className="font-semibold text-white/60 mb-2">💡 Tips</p>
              <ul className="space-y-1 text-white/35">
                <li>• Ask about team performance</li>
                <li>• Query specific projects</li>
                <li>• Find blockers and issues</li>
                <li>• Generate summaries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
