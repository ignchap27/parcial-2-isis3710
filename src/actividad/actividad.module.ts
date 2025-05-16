import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';

@Module({
  providers: [ActividadService],
  imports: [
    TypeOrmModule.forFeature([
      ActividadEntity,
      EstudianteEntity,
      ReseniaEntity,
    ]),
  ],
})
export class ActividadModule {}
