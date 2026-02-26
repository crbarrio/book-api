import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Configuració de la ValidationPipe globalment per a tots els DTOs
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Elimina propietats no definides en el DTO
			forbidNonWhitelisted: true, // Llença un error si hi ha propietats no definides
			transform: true, // Transforma automàticament els tipus dels DTOs
		}),
	);

	// Configuració de Swagger
	const config = new DocumentBuilder()
		.setTitle('API de Llibres')
		.setDescription(
			`Una API REST per gestionar un catàleg de llibres amb NestJS i MongoDB`,
		)
		.setVersion('1.0')
		.addTag('Llibres', 'Gestió del catàleg de llibres') // Afegim el tag que usem al controller
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document); // La documentació estarà disponible a /api-docs

	const PORT = process.env.PORT || 3000;
	await app.listen(PORT, () => {
		console.log(`Servidor NestJS funcionant al port ${PORT}`);
		console.log(
			`Documentació Swagger disponible a http://localhost:${PORT}/api-docs`,
		);
	});
}

bootstrap();
