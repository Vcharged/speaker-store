import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
