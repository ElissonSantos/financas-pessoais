import { IsString, Length } from 'class-validator';

export class PinDto {
  @IsString()
  @Length(1, 32)
  pin!: string;
}
