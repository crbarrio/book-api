import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
	let controller: BooksController;

	const mockBooksService = {
		findAll: jest.fn().mockReturnValue([]),
		findOne: jest.fn().mockReturnValue({ id: '1', title: 'Test Book' }),
	};

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BooksController],
			providers: [
				{
					provide: BooksService,
					useValue: mockBooksService,
				},
			],
		}).compile();

		controller = module.get<BooksController>(BooksController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
