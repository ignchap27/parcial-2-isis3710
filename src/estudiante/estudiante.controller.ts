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
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';
import { plainToInstance } from 'class-transformer';

@Controller('estudiante')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get(':estudianteId')
  async findEstudianteById(@Param('estudianteId') estudianteId: number) {
    return await this.estudianteService.findEstudianteById(+estudianteId);
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
    @Param('estudianteId') estudianteId: number,
    @Param('actividadId') actividadId: number,
  ) {
    return await this.estudianteService.InscribirseActividad(
      +estudianteId,
      +actividadId,
    );
  }
}
