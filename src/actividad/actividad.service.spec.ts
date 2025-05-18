/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepository: Repository<ActividadEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividad: ActividadEntity;
  let estudiantesList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    actividadRepository.clear();
    estudianteRepository.clear();

    estudiantesList = [];
    for (let i = 0; i < 8; i++) {
      const estudiante: EstudianteEntity = await estudianteRepository.save({
        nombre: faker.person.fullName(),
        correo: faker.internet.email(),
        programa: faker.word.sample(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        actividades: [],
        resenias: [],
      });
      estudiantesList.push(estudiante);
    }

    actividad = await actividadRepository.save({
      titulo: faker.lorem.sentence(5),
      fecha: faker.date.future().toISOString().split('T')[0],
      cupoMaximo: 10,
      estado: 0,
      estudiantes: [],
      resenias: [],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for crearActividad
  it('crearActividad should create a new activity', async () => {
    const newActividad: ActividadEntity = {
      id: '',
      titulo: 'Este es un título suficientemente largo para la actividad',
      fecha: faker.date.future().toISOString().split('T')[0],
      cupoMaximo: faker.number.int({ min: 10, max: 30 }),
      estado: 0,
      estudiantes: [],
      resenias: [],
    };

    const result = await service.crearActividad(newActividad);
    expect(result).not.toBeNull();
    expect(result.titulo).toBe(newActividad.titulo);
    expect(result.fecha).toBe(newActividad.fecha);
    expect(result.cupoMaximo).toBe(newActividad.cupoMaximo);
    expect(result.estado).toBe(0); // Estado should always be 0 for new activities
  });

  it('crearActividad should throw an exception for short title', async () => {
    const newActividad: ActividadEntity = {
      id: '',
      titulo: 'Título corto',
      fecha: faker.date.future().toISOString().split('T')[0],
      cupoMaximo: faker.number.int({ min: 10, max: 30 }),
      estado: 0,
      estudiantes: [],
      resenias: [],
    };

    await expect(() =>
      service.crearActividad(newActividad),
    ).rejects.toHaveProperty(
      'message',
      'El título debe tener al menos 15 caracteres',
    );
  });

  // Tests for cambiarEstado
  it('cambiarEstado should change activity state to closed (1) when 80% full', async () => {
    actividad.estudiantes = estudiantesList;
    await actividadRepository.save(actividad);

    const result = await service.cambiarEstado(actividad.id, 1);
    expect(result).not.toBeNull();
    expect(result.estado).toBe(1);
  });

  it('cambiarEstado should change activity state to finished (2) when 100% full', async () => {
    const extraEstudiantes: EstudianteEntity[] = [];
    for (let i = 0; i < 2; i++) {
      const estudiante: EstudianteEntity = await estudianteRepository.save({
        nombre: faker.person.fullName(),
        correo: faker.internet.email(),
        programa: faker.word.sample(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        actividades: [],
        resenias: [],
      });
      extraEstudiantes.push(estudiante);
    }

    actividad.estudiantes = [...estudiantesList, ...extraEstudiantes];
    await actividadRepository.save(actividad);

    const result = await service.cambiarEstado(actividad.id, 2);
    expect(result).not.toBeNull();
    expect(result.estado).toBe(2);
  });

  it('cambiarEstado should throw an exception for closing activity with less than 80% full', async () => {
    actividad.estudiantes = estudiantesList.slice(0, 7);
    await actividadRepository.save(actividad);

    await expect(() =>
      service.cambiarEstado(actividad.id, 1),
    ).rejects.toHaveProperty(
      'message',
      'La actividad solo puede ser cerrada si el 80% del cupo está lleno',
    );
  });

  it('cambiarEstado should throw an exception for finishing activity with less than 100% full', async () => {
    actividad.estudiantes = estudiantesList;
    await actividadRepository.save(actividad);

    await expect(() =>
      service.cambiarEstado(actividad.id, 2),
    ).rejects.toHaveProperty(
      'message',
      'La actividad solo puede ser finalizada si no hay cupo disponible',
    );
  });

  it('cambiarEstado should throw an exception for invalid activity id', async () => {
    await expect(() =>
      service.cambiarEstado('00000000-0000-0000-0000-000000000000', 1),
    ).rejects.toHaveProperty(
      'message',
      'La actividad con el id proporcionado no existe',
    );
  });

  it('cambiarEstado should throw an exception for invalid state', async () => {
    await expect(() =>
      service.cambiarEstado(actividad.id, 3),
    ).rejects.toHaveProperty(
      'message',
      'El estado debe ser 0 (abierta), 1 (cerrada) o 2 (finalizada)',
    );
  });

  // Tests for findAllActividadesByDate
  it('findAllActividadesByDate should return activities for a specific date', async () => {
    const date = actividad.fecha;
    const results = await service.findAllActividadesByDate(date);

    expect(results).not.toBeNull();
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].fecha).toBe(date);
  });

  it('findAllActividadesByDate should return empty array for date with no activities', async () => {
    const nonExistentDate = '2030-01-01';
    const results = await service.findAllActividadesByDate(nonExistentDate);

    expect(results).toHaveLength(0);
  });
});
