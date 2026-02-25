import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IsPositivePipe implements PipeTransform {
	transform(value: any) {
		const val = parseInt(value, 10);
		if (isNaN(val) || val <= 0) {
			throw new BadRequestException('Value must be a positive integer');
		}
		return val;
	}
}
