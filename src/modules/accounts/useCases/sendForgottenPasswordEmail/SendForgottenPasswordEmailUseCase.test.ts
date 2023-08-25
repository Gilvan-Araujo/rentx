import { UsersRepositoryInMemory } from "@/modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { DayJsDateProvider } from "@/shared/container/providers/DateProvider/implementations/DayJsProvider";
import { MailProviderInMemory } from "@/shared/container/providers/MailProvider/implementations/in-memory/MailProviderInMemory";
import { AppError } from "@/shared/errors/AppError";

import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { SendForgottenPasswordEmailUseCase } from "./SendForgottenPasswordEmailUseCase";

let sendForgottenPasswordEmailUseCase: SendForgottenPasswordEmailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let mailProvider: MailProviderInMemory;

describe("SendForgottenPasswordEmailUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayJsDateProvider();
        mailProvider = new MailProviderInMemory();

        sendForgottenPasswordEmailUseCase =
            new SendForgottenPasswordEmailUseCase(
                usersRepositoryInMemory,
                usersTokensRepositoryInMemory,
                dateProvider,
                mailProvider,
            );
    });

    it("should be able to send a forgotten password email to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail");

        await usersRepositoryInMemory.create({
            driver_license: "664169",
            email: "a@a.com",
            name: "User Test",
            password: "1234",
        });

        await sendForgottenPasswordEmailUseCase.execute("a@a.com");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send an email if user does not exists", async () => {
        expect(
            sendForgottenPasswordEmailUseCase.execute("a@a.com"),
        ).rejects.toEqual(new AppError("User does not exists!"));
    });

    it("should be able to create an users token", async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemory,
            "create",
        );

        await usersRepositoryInMemory.create({
            driver_license: "664169",
            email: "a@a.com",
            name: "User Test",
            password: "1234",
        });

        await sendForgottenPasswordEmailUseCase.execute("a@a.com");

        expect(generateTokenMail).toBeCalled();
    });
});
