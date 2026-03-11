import {
	Controller,
	Post,
	Get,
	Body,
	Req,
	HttpCode,
	HttpStatus,
	UsePipes,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

interface GoogleAuthUser {
	email: string;
	firstName?: string;
	lastName?: string;
	picture?: string;
	googleId: string;
}

interface GoogleAuthRequest extends Request {
	user: GoogleAuthUser;
}

@ApiTags('Autenticació') // Agrupa les rutes a Swagger
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('google')
	@UseGuards(AuthGuard('google')) // Utilitza la GoogleStrategy per aquesta ruta
	@ApiOperation({ summary: 'Inicia sessió amb Google' })
	@ApiResponse({ status: 302, description: 'Redirecció cap a Google OAuth' })
	@ApiResponse({ status: 401, description: 'No autoritzat' })
	googleAuth(): void {
		// Aquesta ruta redirigirà a Google per iniciar sessió
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	@ApiOperation({ summary: "Callback d'autenticació amb Google" })
	@ApiResponse({
		status: 200,
		description: 'Login correcte amb Google i emissió de JWT',
		schema: { example: { access_token: 'eyJhbGciOiJIUzI1Ni...' } },
	})
	@ApiResponse({ status: 401, description: 'No autoritzat' })
	@HttpCode(HttpStatus.OK)
	async googleAuthCallback(@Req() req: GoogleAuthRequest) {
		return this.authService.googleLogin(req.user);
	}

	@Post('register')
	@ApiOperation({ summary: 'Registra un nou usuari' })
	@ApiBody({ type: RegisterUserDto })
	@ApiResponse({ status: 201, description: 'Usuari registrat correctament' })
	@ApiResponse({ status: 409, description: `Nom d'usuari ja existent` })
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	)
	async register(@Body() registerDto: RegisterUserDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	@ApiOperation({ summary: 'Inicia sessió i obté un JWT' })
	@ApiBody({ type: LoginUserDto })
	@ApiResponse({
		status: 200,
		description: 'Login correcte',
		schema: { example: { access_token: 'eyJhbGciOiJIUzI1Ni...' } },
	})
	@ApiResponse({ status: 401, description: 'Credencials invàlides' })
	@HttpCode(HttpStatus.OK) // Retorna explícitament 200 OK
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	)
	async login(@Body() loginDto: LoginUserDto) {
		return this.authService.login(loginDto);
	}
}
