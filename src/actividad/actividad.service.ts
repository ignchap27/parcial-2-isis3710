import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
    if (actividad.titulo.length < 15) {
      throw new BusinessLogicException(
        'El título debe tener al menos 15 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    actividad.estado = 0;

    return await this.actividadRepository.save(actividad);
  }

  async cambiarEstado(
    actividadId: string,
    estado: number,
  ): Promise<ActividadEntity> {
    if (![0, 1, 2].includes(estado)) {
      throw new BusinessLogicException(
        'El estado debe ser 0 (abierta), 1 (cerrada) o 2 (finalizada)',
        BusinessError.BAD_REQUEST,
      );
    }

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

    const estudiantesInscritos = actividad.estudiantes
      ? actividad.estudiantes.length
      : 0;

    const porcentajeOcupacion =
      (estudiantesInscritos / actividad.cupoMaximo) * 100;

    if (estado === 1 && porcentajeOcupacion < 80) {
      throw new BusinessLogicException(
        'La actividad solo puede ser cerrada si el 80% del cupo está lleno',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (estado === 2 && estudiantesInscritos < actividad.cupoMaximo) {
      throw new BusinessLogicException(
        'La actividad solo puede ser finalizada si no hay cupo disponible',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    actividad.estado = estado;
    return await this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    return await this.actividadRepository.find({
      where: { fecha },
      relations: ['estudiantes', 'resenias'],
    });
  }
}
