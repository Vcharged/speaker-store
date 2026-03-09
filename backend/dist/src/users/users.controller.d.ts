import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: {
        user: {
            id: string;
            email: string;
            role: string;
        };
    }): import(".prisma/client").Prisma.Prisma__UserClient<any, null, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(req: {
        user: {
            id: string;
        };
    }, dto: UpdateProfileDto): import(".prisma/client").Prisma.Prisma__UserClient<$Result.GetResult<import(".prisma/client").Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
