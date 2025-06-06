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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
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
    @Param('actividadId') actividadId: string,
    @Param('estudianteId') estudianteId: string,
    @Body() reseniaDto: ReseniaDto,
  ) {
    const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
    return await this.reseniaService.agregarResenia(
      actividadId,
      estudianteId,
      resenia,
    );
  }

  @Get(':reseniaId')
  async findReseniaById(@Param('reseniaId') reseniaId: string) {
    return await this.reseniaService.findReseniaById(reseniaId);
  }
}
