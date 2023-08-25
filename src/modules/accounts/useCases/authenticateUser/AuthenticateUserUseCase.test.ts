import { ICreateUserDTO } from "@/modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@/modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { DayJsDateProvider } from "@/shared/container/providers/DateProvider/implementations/DayJsProvider";
import { AppError } from "@/shared/errors/AppError";

import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJsDateProvider;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayJsDateProvider();

        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            email: "test@test.com",
            password: "1234",
            driver_license: "000123",
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate a non-existent user", async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: "test@test.com",
                password: "1234",
            }),
        ).rejects.toEqual(new AppError("Email or password incorrect!"));
    });

    it("should not be able to authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            email: "test@test.com",
            password: "1234",
            driver_license: "000123",
        };

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrectPassword",
            }),
        ).rejects.toEqual(new AppError("Email or password incorrect!"));
    });
});
