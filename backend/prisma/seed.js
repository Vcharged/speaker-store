const { PrismaClient, Role, ProductCategory } = require('@prisma/client');
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

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          category: ProductCategory.SPEAKER,
          brand: 'JBL',
          model: 'Flip 6',
          description: 'Портативная Bluetooth-колонка с мощным звуком и водонепроницаемостью.',
          photoUrl: '',
          price: 8999,
          isAvailable: true,
        },
        {
          category: ProductCategory.SPEAKER,
          brand: 'Sony',
          model: 'SRS-XB33',
          description: 'Мощная беспроводная колонка с EXTRA BASS и подсветкой.',
          photoUrl: '',
          price: 12999,
          isAvailable: true,
        },
        {
          category: ProductCategory.SPEAKER,
          brand: 'Bose',
          model: 'SoundLink Revolve',
          description: '360° звук с глубокими басами и впечатляющей громкостью.',
          photoUrl: '',
          price: 15999,
          isAvailable: true,
        },
        {
          category: ProductCategory.INSTRUMENT,
          brand: 'Yamaha',
          model: 'F310',
          description: 'Акустическая гитара для начинающих с теплым звуком.',
          photoUrl: '',
          price: 7999,
          isAvailable: true,
        },
        {
          category: ProductCategory.INSTRUMENT,
          brand: 'Fender',
          model: 'Stratocaster',
          description: 'Легендарная электрогитара для рока и блюза.',
          photoUrl: '',
          price: 45999,
          isAvailable: true,
        },
        {
          category: ProductCategory.INSTRUMENT,
          brand: 'Casio',
          model: 'CTK-3500',
          description: 'Цифровое пианино с 61 клавишей и обучающими функциями.',
          photoUrl: '',
          price: 11999,
          isAvailable: true,
        },
        {
          category: ProductCategory.INSTRUMENT,
          brand: 'Roland',
          model: 'TD-17KV',
          description: 'Электронная ударная установка с реалистичным звучанием.',
          photoUrl: '',
          price: 89999,
          isAvailable: true,
        },
        {
          category: ProductCategory.SPEAKER,
          brand: 'Marshall',
          model: 'Acton II',
          description: 'Классическая колонка с винтажным дизайном и мощным звуком.',
          photoUrl: '',
          price: 24999,
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
