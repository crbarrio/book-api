import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findOne(username: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ username }).exec();
	}

	async findOneWithPassword(username: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ username }).select('+password').exec();
	}

	async create(username: string, passwordPlain: string): Promise<User> {
		const existingUser = await this.userModel.findOne({ username }).exec();
		if (existingUser) {
			throw new ConflictException("Aquest nom d'usuari ja existeix.");
		}
		const hashedPassword = await bcrypt.hash(passwordPlain, 10); // 10 rondes de salt
		const newUser = new this.userModel({ username, password: hashedPassword });
		return newUser.save();
	}

	async validatePassword(
		passwordPlain: string,
		hashedPasswordFromDb: string,
	): Promise<boolean> {
		return bcrypt.compare(passwordPlain, hashedPasswordFromDb);
	}
}
