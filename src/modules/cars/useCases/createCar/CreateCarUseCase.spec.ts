import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepository = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepository);
    });
    it("should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            brand: "Test Brand",
            name: "Test Name",
            description: "Test Description",
            daily_rate: 15,
            license_plate: "I19823-Test",
            fine_amount: 60,
            category_id: "teste",
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a new car when license plate already exists", async () => {
        await createCarUseCase.execute({
            brand: "Test1",
            name: "Test Name",
            description: "Test Description",
            daily_rate: 15,
            license_plate: "I19823-Test",
            fine_amount: 60,
            category_id: "teste",
        });

        await expect(
            createCarUseCase.execute({
                brand: "Test2",
                name: "Test Name",
                description: "Test Description",
                daily_rate: 15,
                license_plate: "I19823-Test",
                fine_amount: 60,
                category_id: "teste",
            })
        ).rejects.toEqual(new AppError("Car already exists"));
    });

    it("should be able to create a car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            brand: "Car Available",
            name: "Test Name",
            description: "Test Description",
            daily_rate: 15,
            license_plate: "I19823-12Test",
            fine_amount: 60,
            category_id: "teste",
        });

        expect(car.available).toBe(true);
    });
});
