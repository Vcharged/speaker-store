import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCategory } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(category?: string) {
    return this.prisma.product.findMany({
      where: category ? { category: { equals: category as ProductCategory } } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  create(data: { category: ProductCategory; brand: string; model: string; description: string; photoUrl?: string; price: number; isAvailable?: boolean; }) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: { category?: ProductCategory; brand?: string; model?: string; description?: string; photoUrl?: string; price?: number; isAvailable?: boolean; }) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
