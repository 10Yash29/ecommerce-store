// store/app/api/productsByIds/route.ts
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json([], { status: 200 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error in productsByIds API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
