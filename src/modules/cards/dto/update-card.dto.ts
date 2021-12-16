import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty({
    example: '',
    required: true,
    format: 'string',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    example: '',
    required: true,
    format: 'string',
  })
  @IsString()
  @IsOptional()
  readonly image?: string;

  @ApiProperty({
    example: '',
    required: true,
    format: 'string',
  })
  @IsString()
  @IsOptional()
  readonly sex?: string;

  @ApiProperty({
    example: '',
    required: true,
    format: 'string',
  })
  @IsString()
  @IsOptional()
  readonly realName?: string;

  @ApiProperty({
    example: '',
    required: true,
    format: 'string',
  })
  @IsString()
  @IsOptional()
  joinedIn?: string;

  attack?: number;
  defence?: number;
  agile?: number;
  lucky?: number;

  @ApiProperty({
    example: '',
    required: true,
    format: 'string',
  })
  @IsArray()
  @IsOptional()
  readonly items?: string[];
}
