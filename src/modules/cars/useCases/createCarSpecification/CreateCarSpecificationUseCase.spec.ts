import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationInMemory } from "../../repositories/in-memory/SpecificationInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationInMemory;

describe("Create Car Specification", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory = new SpecificationInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory
        );
    });

    it("should not be able to add a new specification to a non existent car", async () => {
        const car_id = "1234";
        const specifications_id = ["54321"];

        await expect(
            createCarSpecificationUseCase.execute({
                car_id,
                specifications_id,
            })
        ).rejects.toEqual(new AppError("Car does not exists"));
    });

    it("should be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            brand: "Test Brand",
            name: "Test Name",
            description: "Test Description2",
            daily_rate: 15,
            license_plate: "I19823-Test",
            fine_amount: 60,
            category_id: "teste",
        });

        const specification = await specificationsRepositoryInMemory.create({
            description: "test",
            name: "test",
        });

        const specifications_id = [specification.id];
        const specificationsCars = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id,
        });

        expect(specificationsCars).toHaveProperty("specifications");
        expect(specificationsCars.specifications.length).toBe(1);
    });
});
