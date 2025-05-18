/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReseniaDto {
  @IsNotEmpty()
  @IsInt()
  calificacion: number;

  @IsNotEmpty()
  @IsString()
  fecha: string;
}
