export class AuthCheckDto {
    readonly isAuthenticated: boolean;
    readonly role?: string;
    readonly email?: string;
    readonly message?: string;
} 