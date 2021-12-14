import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    example: 'hat',
    required: true,
    format: 'string',
  })
  readonly itemName: string;

  @ApiProperty({
    example: 10,
    required: true,
    format: 'number',
  })
  readonly itemQuantity: number;
  // readonly itemDefaultQuantity: number;

  @ApiProperty({
    example: 2,
    required: true,
    format: 'number',
  })
  readonly attack: number;

  @ApiProperty({
    example: 3,
    required: true,
    format: 'number',
  })
  readonly defence: number;

  @ApiProperty({
    example: 2,
    required: true,
    format: 'number',
  })
  readonly agile: number;

  @ApiProperty({
    example: 10,
    required: true,
    format: 'string',
  })
  readonly lucky: number;
}
