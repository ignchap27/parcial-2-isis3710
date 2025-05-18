import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';

@Entity()
export class ActividadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column()
  cupoMaximo: number;

  @Column()
  estado: number;

  @ManyToMany(() => EstudianteEntity, (estudiante) => estudiante.actividades)
  @JoinTable()
  estudiantes: EstudianteEntity[];

  @OneToMany(() => ReseniaEntity, (resenia) => resenia.actividad)
  resenias: ReseniaEntity[];
}
