import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
    prisma?: PrismaClient;
};

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Named export
export default prisma; // Add a default export for convenience
