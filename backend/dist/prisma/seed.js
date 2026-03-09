"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = process.env.ADMIN_SEED_EMAIL;
    const password = process.env.ADMIN_SEED_PASSWORD;
    if (!email || !password) {
        throw new Error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required');
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
        const hash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hash,
                role: 'ADMIN',
                firstName: 'Admin',
                lastName: 'User',
                birthDate: new Date('1990-01-01'),
                phone: '+10000000000',
            },
        });
    }
    else if (existing.role !== 'ADMIN') {
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
    }
    const productCount = await prisma.product.count();
    if (productCount === 0) {
        await prisma.product.createMany({
            data: [
                {
                    category: 'SPEAKER',
                    brand: 'JBL',
                    model: 'Charge 5',
                    description: 'Portable Bluetooth speaker with deep bass.',
                    photoUrl: '',
                    price: 12000,
                    isAvailable: true,
                },
                {
                    category: 'INSTRUMENT',
                    brand: 'Yamaha',
                    model: 'P-125',
                    description: 'Digital piano with authentic feel.',
                    photoUrl: '',
                    price: 45000,
                    isAvailable: true,
                },
                {
                    category: 'SPEAKER',
                    brand: 'Sony',
                    model: 'SRS-XB43',
                    description: 'Extra bass wireless speaker.',
                    photoUrl: '',
                    price: 15000,
                    isAvailable: true,
                },
                {
                    category: 'INSTRUMENT',
                    brand: 'Fender',
                    model: 'Stratocaster',
                    description: 'Legendary electric guitar.',
                    photoUrl: '',
                    price: 70000,
                    isAvailable: true,
                },
            ],
        });
    }
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map