import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async register(registerDto: RegisterUserDto): Promise<{ message: string }> {
		// UsersService ja gestiona la comprovació de duplicats i el hashing
		await this.usersService.create(registerDto.username, registerDto.password);
		return { message: 'Usuari registrat correctament' };
	}

	async login(loginDto: LoginUserDto): Promise<{ access_token: string }> {
		const user = await this.usersService.findOneWithPassword(loginDto.username);
		if (!user) {
			throw new UnauthorizedException('Credencials invàlides');
		}

		// Aquesta crida obté la contrasenya hasheada de la BD (ja que no és `select: false` al model)
		// I la compara amb la contrasenya plana proporcionada
		const isPasswordValid = await this.usersService.validatePassword(
			loginDto.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Credencials invàlides');
		}

		// El payload del JWT hauria de ser lleuger i no contenir informació sensible
		const payload = { username: user.username, sub: String(user._id) };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
