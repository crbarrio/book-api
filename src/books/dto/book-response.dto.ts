import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookResponseDto {
	@ApiProperty({
		description: 'Identificador únic del llibre',
		example: '65f7e5d8d5a6c3b4e7f8a9b0',
	})
	_id: string;

	@ApiProperty({
		description: 'Títol del llibre',
		example: 'Clean Code',
	})
	title: string;

	@ApiProperty({
		description: 'Autor del llibre',
		example: 'Robert C. Martin',
	})
	author: string;

	@ApiPropertyOptional({
		description: 'Any de publicació',
		example: 2008,
	})
	year?: number;

	@ApiPropertyOptional({
		description: 'ISBN-13 del llibre',
		example: '9780132350884',
	})
	isbn?: string;

	@ApiProperty({
		description: 'Data de creació',
		example: '2026-03-11T12:00:00.000Z',
	})
	createdAt: string;

	@ApiProperty({
		description: "Data d'última actualització",
		example: '2026-03-11T12:00:00.000Z',
	})
	updatedAt: string;
}
