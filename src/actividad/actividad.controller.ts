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
import { ActividadService } from './actividad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActividadDto } from './actividad.dto';
import { ActividadEntity } from './actividad.entity';
import { plainToInstance } from 'class-transformer';

@Controller('actividad')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crearActividad(@Body() actividadDto: ActividadDto) {
    const actividad: ActividadEntity = plainToInstance(
      ActividadEntity,
      actividadDto,
    );
    return await this.actividadService.crearActividad(actividad);
  }

  @Post(':actividadId/estado/:estado')
  async cambiarEstado(
    @Param('actividadId') actividadId: string,
    @Param('estado') estado: string,
  ) {
    return await this.actividadService.cambiarEstado(actividadId, +estado);
  }

  @Get('fecha/:fecha')
  async findAllActividadesByDate(@Param('fecha') fecha: string) {
    return await this.actividadService.findAllActividadesByDate(fecha);
  }
}
