import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { ReseniaEntity } from './resenia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';

@Module({
  providers: [ReseniaService],
  imports: [
    TypeOrmModule.forFeature([
      ReseniaEntity,
      EstudianteEntity,
      ActividadEntity,
    ]),
  ],
})
export class ReseniaModule {}
