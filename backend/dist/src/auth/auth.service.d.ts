import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            birthDate: Date;
            phone: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            birthDate: Date;
            phone: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    private signTokens;
    private sanitizeUser;
}
