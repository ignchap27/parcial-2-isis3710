/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiante: EstudianteEntity;
  let actividadList: ActividadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    estudianteRepository.clear();
    actividadRepository.clear();

    actividadList = [];
    for (let i = 0; i < 5; i++) {
      const actividad: ActividadEntity = await actividadRepository.save({
        titulo: faker.lorem.sentence(5),
        fecha: faker.date.future().toISOString().split('T')[0],
        cupoMaximo: faker.number.int({ min: 10, max: 30 }),
        estado: 0,
        estudiantes: [],
        resenias: [],
      });
      actividadList.push(actividad);
    }

    estudiante = await estudianteRepository.save({
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.word.sample(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for findEstudianteById
  it('findEstudianteById should return a student by id', async () => {
    const storedEstudiante = await service.findEstudianteById(estudiante.id);
    expect(storedEstudiante).not.toBeNull();
    expect(storedEstudiante.nombre).toBe(estudiante.nombre);
    expect(storedEstudiante.correo).toBe(estudiante.correo);
    expect(storedEstudiante.programa).toBe(estudiante.programa);
    expect(storedEstudiante.semestre).toBe(estudiante.semestre);
  });

  it('findEstudianteById should throw an exception for an invalid id', async () => {
    await expect(() =>
      service.findEstudianteById('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty(
      'message',
      'El usuario con el id proporcionado no existe',
    );
  });

  // Tests for crearEstudiante
  it('crearEstudiante should create a new student', async () => {
    const newEstudiante: EstudianteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.word.sample(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    };

    const result = await service.crearEstudiante(newEstudiante);
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(newEstudiante.nombre);
    expect(result.correo).toBe(newEstudiante.correo);
    expect(result.programa).toBe(newEstudiante.programa);
    expect(result.semestre).toBe(newEstudiante.semestre);
  });

  it('crearEstudiante should throw an exception for invalid email', async () => {
    const newEstudiante: EstudianteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      correo: 'invalid-email',
      programa: faker.word.sample(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    };

    await expect(() =>
      service.crearEstudiante(newEstudiante),
    ).rejects.toHaveProperty('message', 'El email proporcionado no es válido');
  });

  it('crearEstudiante should throw an exception for semester less than 1', async () => {
    const newEstudiante: EstudianteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.word.sample(),
      semestre: 0,
      actividades: [],
      resenias: [],
    };

    await expect(() =>
      service.crearEstudiante(newEstudiante),
    ).rejects.toHaveProperty('message', 'El semestre debe estar entre 1 y 10');
  });

  it('crearEstudiante should throw an exception for semester greater than 10', async () => {
    const newEstudiante: EstudianteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.word.sample(),
      semestre: 11,
      actividades: [],
      resenias: [],
    };

    await expect(() =>
      service.crearEstudiante(newEstudiante),
    ).rejects.toHaveProperty('message', 'El semestre debe estar entre 1 y 10');
  });

  // Tests for InscribirseActividad
  it('InscribirseActividad should add an activity to a student', async () => {
    const actividad = actividadList[0];

    const result = await service.InscribirseActividad(
      estudiante.id,
      actividad.id,
    );

    expect(result.actividades.length).toBe(1);
    expect(result.actividades[0].id).toBe(actividad.id);
    expect(result.actividades[0].titulo).toBe(actividad.titulo);
    expect(result.actividades[0].fecha).toBe(actividad.fecha);
    expect(result.actividades[0].cupoMaximo).toBe(actividad.cupoMaximo);
    expect(result.actividades[0].estado).toBe(actividad.estado);
  });

  it('InscribirseActividad should throw an exception for an invalid student id', async () => {
    const actividad = actividadList[0];

    await expect(() =>
      service.InscribirseActividad(
        '00000000-0000-0000-0000-000000000000',
        actividad.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'Estudiante con el id proporcionado no existe',
    );
  });

  it('InscribirseActividad should throw an exception for an invalid activity id', async () => {
    await expect(() =>
      service.InscribirseActividad(
        estudiante.id,
        '00000000-0000-0000-0000-000000000000',
      ),
    ).rejects.toHaveProperty(
      'message',
      'Actividad con el id proporcionado no existe',
    );
  });
});
