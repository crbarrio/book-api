import {
	Controller,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticació') // Agrupa les rutes a Swagger
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

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
