import dayjs from "dayjs";

import { DayJsDateProvider } from "@/shared/container/providers/DateProvider/implementations/DayJsProvider";
import { AppError } from "@/shared/errors/AppError";

import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateProvider: DayJsDateProvider;

describe("Create Rental", () => {
    const dayAdd48Hours = dayjs().add(2, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dateProvider = new DayJsDateProvider();

        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dateProvider,
        );
    });

    it("should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: "121212",
            expected_return_date: dayAdd48Hours,
        });

        expect(rental).toHaveProperty("id");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "121212",
                expected_return_date: dayAdd48Hours,
            });

            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "343434",
                expected_return_date: dayAdd48Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "test",
                expected_return_date: dayAdd48Hours,
            });

            await createRentalUseCase.execute({
                user_id: "321",
                car_id: "test",
                expected_return_date: dayAdd48Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "test",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
