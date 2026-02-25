import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true }) // Habilitem timestamps per createdAt i updatedAt
export class Book {
	@Prop({ required: true, trim: true })
	title: string;

	@Prop({ required: true, trim: true })
	author: string;

	@Prop({
		type: Number,
		min: [1000, "L'any ha de ser superior a 1000"],
		max: [new Date().getFullYear(), "L'any no pot ser futur"],
	})
	year?: number;

	@Prop({
		unique: true,
		validate: {
			validator: function (v: string) {
				return /^(?:\d{9}[\dXx]|\d{13})$/.test(v);
			},
			message: (props: any) => `${props.value} no és un ISBN vàlid!`
		},
	})
	isbn?: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
