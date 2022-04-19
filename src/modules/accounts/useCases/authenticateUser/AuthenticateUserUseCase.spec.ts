import { expect } from "@jest/globals";

import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "0018123",
            name: "User Test",
            email: "test@test.com",
            password: "1234",
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });
        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate a non existent user", async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "231u3",
            })
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });

    it("should not be able to authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            driver_license: "3489",
            email: "user@testeuser.com",
            password: "1234",
            name: "User test error",
        };

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrectPassword",
            })
        ).rejects.toEqual(new AppError("Email or password incorrect"));
    });
});
