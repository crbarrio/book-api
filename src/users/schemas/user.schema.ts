import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin',
}

@Schema()
export class User {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true, select: false }) // 'select: false' per evitar retornar la contrasenya per defecte
	password: string; // Guardarem la contrasenya hasheada

	@Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
	roles: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(User);
