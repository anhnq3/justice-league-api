import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly image: string;

  @IsString()
  @IsNotEmpty()
  readonly sex: string;

  @IsString()
  @IsNotEmpty()
  readonly realName: string;

  @IsString()
  @IsNotEmpty()
  readonly joinedIn: string;

  @IsNumber()
  @IsNotEmpty()
  readonly attack: number;

  @IsNumber()
  @IsNotEmpty()
  readonly defence: number;

  @IsNumber()
  @IsNotEmpty()
  readonly agile: number;

  @IsNumber()
  @IsNotEmpty()
  readonly lucky: number;

  @IsString()
  readonly items: string;
}
