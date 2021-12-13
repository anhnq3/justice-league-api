import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  readonly image?: string;
  @IsString()
  @IsOptional()
  readonly sex?: string;
  @IsString()
  @IsOptional()
  readonly realName?: string;
  @IsString()
  @IsOptional()
  readonly joinedIn?: string;
  // readonly attack?: number;
  // readonly defend?: number;
  // readonly agile?: number;
  // readonly lucky?: number;

  @IsString()
  @IsOptional()
  readonly items?: string;
}
