import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRoot(
			process.env.MONGODB_URI || `mongodb://localhost:27017/book-api`,
		),
		BooksModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
