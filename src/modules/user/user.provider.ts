import { USER_REPOSITORY } from "src/common/contants";
import { User } from "./user.entity";

export const userProvider = [
    {
        provide: USER_REPOSITORY,
        useValue: User
    }
]