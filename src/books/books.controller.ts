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
	UseGuards,
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
	ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard'; // Importa el guard de rols
import { Roles } from '../auth/decorators/roles.decorator'; // Importa el decorador de rols
import { UserRole } from '../users/schemas/user.schema'; // Importa els rols d'usuari

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
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Crea un nou llibre' })
	@ApiBody({ type: CreateBookDto, description: 'Dades del llibre a crear' })
	@ApiResponse({
		status: 201,
		description: 'Llibre creat correctament',
		type: Book,
	})
	@ApiResponse({ status: 400, description: 'Dades invàlides' })
	@ApiResponse({ status: 401, description: 'No autoritzat' })
	@ApiResponse({ status: 403, description: 'Accés prohibit' })
	@ApiResponse({
		status: 409,
		description: `L'ISBN ja existeix`,
	})
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	)
	async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
		return this.booksService.create(createBookDto);
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Actualitza un llibre existent' })
	@ApiParam({ name: 'id', description: 'ID del llibre', type: String })
	@ApiBody({
		type: UpdateBookDto,
		description: 'Dades del llibre a actualitzar',
	})
	@ApiResponse({ status: 200, description: 'Llibre actualitzat', type: Book })
	@ApiResponse({ status: 400, description: 'Dades invàlides' })
	@ApiResponse({ status: 401, description: 'No autoritzat' })
	@ApiResponse({ status: 403, description: 'Accés prohibit' })
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
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Elimina un llibre' })
	@ApiParam({ name: 'id', description: 'ID del llibre', type: String })
	@ApiResponse({ status: 204, description: 'Llibre eliminat correctament' })
	@ApiResponse({ status: 401, description: 'No autoritzat' })
	@ApiResponse({ status: 403, description: 'Accés prohibit' })
	@ApiResponse({ status: 404, description: 'Llibre no trobat' })
	@HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content per a DELETE reeixit
	async remove(@Param('id') id: string): Promise<void> {
		await this.booksService.remove(id);
	}
}
