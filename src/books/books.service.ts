import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
	constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

	async findAll(): Promise<Book[]> {
		return this.bookModel.find().exec();
	}

	async findOne(id: string): Promise<Book> {
		const book = await this.bookModel.findById(id).exec();
		if (!book) {
			throw new NotFoundException(`Llibre amb ID "${id}" no trobat.`);
		}
		return book;
	}

	async create(createBookDto: CreateBookDto): Promise<Book> {
		try {
			const createdBook = new this.bookModel(createBookDto);
			return await createdBook.save();
		} catch (error) {
			if (error.code === 11000) {
				// Codi d'error de MongoDB per a duplicats
				throw new ConflictException("L'ISBN ja existeix.");
			}
			throw error; // Re-llençar altres errors
		}
	}

	async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
		const existingBook = await this.bookModel
			.findByIdAndUpdate(id, updateBookDto, { new: true, runValidators: true })
			.exec();
		if (!existingBook) {
			throw new NotFoundException(`Llibre amb ID "${id}" no trobat.`);
		}
		return existingBook;
	}

	async remove(id: string): Promise<void> {
		const result = await this.bookModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException(`Llibre amb ID "${id}" no trobat.`);
		}
	}
}
