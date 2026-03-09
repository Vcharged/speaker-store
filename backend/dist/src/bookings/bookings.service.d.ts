import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
export declare class BookingsService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    createBooking(userId: string, productId: string, start: Date, end: Date): Promise<$Result.GetResult<import(".prisma/client").Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    findUserBookings(userId: string): $Public.PrismaPromise<T>;
    findAllBookings(): $Public.PrismaPromise<T>;
    updateStatus(bookingId: string, status: BookingStatus): Promise<$Result.GetResult<import(".prisma/client").Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    cancelBooking(userId: string, bookingId: string): Promise<$Result.GetResult<import(".prisma/client").Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    private notifyAdmin;
}
