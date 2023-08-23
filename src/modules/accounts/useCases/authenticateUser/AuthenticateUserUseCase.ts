import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@/config/auth";
import { IUsersRepository } from "@/modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@/shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@/shared/errors/AppError";

import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
    refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const throwError = () => {
            throw new AppError("Email or password incorrect!");
        };

        const {
            secret_token,
            expires_in_token,
            secret_refresh_token,
            expires_in_refresh_token,
            expires_refresh_token_days,
        } = auth;

        const user = await this.usersRepository.findByEmail(email);

        if (!user) throwError();

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) throwError();

        const token = sign({}, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token,
        });

        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token,
        });

        const refresh_token_expires_date = this.dateProvider.addDays(
            expires_refresh_token_days,
        );

        await this.usersTokensRepository.create({
            user_id: user.id,
            expires_date: refresh_token_expires_date,
            refresh_token,
        });

        return {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
            refresh_token,
        };
    }
}

export { AuthenticateUserUseCase };
