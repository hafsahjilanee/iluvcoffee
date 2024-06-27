import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [{
        id: 1, 
        name: 'Shipwreck boat',
        brand: 'Buddy brew',
        flavors: ['chocolate', 'vanilla']
    }]

findAll() {
    return this.coffees;
}

findOne(id: string){
    return this.coffees.find(item => item.id === +id);
}

create(createCoffeeDTO: any){
    this.coffees.push(createCoffeeDTO);
}

update(id: string, updateCoffeeDTO: any){
    const existingCoffee = this.findOne(id);

    if(existingCoffee){

    }
}

remove(id: string) {
    const coffeeIndex = this.coffees.findIndex(item => item.id === +id);

    if (coffeeIndex >= 0){
        this.coffees.splice(coffeeIndex, 1);
    }
}
}
