import { CarsRepositoryInMemory } from "@/modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@/shared/errors/AppError";

import { SpecificationsRepositoryInMemory } from "../../repositories/in-memory/SpecificationsRepositoryInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

describe("Create Car Specification", () => {
    let carsRepositoryInMemory: CarsRepositoryInMemory;
    let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
    let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory =
            new SpecificationsRepositoryInMemory();

        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory,
        );
    });

    it("should be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Name Car",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category",
        });

        const specification = await specificationsRepositoryInMemory.create({
            name: "Specification Name",
            description: "Specification Description",
        });

        const car_id = car.id;
        const specifications_id = [specification.id];

        await createCarSpecificationUseCase.execute({
            car_id,
            specifications_id,
        });

        expect(car.specifications).toEqual([specification]);
    });

    it("should not be able to add a new specification to a non-existing car", async () => {
        expect(async () => {
            const car_id = "1234";
            const specifications_id = ["54321"];

            await createCarSpecificationUseCase.execute({
                car_id,
                specifications_id,
            });
        }).rejects.toEqual(new AppError("Car does not exist!"));
    });
});
