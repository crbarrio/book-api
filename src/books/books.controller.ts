import {
	Controller,
	DefaultValuePipe,
	Get,
	HttpException,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { IsPositivePipe } from 'src/pipes/is-positive.pipe';

@Controller('books')
export class BooksController {
	constructor(private booksService: BooksService) {}
	@Get()
	findAll(
		@Query('sort') sort: 'asc' | 'desc' = 'desc',
		// El orden de los pipes es importante, se ejecutan de izquierda a derecha
		// El valor por defecto se aplica antes de parsear el valor, por lo que si no se proporciona un valor, se aplicará el valor por defecto y luego se parseará
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe, IsPositivePipe) limit: number,
	) {
		console.log(sort);
		return this.booksService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		const book = this.booksService.findOne(id);
		if (!book) {
			throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
			// Otras opciones:
			// throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
			// throw new NotFoundException('Book not found');
			// return { message: 'Book not found' };
			// ForbiddenException, BadRequestException, InternalServerErrorException, etc
		}
		return book;
	}

	@Post()
	create(@Query('id') id: string, @Query('title') title: string) {
		return this.booksService.create({ id, title });
	}
}
