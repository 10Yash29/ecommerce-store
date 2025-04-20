import { ClerkProvider } from "@clerk/nextjs";
import { Urbanist } from "next/font/google";
import "./globals.css";
import React from "react";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/Chatbot";

const font = Urbanist({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    display: "swap",
});

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk publishable key. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment variables.");
}

function ErrorFallback({ error }: { error: Error }) {
    return (
        <div role="alert" className="flex justify-center items-center h-screen">
            <p className="text-xl font-bold text-red-500">Something went wrong!</p>
            <pre className="text-sm">{error.message}</pre>
        </div>
    );
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={process.env.NEXT_PUBLIC_DEFAULT_LANG || "en"} className={font.className}>
        <head>
            <link rel="icon" href="/footy.svg" type="image/x-icon" className={'rounded-full'} />
            <title>Footy Trends</title>
            <meta name="description" content="Footy Trends - Shop the latest football merchandise and jerseys from top clubs!" />
            <meta property="og:title" content="Footy Trends" />
            <meta property="og:description" content="Shop the latest football merchandise and jerseys from top clubs!" />
            <meta property="og:image" content="/path/to/social-preview.jpg" />
            <meta property="og:url" content="https://footytrends.com" />
            <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body>

            <ClerkProvider
                afterSignOutUrl="/"
                publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            >
                <ModalProvider />
                <ToastProvider />
                <Navbar />
                {children}
                <Chatbot/>
                <Footer />
            </ClerkProvider>

        </body>
        </html>
    );
}
