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
        const openByCarRental = await this.repository.findOne({
            where: { car_id, end_date: null },
        });

        return openByCarRental;
    }

    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        const openByUserRental = await this.repository.findOne({
            where: { user_id, end_date: null },
        });

        return openByUserRental;
    }

    async create(data: ICreateRentalDTO): Promise<Rental> {
        const rental = this.repository.create(data);

        await this.repository.save(rental);

        return rental;
    }

    async findById(id: string): Promise<Rental> {
        const rental = await this.repository.findOne(id);

        return rental;
    }

    async findByUser(user_id: string): Promise<Rental[]> {
        const rentals = await this.repository.find({
            where: { user_id },
            relations: ["car"],
        });

        return rentals;
    }
}

export { RentalsRepository };
