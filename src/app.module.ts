import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseniaModule } from './resenia/resenia.module';
import { EstudianteEntity } from './estudiante/estudiante.entity';
import { ActividadEntity } from './actividad/actividad.entity';
import { ReseniaEntity } from './resenia/resenia.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [EstudianteEntity, ActividadEntity, ReseniaEntity],
      dropSchema: true,
      synchronize: true,
    }),
    EstudianteModule,
    ActividadModule,
    ReseniaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
