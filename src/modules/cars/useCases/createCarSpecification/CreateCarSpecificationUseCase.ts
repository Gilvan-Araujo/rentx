import { inject, injectable } from "tsyringe";

import { AppError } from "@/shared/errors/AppError";

import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../../repositories/ICarsRepository";
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

interface IRequest {
    car_id: string;
    specifications_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,

        @inject("SpecificationsRepository")
        private specificationsRepository: ISpecificationsRepository,
    ) {}

    async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
        const doesCarExist = await this.carsRepository.findById(car_id);

        if (!doesCarExist) throw new AppError("Car does not exist!");

        const specifications = await this.specificationsRepository.findByIds(
            specifications_id,
        );

        doesCarExist.specifications = specifications;

        await this.carsRepository.create(doesCarExist);

        return doesCarExist;
    }
}

export { CreateCarSpecificationUseCase };
