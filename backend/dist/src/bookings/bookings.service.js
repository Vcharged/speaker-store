"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async createBooking(userId, productId, start, end) {
        if (end <= start) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.isAvailable) {
            throw new common_1.BadRequestException('Product is not available');
        }
        const conflict = await this.prisma.booking.findFirst({
            where: {
                productId,
                status: { in: ['PENDING', 'CONFIRMED'] },
                AND: [
                    { startDate: { lte: end } },
                    { endDate: { gte: start } },
                ],
            },
        });
        if (conflict) {
            throw new common_1.BadRequestException('Product is already booked for these dates');
        }
        const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        const totalPrice = days * product.price;
        return this.prisma.booking.create({
            data: {
                userId,
                productId,
                startDate: start,
                endDate: end,
                totalPrice,
                status: client_1.BookingStatus.PENDING,
            },
        });
    }
    findUserBookings(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { startDate: 'desc' },
        });
    }
    findAllBookings() {
        return this.prisma.booking.findMany({
            include: { product: true, user: true },
            orderBy: { startDate: 'desc' },
        });
    }
    async updateStatus(bookingId, status) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { product: true, user: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status },
        });
        const statusIcon = status === client_1.BookingStatus.PAID ? '💳' : '✅';
        await this.notifyAdmin(`*Booking updated* ${statusIcon}\n*Booking ID:* ${booking.id}\n*Product:* ${booking.product.brand} ${booking.product.model}\n*User:* ${booking.user.email}\n*Phone:* ${booking.user.phone || 'Unknown'}\n*Status:* ${status}`);
        return updated;
    }
    async cancelBooking(userId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { product: true, user: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('Not allowed to cancel this booking');
        }
        if (booking.status === client_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking already cancelled');
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
        await this.notifyAdmin(`*Booking cancelled* ❌\n*Booking ID:* ${booking.id}\n*Product:* ${booking.product.brand} ${booking.product.model}\n*User:* ${booking.user.email}\n*Phone:* ${booking.user.phone || 'Unknown'}`);
        return updated;
    }
    async notifyAdmin(message) {
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        const chatId = this.configService.get('TELEGRAM_ADMIN_CHAT');
        if (!token || !chatId) {
            return;
        }
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
            });
        }
        catch {
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map