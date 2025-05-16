import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from 'src/actividad/actividad.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';

@Module({
  providers: [EstudianteService],
  imports: [
    TypeOrmModule.forFeature([
      EstudianteEntity,
      ActividadEntity,
      ReseniaEntity,
    ]),
  ],
})
export class EstudianteModule {}
