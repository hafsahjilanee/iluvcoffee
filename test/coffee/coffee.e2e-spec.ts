import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../../src/common/filter/http-exception/http-exception.filter';
import { TimeoutInterceptor } from '../../src/common/interceptors/timeout/timeout.interceptor';
import { WrapResponseInterceptor } from '../../src/common/interceptors/wrap-response/wrap-response.interceptor';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
    let app: INestApplication;
    const coffee = {
        name: 'Coffee #1',
        description: 'Good coffee',
        brand: 'Nest',
        flavors: ['chocolate', 'milk'],
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CoffeesModule,
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: 'postgres',
                        database: 'postgres',
                        host: 'localhost',
                        port: 5433,
                        username: 'postgres',
                        password: 'pass123',
                        autoLoadEntities: true,
                        synchronize: true,
                    }),
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );
        app.useGlobalInterceptors(
            new WrapResponseInterceptor(),
            new TimeoutInterceptor(),
        );
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    it('Create [POST /]', () =>
        request(app.getHttpServer())
            .post('/coffees')
            .send(coffee as CreateCoffeeDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                const expectedCoffee = jasmine.objectContaining({
                    ...coffee,
                    recommendations: 0,
                    flavors: jasmine.arrayContaining(
                        coffee.flavors.map((name) =>
                            jasmine.objectContaining({ name }),
                        ),
                    ),
                });
                expect(body).toEqual({ data: expectedCoffee });
            }));
    it.todo('Get all [GET /]');
    it.todo('Get one [GET /:id]');
    it.todo('Update one [PATCH /:id');
    it.todo('Delete one [DELETE /:id]');

    afterAll(async () => {
        await app.close();
    });
});