import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
