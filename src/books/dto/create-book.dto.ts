import {
	IsString,
	IsNotEmpty,
	IsNumber,
	Min,
	Max,
	IsOptional,
	IsISBN,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
	@ApiProperty({
		description: 'Títol del llibre',
		example: 'Clean Code',
	})
	@IsNotEmpty({ message: 'El título es obligatorio' })
	@IsString({ message: 'El título ha de ser una cadena de texto' })
	title: string;

	@ApiProperty({
		description: 'Autor del llibre',
		example: 'Robert C. Martin',
	})
	@IsNotEmpty({ message: 'El autor es obligatorio' })
	@IsString({ message: 'El autor ha de ser una cadena de texto' })
	author: string;

	@ApiPropertyOptional({
		description: 'Any de publicació',
		example: 2008,
		minimum: 1000,
		maximum: new Date().getFullYear(),
	})
	@IsOptional()
	@IsNumber({}, { message: 'El año ha de ser un número' })
	@Min(1000, { message: 'El año ha de ser superior a 1000' })
	@Max(new Date().getFullYear(), { message: 'El año no puede ser futuro' })
	year?: number;

	@ApiPropertyOptional({
		description: 'ISBN-13 del llibre',
		example: '9780132350884',
	})
	@IsOptional()
	@IsISBN('13', {
		message: 'El ISBN no es válido (ha de ser ISBN-10 o ISBN-13)',
	})
	isbn?: string;
}
