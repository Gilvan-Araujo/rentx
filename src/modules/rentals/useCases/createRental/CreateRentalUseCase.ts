import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@/modules/cars/repositories/ICarsRepository";
import { IDateProvider } from "@/shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@/shared/errors/AppError";

import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
    ) {}

    async execute(data: IRequest): Promise<Rental> {
        const { user_id, car_id, expected_return_date } = data;

        const isCarUnavailable =
            await this.rentalsRepository.findOpenRentalByCar(car_id);

        const isUserAlreadyRenting =
            await this.rentalsRepository.findOpenRentalByUser(user_id);

        if (isCarUnavailable) throw new AppError("Car is unavailable");

        if (isUserAlreadyRenting)
            throw new AppError("User already has a rental");

        const dateNow = this.dateProvider.dateNow();

        const compare = this.dateProvider.compareInHours(
            dateNow,
            expected_return_date,
        );

        if (compare < 24) throw new AppError("Invalid return time!");

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        await this.carsRepository.updateAvailable(car_id, false);

        return rental;
    }
}

export { CreateRentalUseCase };
