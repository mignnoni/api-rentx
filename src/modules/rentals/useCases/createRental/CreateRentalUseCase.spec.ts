import dayjs from "dayjs";

import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../../cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayJsDateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayJsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "test",
            description: "car test",
            daily_rate: 100,
            license_plate: "test",
            fine_amount: 40,
            category_id: "1234",
            brand: "brand",
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another rental open to the same user", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "213712",
            user_id: "121212",
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "121212",
                car_id: "121321",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Rental in open for this user already"));
    });

    it("should not be able to create a new rental if there is another rental open to the same car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "1001",
            user_id: "121214442",
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "123455512312",
                car_id: "1001",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "121321",
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });
});
