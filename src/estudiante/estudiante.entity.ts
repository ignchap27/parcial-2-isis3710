import { ActividadEntity } from 'src/actividad/actividad.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
