/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ReseniaDto } from './resenia.dto';
import { ReseniaEntity } from './resenia.entity';
import { plainToInstance } from 'class-transformer';

@Controller('resenia')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseniaController {
  constructor(private readonly reseniaService: ReseniaService) {}

  @Post()
  async crearResenia(@Body() reseniaDto: ReseniaDto) {
    const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
    return await this.reseniaService.crearResenia(resenia);
  }

  @Post('actividad/:actividadId/estudiante/:estudianteId')
  async agregarResenia(
    @Param('actividadId') actividadId: number,
    @Param('estudianteId') estudianteId: number,
    @Body() reseniaDto: ReseniaDto,
  ) {
    const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
    return await this.reseniaService.agregarResenia(
      +actividadId,
      +estudianteId,
      resenia,
    );
  }

  @Get(':reseniaId')
  async findReseniaById(@Param('reseniaId') reseniaId: number) {
    return await this.reseniaService.findReseniaById(+reseniaId);
  }
}
