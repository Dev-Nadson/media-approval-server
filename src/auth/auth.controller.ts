import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signin')
    async signin(@Body() body: { email: string, password: string }) {
        return { message: 'logado' }
    }

    @Post('refresh')
    async refresh(@Body() body: { email: string, password: string }) {
        return { message: 'refresh' }
    }

    @Post('signout')
    async signout(@Body() body: { email: string, password: string }) {
        return { message: 'signout' }
    }
}
