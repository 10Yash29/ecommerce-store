import { ClerkProvider } from "@clerk/nextjs";
import { Urbanist } from "next/font/google";
import "./globals.css";
import React from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";

const font = Urbanist({ subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/footy.svg" type="image/x-icon" />
            <title>Footy Trends</title>
            <meta name="description" content="Footy Trends - Shop the latest football merchandise and jerseys from top clubs!" />
        </head>
        <body className={font.className}>
        <ClerkProvider
            afterSignOutUrl="/"
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <ModalProvider />
            <ToastProvider />
            <Navbar />
            {children}
            <Footer />
        </ClerkProvider>
        </body>
        </html>
    );
}
