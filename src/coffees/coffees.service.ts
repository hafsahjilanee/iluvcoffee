import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}
  findAll() {
    return this.coffeeRepository.find();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: {
        id: +id,
      },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDTO: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDTO);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDTO: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDTO,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);

    return this.coffeeRepository.remove(coffee);
  }
}
