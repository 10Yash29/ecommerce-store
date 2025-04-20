"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_CHATBOT_API ?? "https://chatbot-service-26z8.onrender.com";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! How can I help you with your football kit shopping today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // auto‑scroll to the latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // add user message
    const userMessage: Message = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error("Chatbot API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response ?? "Sorry, no response." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* FAB button */}
      {!isOpen && (
        <button
          aria-label="Open chat"
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-blue-600 p-4 text-white shadow-lg transition hover:bg-blue-700"
        >
          <MessageCircle />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="flex h-96 w-80 flex-col rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-lg bg-blue-600 p-4 text-white">
            <h3 className="font-semibold">Chat Support</h3>
            <button aria-label="Close chat" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "bot"
                    ? "mr-auto bg-gray-100"
                    : "ml-auto bg-blue-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="text-blue-600">
                <strong>Bot:</strong> Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 border-t p-4"
          >
            <input
              type="text"
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
