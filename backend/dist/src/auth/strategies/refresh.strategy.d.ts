import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const RefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshStrategy extends RefreshStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
}
export {};
