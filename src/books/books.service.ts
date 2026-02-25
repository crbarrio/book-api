import { Injectable } from '@nestjs/common';
import { Book } from './entity/books.entity';

@Injectable()
export class BooksService {
	private books: Array<Book> = [];

	// En entorno real deben ser async y retornar promesas
	findAll() {
		return this.books;
	}

	findOne(id: string) {
		return this.books.find((book) => book.id === id);
	}

	create(book: Book) {
		this.books.push(book);
		return book;
	}
}
