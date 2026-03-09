import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): import(".prisma/client").Prisma.Prisma__UserClient<any, null, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<any, null, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
        phone: string;
        role: Role;
    }): import(".prisma/client").Prisma.Prisma__UserClient<$Result.GetResult<import(".prisma/client").Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getProfile(id: string): import(".prisma/client").Prisma.Prisma__UserClient<any, null, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateProfile(id: string, data: {
        firstName?: string;
        lastName?: string;
        birthDate?: Date;
        phone?: string;
    }): import(".prisma/client").Prisma.Prisma__UserClient<$Result.GetResult<import(".prisma/client").Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
