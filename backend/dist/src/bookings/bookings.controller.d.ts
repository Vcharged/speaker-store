import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: {
        user: {
            id: string;
        };
    }, dto: CreateBookingDto): Promise<$Result.GetResult<import(".prisma/client").Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    myBookings(req: {
        user: {
            id: string;
        };
    }): $Public.PrismaPromise<T>;
    allBookings(): $Public.PrismaPromise<T>;
    updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<$Result.GetResult<import(".prisma/client").Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    cancel(id: string, req: {
        user: {
            id: string;
        };
    }): Promise<$Result.GetResult<import(".prisma/client").Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
}
