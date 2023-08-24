import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IDateProvider } from "@/shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@/shared/errors/AppError";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) {}

    async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.usersTokensRepository.findByRefreshToken(
            token,
        );

        if (!userToken) throw new AppError("Token invalid!");

        const isDateBefore = this.dateProvider.compareIfDateIsBefore(
            userToken.expires_date,
            this.dateProvider.dateNow(),
        );

        if (isDateBefore) throw new AppError("Token expired!");

        const user = await this.usersRepository.findById(userToken.user_id);

        user.password = await hash(password, 8);

        await this.usersRepository.create(user);

        await this.usersTokensRepository.deleteById(userToken.id);
    }
}

export { ResetPasswordUseCase };
