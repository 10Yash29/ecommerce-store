import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';

export async function POST(req: Request) {
    try {
        const { userId, productId, interactionType } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
        }

        // Create a record in the shared DB
        const interaction = await prisma.userProductInteraction.create({
            data: {
                userId,
                productId,
                interactionType, // e.g. 'view', 'purchase'
            },
        });

        return NextResponse.json(interaction, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
