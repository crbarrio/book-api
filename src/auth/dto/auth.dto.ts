import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
	@ApiProperty({ description: `Nom d'usuari`, example: 'janedoe' })
	@IsNotEmpty({ message: `El nom d'usuari és obligatori` })
	@IsString({ message: `El nom d'usuari ha de ser una cadena de text` })
	username: string;

	@ApiProperty({ description: `Contrasenya`, example: 'passwordSegura123' })
	@IsNotEmpty({ message: `La contrasenya és obligatòria` })
	@IsString({ message: `La contrasenya ha de ser una cadena de text` })
	@MinLength(6, { message: `La contrasenya ha de tenir almenys 6 caràcters` })
	password: string;
}

export class LoginUserDto {
	@ApiProperty({ description: `Nom d'usuari`, example: 'janedoe' })
	@IsNotEmpty({ message: `El nom d'usuari és obligatori` })
	username: string;

	@ApiProperty({ description: `Contrasenya`, example: 'passwordSegura123' })
	@IsNotEmpty({ message: `La contrasenya és obligatòria` })
	password: string;
}
