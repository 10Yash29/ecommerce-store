"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { MessageCircle, X, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
  id?: string;
  confidence?: "high" | "low";
};

const API_URL =
  process.env.NEXT_PUBLIC_CHATBOT_API ?? "https://one0yash29-ecommerce-recommendation-v1nt.onrender.com/chatbot";

const INITIAL_MESSAGES: Message[] = [
  {
    sender: "bot",
    text: "Hi! I'm FootyBot 👋 How can I help you with your football kit shopping today?",
    timestamp: new Date(),
    id: "initial",
  },
];

const QUICK_ACTIONS = [
  "Track my order",
  "Return policy",
  "Size guide",
  "Shipping info",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  // Auto-scroll to latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend(messageText?: string) {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, userId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        sender: "bot",
        text: data.response ?? "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
        id: Date.now().toString(),
        confidence: data.confidence,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setError("Connection error. Please try again.");

      const errorMessage: Message = {
        sender: "bot",
        text: "I'm having trouble connecting right now. Please try again or contact support@footytrends.com",
        timestamp: new Date(),
        id: Date.now().toString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuickAction(action: string) {
    handleSend(action);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setMessages(INITIAL_MESSAGES);
    setError(null);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* FAB button */}
      {!isOpen && (
        <button
          aria-label="Open chat"
          onClick={() => setIsOpen(true)}
          className="group relative rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="flex h-[600px] w-96 flex-col rounded-2xl bg-white shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  ⚽
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold">FootyBot</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                aria-label="Reset conversation"
                onClick={handleReset}
                className="hover:bg-white/20 rounded p-1 transition"
                title="Reset conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded p-1 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-3 bg-blue-50 border-b border-blue-100">
              <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-1.5 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 space-y-4 overflow-y-auto p-4 bg-gray-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === "bot"
                      ? "bg-white shadow-sm border border-gray-200"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.confidence === "low" && msg.sender === "bot" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Try asking about products, shipping, or returns
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 border-t bg-white p-4 rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              maxLength={500}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
