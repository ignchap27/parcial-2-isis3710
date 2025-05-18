import { Injectable } from '@nestjs/common';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { ActividadEntity } from '../actividad/actividad.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async findEstudianteById(id: string): Promise<EstudianteEntity> {
    const estudiante: EstudianteEntity | null =
      await this.estudianteRepository.findOne({
        where: { id },
        relations: ['actividades', 'resenias'],
      });

    if (!estudiante)
      throw new BusinessLogicException(
        'El usuario con el id proporcionado no existe',
        BusinessError.NOT_FOUND,
      );

    return estudiante;
  }

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    // se busco la expresion para verificar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(estudiante.correo)) {
      throw new BusinessLogicException(
        'El email proporcionado no es válido',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validar que el semestre esté entre 1 y 10
    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BusinessLogicException(
        'El semestre debe estar entre 1 y 10',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.estudianteRepository.save(estudiante);
  }

  async InscribirseActividad(
    estudianteId: string,
    actividadId: string,
  ): Promise<EstudianteEntity> {
    const estudiante: EstudianteEntity | null =
      await this.estudianteRepository.findOne({
        where: { id: estudianteId },
        relations: ['actividades'],
      });

    if (!estudiante)
      throw new BusinessLogicException(
        'Estudiante con el id proporcionado no existe',
        BusinessError.NOT_FOUND,
      );

    const actividad: ActividadEntity | null =
      await this.actividadRepository.findOne({
        where: { id: actividadId },
        relations: ['estudiantes'],
      });

    if (!actividad)
      throw new BusinessLogicException(
        'Actividad con el id proporcionado no existe',
        BusinessError.NOT_FOUND,
      );

    estudiante.actividades = estudiante.actividades || [];

    estudiante.actividades.push(actividad);

    return await this.estudianteRepository.save(estudiante);
  }
}
