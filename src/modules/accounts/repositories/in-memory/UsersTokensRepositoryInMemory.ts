import { ICreateUsersTokensDTO } from "../../dtos/ICreateUsersTokenDTO";
import { UserTokens } from "../../infra/typeorm/entities/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    userTokens: UserTokens[] = [];

    async create(data: ICreateUsersTokensDTO): Promise<UserTokens> {
        const userToken = new UserTokens();

        Object.assign(userToken, data);

        this.userTokens.push(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string,
    ): Promise<UserTokens> {
        const userToken = this.userTokens.find(
            (token) =>
                token.user_id === user_id &&
                token.refresh_token === refresh_token,
        );

        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        const userToken = this.userTokens.find((token) => token.id === id);

        this.userTokens.splice(this.userTokens.indexOf(userToken));
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = this.userTokens.find(
            (token) => token.refresh_token === refresh_token,
        );

        return userToken;
    }
}

export { UsersTokensRepositoryInMemory };
