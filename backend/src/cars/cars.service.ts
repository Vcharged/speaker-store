import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CarsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.car.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  create(data: Prisma.CarCreateInput) {
    return this.prisma.car.create({ data });
  }

  async update(id: string, data: Prisma.CarUpdateInput) {
    await this.findOne(id);
    return this.prisma.car.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.car.delete({ where: { id } });
  }

  async fetchExternalMakes(year = '2020', limit = 12) {
    const response = await fetch(
      `https://carapi.app/api/makes/v2?year=${encodeURIComponent(year)}`,
    );

    if (!response.ok) {
      throw new BadGatewayException('Failed to load external car data');
    }

    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data : [];
    return items.slice(0, Number(limit)).map((item: { id: number; name: string }) => ({
      id: item.id,
      name: item.name,
    }));
  }
}
