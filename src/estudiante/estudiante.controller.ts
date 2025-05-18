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
import { EstudianteService } from './estudiante.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';
import { plainToInstance } from 'class-transformer';

@Controller('estudiante')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get(':estudianteId')
  async findEstudianteById(@Param('estudianteId') estudianteId: string) {
    return await this.estudianteService.findEstudianteById(estudianteId);
  }

  @Post()
  async crearEstudiante(@Body() estudianteDto: EstudianteDto) {
    const estudiante: EstudianteEntity = plainToInstance(
      EstudianteEntity,
      estudianteDto,
    );
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  @Post(':estudianteId/actividad/:actividadId')
  async inscribirseActividad(
    @Param('estudianteId') estudianteId: string,
    @Param('actividadId') actividadId: string,
  ) {
    return await this.estudianteService.InscribirseActividad(
      estudianteId,
      actividadId,
    );
  }
}
