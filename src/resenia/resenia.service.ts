import { Injectable } from '@nestjs/common';
import { ReseniaEntity } from './resenia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ReseniaService {
  constructor(
    @InjectRepository(ReseniaEntity)
    private readonly reseniaRepository: Repository<ReseniaEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,

    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async crearResenia(resenia: ReseniaEntity): Promise<ReseniaEntity> {
    return await this.reseniaRepository.save(resenia);
  }

  async agregarResenia(
    actividadId: string,
    estudianteId: string,
    resenia: ReseniaEntity,
  ): Promise<ReseniaEntity> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });

    if (!actividad) {
      throw new BusinessLogicException(
        'La actividad con el id proporcionado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    if (actividad.estado !== 2) {
      throw new BusinessLogicException(
        'Solo se pueden agregar reseñas a actividades finalizadas',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
    });

    if (!estudiante) {
      throw new BusinessLogicException(
        'El estudiante con el id proporcionado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const estudianteInscrito = actividad.estudiantes.some(
      (e) => e.id === estudianteId,
    );

    if (!estudianteInscrito) {
      throw new BusinessLogicException(
        'El estudiante no estuvo inscrito en esta actividad',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    resenia.actividad = actividad;
    resenia.estudiante = estudiante;

    return await this.reseniaRepository.save(resenia);
  }

  async findReseniaById(id: string): Promise<ReseniaEntity> {
    const resenia = await this.reseniaRepository.findOne({
      where: { id },
      relations: ['actividad', 'estudiante'],
    });

    if (!resenia) {
      throw new BusinessLogicException(
        'La reseña con el id proporcionado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    return resenia;
  }
}
