import {
	IsString,
	IsNotEmpty,
	IsNumber,
	Min,
	Max,
	IsOptional,
	IsISBN,
} from 'class-validator';

export class CreateBookDto {
	@IsNotEmpty({ message: 'El título es obligatorio' })
	@IsString({ message: 'El título ha de ser una cadena de texto' })
	title: string;

	@IsNotEmpty({ message: 'El autor es obligatorio' })
	@IsString({ message: 'El autor ha de ser una cadena de texto' })
	author: string;

	@IsOptional()
	@IsNumber({}, { message: 'El año ha de ser un número' })
	@Min(1000, { message: 'El año ha de ser superior a 1000' })
	@Max(new Date().getFullYear(), { message: 'El año no puede ser futuro' })
	year?: number;

	@IsOptional()
	@IsISBN('13', {
		message: 'El ISBN no es válido (ha de ser ISBN-10 o ISBN-13)',
	})
	isbn?: string;
}
