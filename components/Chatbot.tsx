"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hi! How can I help you with your football kit shopping today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    // Add the user message to state
    const userMessage = { sender: 'user', text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);

    // Clear the input and set loading
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput })
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
          aria-label="Open chat"
        >
          <MessageCircle />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat Support</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === 'bot' 
                    ? 'bg-gray-100 mr-auto' 
                    : 'bg-blue-100 ml-auto'
                } p-3 rounded-lg max-w-[80%]`}
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

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                disabled={isLoading}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
