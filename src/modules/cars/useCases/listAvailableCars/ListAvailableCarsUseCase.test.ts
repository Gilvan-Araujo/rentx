import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory,
        );
    });

    it("should be able to list all available cars", async () => {
        const allAvailableCarsEmpty = await listAvailableCarsUseCase.execute(
            {},
        );

        expect(allAvailableCarsEmpty).toEqual([]);

        const car = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car description",
            daily_rate: 110.0,
            license_plate: "DEF-1234",
            fine_amount: 40,
            brand: "Car_brand",
            category_id: "category_id",
        });

        const allAvailableFull = await listAvailableCarsUseCase.execute({});

        expect(allAvailableFull).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car2",
            description: "Car description",
            daily_rate: 110.0,
            license_plate: "DEF-1234",
            fine_amount: 40,
            brand: "Car_brand_test",
            category_id: "category_id",
        });

        const allAvailableCarsByBrand = await listAvailableCarsUseCase.execute({
            brand: "Car_brand_test",
        });

        expect(allAvailableCarsByBrand).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car3",
            description: "Car description",
            daily_rate: 110.0,
            license_plate: "DEF-1234",
            fine_amount: 40,
            brand: "Car_brand_test",
            category_id: "category_id",
        });

        const allAvailableCarsByName = await listAvailableCarsUseCase.execute({
            name: "Car3",
        });

        expect(allAvailableCarsByName).toEqual([car]);
    });

    it("should be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car4",
            description: "Car description",
            daily_rate: 110.0,
            license_plate: "DEF-1234",
            fine_amount: 40,
            brand: "Car_brand_test",
            category_id: "12345",
        });

        const allAvailableCarsByCategory =
            await listAvailableCarsUseCase.execute({
                category_id: "12345",
            });

        expect(allAvailableCarsByCategory).toEqual([car]);
    });
});
