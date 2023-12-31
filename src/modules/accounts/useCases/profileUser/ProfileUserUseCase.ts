import { inject } from "tsyringe";

import { IUserResponseDTO } from "../../dtos/IUserResponseDTO";
import { UserMap } from "../../mapper/UserMap";
import { IUsersRepository } from "../../repositories/IUsersRepository";

class ProfileUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) {}

    async execute(id: string): Promise<IUserResponseDTO> {
        const user = await this.usersRepository.findById(id);

        return UserMap.toDTO(user);
    }
}

export { ProfileUserUseCase };
