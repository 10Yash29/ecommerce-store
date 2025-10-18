# Frontend Integration Guide

How to integrate FootyBot chatbot into your Next.js e-commerce store.

## 🎯 Quick Start

The chatbot component has been updated in `/ecommerce-store/components/Chatbot.tsx` with all the improvements.

## ✅ What's Been Done

### 1. **Enhanced Chatbot Component** (`Chatbot.tsx`)

New features:

- ✨ Modern UI with gradients and animations
- 🎯 Quick action buttons for common queries
- 💬 Message timestamps and IDs
- 🔄 Reset conversation button
- 📊 Confidence indicators
- 🎨 Loading animations
- ⚠️ Error handling with user feedback
- 🔐 User authentication support (Clerk)

### 2. **Environment Configuration**

Added to `ecommerce-store/.env`:

```env
NEXT_PUBLIC_CHATBOT_API=https://chatbot-service-26z8.onrender.com/chatbot
```

## 📦 Installation

The chatbot is already integrated! Just ensure you have the required dependencies:

```bash
cd ecommerce-store
npm install lucide-react @clerk/nextjs
```

## 🚀 Usage

### Basic Usage

The chatbot is a floating action button (FAB) that appears in the bottom-right corner:

```tsx
import Chatbot from "@/components/Chatbot";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
```

### Current Integration

The chatbot is already added to your main layout:

**File:** `/ecommerce-store/app/layout.tsx`

```tsx
import Chatbot from "@/components/Chatbot";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Chatbot /> {/* Already integrated */}
      </body>
    </html>
  );
}
```

## 🎨 Customization

### Change Colors

Edit the gradient colors in `Chatbot.tsx`:

```tsx
// Header gradient
className = "bg-gradient-to-r from-blue-600 to-blue-700";

// Change to your brand colors
className = "bg-gradient-to-r from-purple-600 to-pink-600";
```

### Modify Quick Actions

```tsx
const QUICK_ACTIONS = [
  "Track my order",
  "Return policy",
  "Size guide",
  "Shipping info",
  // Add your own:
  "Latest deals",
  "Gift cards",
];
```

### Adjust Chatbot Position

```tsx
// Current: bottom-right
<div className="fixed bottom-4 right-4 z-50">

// Bottom-left
<div className="fixed bottom-4 left-4 z-50">

// Top-right
<div className="fixed top-4 right-4 z-50">
```

### Change Welcome Message

```tsx
const INITIAL_MESSAGES: Message[] = [
  {
    sender: "bot",
    text: "Your custom welcome message here! 👋",
    timestamp: new Date(),
    id: "initial",
  },
];
```

## 🔌 API Configuration

### Development

```env
NEXT_PUBLIC_CHATBOT_API=http://localhost:8000/chatbot
```

### Production

```env
NEXT_PUBLIC_CHATBOT_API=https://your-chatbot-service.onrender.com/chatbot
```

### Multiple Environments

Create environment files:

**`.env.local`** (Development)

```env
NEXT_PUBLIC_CHATBOT_API=http://localhost:8000/chatbot
```

**`.env.production`** (Production)

```env
NEXT_PUBLIC_CHATBOT_API=https://footybot.onrender.com/chatbot
```

## 🎭 Features Overview

### 1. **Floating Action Button (FAB)**

- Always visible in bottom-right
- Pulse animation to grab attention
- Online indicator (green dot)

### 2. **Chat Window**

- Clean, modern design
- 600px height, 384px width
- Scrollable message area
- Rounded corners and shadows

### 3. **Quick Actions**

- Shows on first load
- Pre-defined common questions
- One-click to ask

### 4. **Message Types**

- User messages (blue gradient, right-aligned)
- Bot messages (white, left-aligned)
- Error messages (red background)
- Loading indicator (bouncing dots)

### 5. **Smart Features**

- Auto-scroll to latest message
- Confidence indicators
- Message validation (max 500 chars)
- Keyboard shortcuts (Enter to send)
- Reset conversation

## 🧪 Testing

### Test Locally

1. **Start the chatbot service:**

   ```bash
   cd ml-service/ecommerce-chatbot-service
   source venv/bin/activate
   python3 app.py
   ```

2. **Start the frontend:**

   ```bash
   cd ecommerce-store
   npm run dev
   ```

3. **Open browser:**
   - Go to `http://localhost:3000`
   - Click the chat button (bottom-right)
   - Try asking questions

### Test Questions

- "What products do you sell?"
- "What is your return policy?"
- "Do you ship internationally?"
- "How can I track my order?"
- "Tell me about your size guide"

## 🐛 Troubleshooting

### Chatbot doesn't appear

**Check:**

1. Is `<Chatbot />` in your layout?
2. Is `lucide-react` installed?
3. Check browser console for errors

**Solution:**

```bash
npm install lucide-react
```

### "Connection error" message

**Check:**

1. Is the chatbot service running?
2. Is the API URL correct in `.env`?
3. CORS configured properly?

**Test API:**

```bash
curl http://localhost:8000/
```

### CORS errors in browser

**Backend Fix:**
Update `FRONTEND_URL` in chatbot service `.env`:

```env
FRONTEND_URL=http://localhost:3000
```

**Or allow all origins (dev only):**

```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

### Messages not sending

**Check:**

1. Network tab in browser DevTools
2. Request payload is correct
3. API endpoint returns 200

**Debug:**

```tsx
// Add console logs in Chatbot.tsx
const res = await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: textToSend, userId }),
});
console.log("Response:", res.status, await res.json());
```

## 🎨 UI Components Used

The chatbot uses these Lucide React icons:

- `MessageCircle` - Chat button icon
- `X` - Close button
- `Send` - Send message button
- `ThumbsUp` / `ThumbsDown` - Future feedback feature

Install if missing:

```bash
npm install lucide-react
```

## 📱 Mobile Responsiveness

The chatbot is mobile-friendly:

- Responsive width (96 = 384px on desktop)
- Touch-friendly buttons
- Scrollable on small screens

### Adjust for mobile:

```tsx
// Make chat window full-screen on mobile
<div className="flex h-[600px] w-96 md:w-96 sm:w-full sm:h-full ...">
```

## 🔐 Authentication Integration

The chatbot integrates with Clerk authentication:

```tsx
import { useAuth } from "@clerk/nextjs";

const { userId } = useAuth();

// Sends userId with each request
body: JSON.stringify({ message: textToSend, userId });
```

This allows personalized responses based on user data.

## 📊 Analytics Integration

### Add Google Analytics

```tsx
// Track chat opens
const handleOpen = () => {
  setIsOpen(true);
  gtag("event", "chatbot_open");
};

// Track messages sent
const handleSend = () => {
  // ... existing code
  gtag("event", "chatbot_message", {
    message_length: textToSend.length,
  });
};
```

### Add custom analytics

```tsx
const logChatEvent = (event: string, data?: any) => {
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify({ event, data }),
  });
};
```

## 🚀 Advanced Features

### 1. **Conversation History**

Save conversations to localStorage:

```tsx
useEffect(() => {
  const saved = localStorage.getItem("chatHistory");
  if (saved) {
    setMessages(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem("chatHistory", JSON.stringify(messages));
}, [messages]);
```

### 2. **Typing Indicator**

Already implemented with bouncing dots animation!

### 3. **Message Feedback**

Add thumbs up/down to messages:

```tsx
const sendFeedback = async (messageId: string, rating: number) => {
  await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageId, rating }),
  });
};
```

### 4. **Rich Media Responses**

Support for images, links, etc:

```tsx
type Message = {
  sender: "user" | "bot";
  text: string;
  type?: "text" | "image" | "link";
  metadata?: any;
};
```

## 📚 Resources

- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk Auth](https://clerk.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 🎯 Next Steps

1. **Test the chatbot** on your live site
2. **Customize colors** to match your brand
3. **Add more quick actions** for your use case
4. **Monitor usage** and improve responses
5. **Collect feedback** from users

---

**Need help? Check the main README or open an issue!** 🚀
