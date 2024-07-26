import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { Connection } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection : Connection): Promise<string[]> => {
        const coffeeBrands = await Promise.resolve(['buddy_brew', 'nescafe']);
        // console.log('ASYNC FACTORY')
        return coffeeBrands;
      },
      inject: [Connection],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
