/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ActividadDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  fecha: string;

  @IsNotEmpty()
  @IsInt()
  cupoMaximo: number;

  @IsNotEmpty()
  @IsInt()
  estado: number;
}
