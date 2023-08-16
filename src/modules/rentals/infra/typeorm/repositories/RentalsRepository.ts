import { Repository, getRepository } from "typeorm";

import { ICreateRentalDTO } from "@/modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@/modules/rentals/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
    private repository: Repository<Rental>;

    constructor() {
        this.repository = getRepository(Rental);
    }

    async findOpenRentalByCar(car_id: string): Promise<Rental> {
        const openByCarRental = await this.repository.findOne({ car_id });

        return openByCarRental;
    }

    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        const openByUserRental = await this.repository.findOne({ user_id });

        return openByUserRental;
    }

    async create(data: ICreateRentalDTO): Promise<Rental> {
        const rental = this.repository.create(data);

        await this.repository.save(rental);

        return rental;
    }
}

export { RentalsRepository };
