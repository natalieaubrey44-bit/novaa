import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Landmark,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "assistant",
      text: "Hello! Welcome to NovaaSecure Support. How can we assist you with your accounts, transfers, or card settings today?",
      time: "12:00 PM",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate instant secure banking coordinator response
    setTimeout(() => {
      const lower = userMsg.text.toLowerCase();
      let replyText =
        "Thank you for contacting Novaa Private Banking. A certified financial expert has been assigned to your query and will contact you shortly.";

      if (
        lower.includes("balance") ||
        lower.includes("money") ||
        lower.includes("checking")
      ) {
        replyText =
          "You can view each of your vault checking and high-yield savings balances directly on the Dashboard. Our current High-Yield Savings offers a top-tier 4.85% APY.";
      } else if (
        lower.includes("transfer") ||
        lower.includes("payment") ||
        lower.includes("send")
      ) {
        replyText =
          "To initiate a transfer, select 'Transfers & Payments' from the dashboard sidebar. You can execute high-security external wire transfers instantly.";
      } else if (
        lower.includes("freeze") ||
        lower.includes("card") ||
        lower.includes("lock")
      ) {
        replyText =
          "If your card is misplaced, select the 'Cards & Limits' tab. You can instantly freeze physical card networks or modify daily spending caps with a single tap.";
      } else if (
        lower.includes("security") ||
        lower.includes("mfa") ||
        lower.includes("safe")
      ) {
        replyText =
          "Novaa secures all transactions using advanced multi-factor checkups, military-grade end-to-end tokenization, and automatic 15-minute inactive logs.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: "assistant",
          text: replyText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-brand-accent/90 transition-colors border border-white/20"
          id="live-chat-bubble"
          aria-label="Open live chat"
        >
          <MessageSquare size={26} />
        </motion.button>
      </div>

      {/* Expanded Live Chat Console Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className={`fixed z-50 bg-white dark:bg-brand-secondary transition-colors flex flex-col shadow-2xl border border-brand-secondary/40 overflow-hidden
              ${
                /* Mobile: covers whole screen. Desktop: covers small portion of screen */
                "inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-96 md:h-130 md:rounded-3xl"
              }`}
            id="live-chat-panel"
          >
            {/* Header Unit */}
            <div className="bg-brand-secondary py-4 px-5 flex items-center justify-between border-b border-brand-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-brand-secondary transition-colors flex items-center justify-center text-brand-primary dark:text-white shadow-sm border border-brand-secondary/40">
                  <Landmark size={20} className="text-brand-primary dark:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-accent tracking-tight">
                    Novaa Live Support
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                    <span className="text-[10px] font-semibold text-brand-accent">
                      Always Secure
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-brand-accent/15 text-brand-accent transition-colors"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Security Notice strip */}
            <div className="bg-brand-muted dark:bg-brand-surface transition-colors px-4 py-2 border-b border-brand-secondary/20 flex items-center gap-2 text-[10px] text-brand-accent">
              <ShieldCheck size={14} className="text-brand-accent" />
              <span>
                Answers are encrypted and private. We will never ask for PINs.
              </span>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-muted dark:bg-brand-surface transition-colors">
              {messages.map((msg) => {
                const isAsst = msg.sender === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAsst ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm border ${
                        isAsst
                          ? "bg-white dark:bg-brand-secondary transition-colors text-brand-accent border-brand-secondary/40 rounded-tl-none"
                          : "bg-brand-accent text-white border-brand-accent/20 rounded-tr-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${isAsst ? "text-brand-primary/50" : "text-white/70"}`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-brand-secondary transition-colors text-brand-primary dark:text-white border border-brand-secondary/40 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Unit */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-brand-secondary transition-colors border-t border-brand-secondary/30 flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask our support anything secure..."
                className="flex-1 px-4 py-2.5 bg-brand-muted dark:bg-brand-surface transition-colors border border-brand-secondary/40 rounded-xl text-xs text-brand-accent placeholder-brand-primary/30 focus:outline-none focus:border-brand-accent"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                aria-label="Send message"
                className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
