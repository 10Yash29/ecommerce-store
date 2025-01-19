import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Clerk's server-side auth
import prismadb from "@/lib/prismadb"; // Your Prisma client

export async function POST(req: Request) {
    try {
        // 1. Get user ID from Clerk (server side)
        const { userId } = await auth(); // Add 'await' to get the userId
        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        // 2. Parse the JSON body to get the productId (from the client)
        const body = await req.json();
        const { productId } = body;
        if (!productId) {
            return NextResponse.json({ message: "No productId provided" }, { status: 400 });
        }

        // 3. Create "cart-add" interaction in your DB
        await prismadb.userProductInteraction.create({
            data: {
                userId,
                productId,
                interactionType: "cart-add", // or any string you prefer
            },
        });

        // 4. Return success
        return NextResponse.json({ message: "Cart-add interaction recorded" });
    } catch (error) {
        console.error("INTERACTIONS_POST_ERROR", error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}
