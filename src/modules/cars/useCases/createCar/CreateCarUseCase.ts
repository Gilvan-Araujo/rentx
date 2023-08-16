import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@/modules/cars/repositories/ICarsRepository";

import { Car } from "../../infra/typeorm/entities/Car";

interface IRequest {
    name: string;
    description: string;
    daily_rate: number;
    license_plate: string;
    fine_amount: number;
    brand: string;
    category_id: string;
}

@injectable()
class CreateCarUseCase {
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
    ) {}

    async execute(data: IRequest): Promise<Car> {
        const doesCarAlreadyExists =
            await this.carsRepository.findByLicensePlate(data.license_plate);

        if (doesCarAlreadyExists) throw new Error("Car already exists!");

        const car = await this.carsRepository.create(data);

        return car;
    }
}

export { CreateCarUseCase };
