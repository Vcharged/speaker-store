import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createBooking(userId: string, carId: string, start: Date, end: Date) {
    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (!car.isAvailable) {
      throw new BadRequestException('Car is not available');
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        carId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        AND: [
          { startDate: { lte: end } },
          { endDate: { gte: start } },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Car is already booked for these dates');
    }

    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * car.pricePerDay;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        carId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: BookingStatus.PENDING,
      },
    });

    await this.notifyAdmin(
      `*New booking* 🚗\n*Booking ID:* ${booking.id}\n*Car:* ${car.brand} ${car.model}\n*User:* ${user?.email || 'Unknown'}\n*Phone:* ${user?.phone || 'Unknown'}\n*Dates:* ${start.toDateString()} - ${end.toDateString()}\n*Total:* $${totalPrice}\n*Status:* PENDING`,
    );

    return booking;
  }

  findUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { car: true },
      orderBy: { startDate: 'desc' },
    });
  }

  findAllBookings() {
    return this.prisma.booking.findMany({
      include: { car: true, user: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async updateStatus(bookingId: string, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    const statusIcon = status === BookingStatus.PAID ? '💳' : '✅';
    await this.notifyAdmin(
      `*Booking updated* ${statusIcon}\n*Booking ID:* ${booking.id}\n*Car:* ${booking.car.brand} ${booking.car.model}\n*User:* ${booking.user.email}\n*Phone:* ${booking.user.phone || 'Unknown'}\n*Status:* ${status}`,
    );

    return updated;
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId !== userId) {
      throw new ForbiddenException('Not allowed to cancel this booking');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking already cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    await this.notifyAdmin(
      `*Booking cancelled* ❌\n*Booking ID:* ${booking.id}\n*Car:* ${booking.car.brand} ${booking.car.model}\n*User:* ${booking.user.email}\n*Phone:* ${booking.user.phone || 'Unknown'}`,
    );

    return updated;
  }

  private async notifyAdmin(message: string) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_ADMIN_CHAT');
    if (!token || !chatId) {
      return;
    }

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
      });
    } catch {
      // Notification failures should not block the request.
    }
  }
}
