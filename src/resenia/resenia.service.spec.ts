/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ReseniaService } from './resenia.service';
import { Repository } from 'typeorm';
import { ReseniaEntity } from './resenia.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let reseniaRepository: Repository<ReseniaEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiante: EstudianteEntity;
  let actividad: ActividadEntity;
  let resenia: ReseniaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaService],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    reseniaRepository = module.get<Repository<ReseniaEntity>>(
      getRepositoryToken(ReseniaEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    reseniaRepository.clear();
    estudianteRepository.clear();
    actividadRepository.clear();

    estudiante = await estudianteRepository.save({
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.word.sample(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    });

    actividad = await actividadRepository.save({
      titulo: faker.lorem.sentence(5),
      fecha: faker.date.future().toISOString().split('T')[0],
      cupoMaximo: 10,
      estado: 2, // Finalizada
      estudiantes: [estudiante],
      resenias: [],
    });

    // Update estudiante to include the activity
    estudiante.actividades = [actividad];
    await estudianteRepository.save(estudiante);

    resenia = await reseniaRepository.save({
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: estudiante,
      actividad: actividad,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for crearResenia
  it('crearResenia should create a new review', async () => {
    const newResenia: ReseniaEntity = {
      id: '',
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: estudiante,
      actividad: actividad,
    };

    const result = await service.crearResenia(newResenia);
    expect(result).not.toBeNull();
    expect(result.calificacion).toBe(newResenia.calificacion);
    expect(result.fecha).toBe(newResenia.fecha);
  });

  // Tests for agregarResenia
  it('agregarResenia should add a review to an activity by a student', async () => {
    const newResenia: ReseniaEntity = {
      id: '',
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: estudiante,
      actividad: actividad,
    };

    const result = await service.agregarResenia(
      actividad.id,
      estudiante.id,
      newResenia,
    );

    expect(result).not.toBeNull();
    expect(result.calificacion).toBe(newResenia.calificacion);
    expect(result.fecha).toBe(newResenia.fecha);
    expect(result.estudiante.id).toBe(estudiante.id);
    expect(result.actividad.id).toBe(actividad.id);
  });

  it('agregarResenia should throw an exception for non-existent activity', async () => {
    const newResenia: ReseniaEntity = {
      id: '',
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: estudiante,
      actividad: actividad,
    };

    await expect(() =>
      service.agregarResenia(
        '00000000-0000-0000-0000-000000000000',
        estudiante.id,
        newResenia,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La actividad con el id proporcionado no existe',
    );
  });

  it('agregarResenia should throw an exception for non-finalized activity', async () => {
    // Create a new activity with estado = 0 (open)
    const openActividad = await actividadRepository.save({
      titulo: faker.lorem.sentence(5),
      fecha: faker.date.future().toISOString().split('T')[0],
      cupoMaximo: 10,
      estado: 0, // Abierta
      estudiantes: [estudiante],
      resenias: [],
    });

    const newResenia: ReseniaEntity = {
      id: '',
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: estudiante,
      actividad: actividad, // Use the original finalized activity here
    };

    await expect(() =>
      service.agregarResenia(openActividad.id, estudiante.id, newResenia),
    ).rejects.toHaveProperty(
      'message',
      'Solo se pueden agregar reseñas a actividades finalizadas',
    );
  });

  it('agregarResenia should throw an exception for non-existent student', async () => {
    const newResenia: ReseniaEntity = {
      id: '',
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: estudiante,
      actividad: actividad,
    };

    await expect(() =>
      service.agregarResenia(
        actividad.id,
        '00000000-0000-0000-0000-000000000000',
        newResenia,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El estudiante con el id proporcionado no existe',
    );
  });

  it('agregarResenia should throw an exception for student not enrolled in activity', async () => {
    // Create a new student who isn't enrolled in the activity
    const unenrolledEstudiante = await estudianteRepository.save({
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.word.sample(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    });

    const newResenia: ReseniaEntity = {
      id: '',
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.recent().toISOString().split('T')[0],
      estudiante: unenrolledEstudiante, // Use the non-enrolled student here
      actividad: actividad,
    };

    await expect(() =>
      service.agregarResenia(actividad.id, unenrolledEstudiante.id, newResenia),
    ).rejects.toHaveProperty(
      'message',
      'El estudiante no estuvo inscrito en esta actividad',
    );
  });

  // Tests for findReseniaById
  it('findReseniaById should return a review by id', async () => {
    const storedResenia = await service.findReseniaById(resenia.id);
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.calificacion).toBe(resenia.calificacion);
    expect(storedResenia.fecha).toBe(resenia.fecha);
    expect(storedResenia.estudiante).not.toBeNull();
    expect(storedResenia.actividad).not.toBeNull();
  });

  it('findReseniaById should throw an exception for invalid id', async () => {
    await expect(() =>
      service.findReseniaById('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty(
      'message',
      'La reseña con el id proporcionado no existe',
    );
  });
});
