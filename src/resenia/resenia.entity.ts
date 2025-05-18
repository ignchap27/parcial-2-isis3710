import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReseniaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  calificacion: number;

  @Column()
  fecha: string;

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.resenias)
  estudiante: EstudianteEntity;

  @ManyToOne(() => ActividadEntity, (actividad) => actividad.resenias)
  actividad: ActividadEntity;
}
