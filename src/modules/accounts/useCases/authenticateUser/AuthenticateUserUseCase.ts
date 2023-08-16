import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@/modules/accounts/repositories/IUsersRepository";
import { AppError } from "@/shared/errors/AppError";

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
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const throwError = () => {
            throw new AppError("Email or password incorrect!");
        };

        const user = await this.usersRepository.findByEmail(email);

        if (!user) throwError();

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) throwError();

        const token = sign({}, "24cc75bdb155319d56b7e1b3b0c96772", {
            subject: user.id,
            expiresIn: "1d",
        });

        return {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}

export { AuthenticateUserUseCase };
