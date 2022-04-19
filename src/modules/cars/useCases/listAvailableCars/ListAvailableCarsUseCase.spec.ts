import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory
        );
    });
    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Polo",
            description: "Sedan",
            daily_rate: 150,
            license_plate: "JPA-0092",
            fine_amount: 100,
            brand: "Ford",
            category_id: "49c65c06-ed91-4903-98c2-ed32010f08ad",
        });
        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car_2",
            description: "Sedan",
            daily_rate: 150,
            license_plate: "JPA-0092",
            fine_amount: 100,
            brand: "Car_brand_2",
            category_id: "49c65c06-ed91-4903-98c2-ed32010f08ad",
        });
        const cars = await listAvailableCarsUseCase.execute({
            brand: "Car_brand_2",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car_3",
            description: "Sedan",
            daily_rate: 150,
            license_plate: "JPA-00922",
            fine_amount: 100,
            brand: "Car_brand33",
            category_id: "49c65c06-ed91-4903-98c2-ed32010f08ad",
        });
        const cars = await listAvailableCarsUseCase.execute({
            name: "Car_3",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car_3",
            description: "Sedan",
            daily_rate: 150,
            license_plate: "JPA-00922",
            fine_amount: 100,
            brand: "Car_brand33",
            category_id: "49c65c06-ed91-4903-98c2-ed32010f08ad",
        });
        const cars = await listAvailableCarsUseCase.execute({
            name: "Car_3",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car_3",
            description: "Sedan",
            daily_rate: 150,
            license_plate: "JPA-00922",
            fine_amount: 100,
            brand: "Car_brand33",
            category_id: "12345",
        });
        const cars = await listAvailableCarsUseCase.execute({
            category_id: "12345",
        });

        expect(cars).toEqual([car]);
    });
});
