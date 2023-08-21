import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@/modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { DayJsDateProvider } from "@/shared/container/providers/DateProvider/implementations/DayJsProvider";
import { AppError } from "@/shared/errors/AppError";

import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

const CAR = {
    name: "test",
    description: "test",
    daily_rate: 100,
    license_plate: "test",
    fine_amount: 40,
    brand: "test",
    category_id: "test",
};

describe("Create Rental", () => {
    const dayAdd48Hours = dayjs().add(2, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dateProvider = new DayJsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();

        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dateProvider,
            carsRepositoryInMemory,
        );
    });

    it("should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create(CAR);

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd48Hours,
        });

        expect(rental).toHaveProperty("id");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        const car = await carsRepositoryInMemory.create(CAR);
        const car2 = await carsRepositoryInMemory.create(CAR);

        await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd48Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: car2.id,
                expected_return_date: dayAdd48Hours,
            }),
        ).rejects.toEqual(new AppError("User already has a rental"));
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        const car = await carsRepositoryInMemory.create(CAR);

        await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd48Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "321",
                car_id: car.id,
                expected_return_date: dayAdd48Hours,
            }),
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "test",
                expected_return_date: new Date(),
            }),
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });
});
