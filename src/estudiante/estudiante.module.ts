import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [EstudianteService],
  imports: [TypeOrmModule.forFeature([EstudianteEntity])],
})
export class EstudianteModule {}
