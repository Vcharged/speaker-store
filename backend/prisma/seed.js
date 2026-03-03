const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

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
        role: Role.ADMIN,
        firstName: 'Admin',
        lastName: 'User',
        birthDate: new Date('1990-01-01'),
        phone: '+10000000000',
      },
    });
  } else if (existing.role !== Role.ADMIN) {
    await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN },
    });
  }

  const carCount = await prisma.car.count();
  if (carCount === 0) {
    await prisma.car.createMany({
      data: [
        {
          brand: 'Tesla',
          model: 'Model 3',
          color: 'White',
          description: 'Electric sedan with autopilot and premium interior.',
          photoUrl: '',
          pricePerDay: 120,
          isAvailable: true,
        },
        {
          brand: 'BMW',
          model: 'X5',
          color: 'Black',
          description: 'Luxury SUV with panoramic roof and driver assist.',
          photoUrl: '',
          pricePerDay: 150,
          isAvailable: true,
        },
        {
          brand: 'Audi',
          model: 'A4',
          color: 'Silver',
          description: 'Comfortable sedan with smooth ride and great handling.',
          photoUrl: '',
          pricePerDay: 110,
          isAvailable: true,
        },
        {
          brand: 'Mercedes-Benz',
          model: 'C-Class',
          color: 'Blue',
          description: 'Elegant sedan with premium finishes.',
          photoUrl: '',
          pricePerDay: 140,
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
