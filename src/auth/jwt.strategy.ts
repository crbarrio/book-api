import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // Per trobar l'usuari a la BD si cal

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private usersService: UsersService, // Opcional, si necessites carregar l'usuari complet
	) {
		const jwtSecret = configService.get<string>('JWT_SECRET');
		if (!jwtSecret) {
			throw new Error('JWT_SECRET is not defined');
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret, // Explicitly type as string
		});
	}
	// El mètode `validate` es crida un cop el token és decodificat i verificat
	async validate(payload: { username: string; sub: string }) {
		// `payload` és l'objecte que vam signar en el login: { username, sub: _id }
		// Aquí pots fer una comprovació addicional, com buscar l'usuari a la BD
		const user = await this.usersService.findOne(payload.username);
		if (!user) {
			throw new UnauthorizedException('Usuari no trobat o token invàlid.');
		}
		// Retornar l'usuari adjunta l'objecte d'usuari a `req.user`
		return user;
	}
}
