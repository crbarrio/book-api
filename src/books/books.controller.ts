import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	HttpCode,
	HttpStatus,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import {
	ApiTags,
	ApiResponse,
	ApiOperation,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';

@ApiTags('Llibres') // Agrupa les endpoints a Swagger
@Controller('books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Get()
	@ApiOperation({ summary: 'Obté tots els llibres' })
	@ApiResponse({ status: 200, description: 'Llistat de llibres', type: [Book] })
	async findAll(): Promise<Book[]> {
		return this.booksService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obté un llibre per ID' })
	@ApiParam({ name: 'id', description: 'ID del llibre', type: String })
	@ApiResponse({ status: 200, description: 'Dades del llibre', type: Book })
	@ApiResponse({ status: 404, description: 'Llibre no trobat' })
	async findOne(@Param('id') id: string): Promise<Book> {
		return this.booksService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Crea un nou llibre' })
	@ApiBody({ type: CreateBookDto, description: 'Dades del llibre a crear' })
	@ApiResponse({
		status: 201,
		description: 'Llibre creat correctament',
		type: Book,
	})
	@ApiResponse({ status: 400, description: 'Dades invàlides' })
	@ApiResponse({
		status: 409,
		description: `L'ISBN ja existeix`,
	}) // Per a ConflictException
	@HttpCode(HttpStatus.CREATED) // Retorna 201 Created
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	) // Validació de DTO
	async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
		return this.booksService.create(createBookDto);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualitza un llibre existent' })
	@ApiParam({ name: 'id', description: 'ID del llibre', type: String })
	@ApiBody({
		type: UpdateBookDto,
		description: 'Dades del llibre a actualitzar',
	})
	@ApiResponse({ status: 200, description: 'Llibre actualitzat', type: Book })
	@ApiResponse({ status: 400, description: 'Dades invàlides' })
	@ApiResponse({ status: 404, description: 'Llibre no trobat' })
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	)
	async update(
		@Param('id') id: string,
		@Body() updateBookDto: UpdateBookDto,
	): Promise<Book> {
		return this.booksService.update(id, updateBookDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Elimina un llibre' })
	@ApiParam({ name: 'id', description: 'ID del llibre', type: String })
	@ApiResponse({ status: 204, description: 'Llibre eliminat correctament' })
	@ApiResponse({ status: 404, description: 'Llibre no trobat' })
	@HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content per a DELETE reeixit
	async remove(@Param('id') id: string): Promise<void> {
		await this.booksService.remove(id);
	}
}
