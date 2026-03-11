import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '../../users/schemas/user.schema'; // Importa User i UserRole
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

interface RequestWithUser extends Request {
	user: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		// Obtenir els rols requerits per a la ruta des dels metadades
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[
				context.getHandler(), // Rols definits al mètode del controlador
				context.getClass(), // Rols definits a la classe del controlador
			],
		);

		// Si no hi ha rols definits per a la ruta, l'accés és permès
		if (!requiredRoles) {
			return true;
		}

		// Obtenir l'usuari de la petició (injectat per AuthGuard('jwt') i JwtStrategy)
		// const { user } = context.switchToHttp().getRequest();
		const { user } = context.switchToHttp().getRequest<RequestWithUser>();

		// Comprova si l'usuari existeix i té algun dels rols requerits
		if (!user || !user.roles) {
			throw new UnauthorizedException(
				'No tens els permisos necessaris per accedir a aquest recurs.',
			);
		}

		return requiredRoles.some((role) => user.roles.includes(role));
	}
}
