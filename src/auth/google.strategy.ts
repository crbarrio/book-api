import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private configService: ConfigService) {
		super({
			clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
			callbackURL:
				configService.get<string>('GOOGLE_CALLBACK_URL') ??
				'http://localhost:3000/auth/google/callback',
			scope: ['email', 'profile'], // Permisos que demanes a l'usuari
			passReqToCallback: false,
		});
	}

	validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	): {
		email: string;
		firstName?: string;
		lastName?: string;
		picture?: string;
		googleId: string;
	} {
		void accessToken;
		void refreshToken;

		const email = profile.emails?.[0]?.value;
		if (!email) {
			throw new Error('Google profile does not contain an email');
		}

		return {
			email,
			firstName: profile.name?.givenName,
			lastName: profile.name?.familyName,
			picture: profile.photos?.[0]?.value,
			googleId: profile.id,
		};
	}
}
