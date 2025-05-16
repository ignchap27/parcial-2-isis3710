import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReseniaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  calificacion: number;

  @Column()
  fecha: string;
}
