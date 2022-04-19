import { inject, injectable } from "tsyringe";

import { IUserResponseDTO } from "../../../accounts/dtos/IUserResponseDTO";
import { UserMap } from "../../../accounts/mapper/UserMap";
import { IUsersRepository } from "../../../accounts/repositories/IUsersRepository";

@injectable()
class ProfileUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}
    async execute(id: string): Promise<IUserResponseDTO> {
        const user = await this.usersRepository.findById(id);
        return UserMap.toDTO(user);
    }
}

export { ProfileUserUseCase };
