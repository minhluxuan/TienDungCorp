import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "src/common/contants";
import { User } from "../user.entity";
import { UUID } from "crypto";

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly spsoRepository: typeof User) {}

    async findOneById(id: UUID) {
        const user = await this.spsoRepository.findByPk(id);
        if (user) {
            delete user.dataValues.password;
            return user.dataValues;
        }

        return null;
    }
}