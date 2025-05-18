import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { ReseniaEntity } from './resenia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';
import { ReseniaController } from './resenia.controller';

@Module({
  providers: [ReseniaService],
  imports: [
    TypeOrmModule.forFeature([
      ReseniaEntity,
      EstudianteEntity,
      ActividadEntity,
    ]),
  ],
  controllers: [ReseniaController],
})
export class ReseniaModule {}
