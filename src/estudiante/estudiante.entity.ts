import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActividadEntity } from '../actividad/actividad.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @ManyToMany(() => ActividadEntity, (actividad) => actividad.estudiantes)
  @JoinTable()
  actividades: ActividadEntity[];

  @OneToMany(() => ReseniaEntity, (resenia) => resenia.estudiante)
  resenias: ReseniaEntity[];
}
