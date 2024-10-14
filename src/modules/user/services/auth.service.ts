import { Inject, Injectable } from "@nestjs/common";
import { User } from "../user.entity";
import * as bcrypt from 'bcrypt';
import { UUID } from "crypto";
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from "src/common/contants";

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private readonly jwtService: JwtService,
    ) {}

    public async login(user) {
        const accessTokenPayload = {
            id: user.id
        }

        const accessToken = await this.generateAccessToken(accessTokenPayload);
        
        delete user.password;
        return { user, accessToken };
    }

    public async generateAccessToken(payload) {
        const token = await this.jwtService.signAsync(payload);
        return token;
    }

    async validateUser(username: string, enteredPassword: string) {
        const existedUser = await this.userRepository.findOne({
            where: {
                username
            }
        });

        if (!existedUser) {
            return null;
        }

        const passwordMatched: boolean = await this.comparePassword(enteredPassword, existedUser.password);
        if (!passwordMatched) {
            return null;
        }

        const { password, ...result } = existedUser['dataValues'];
        return result;
    }

    private async comparePassword(enteredPassword: string, dbPassword: string) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    async decodeAccessToken(token: string) {
        return await this.jwtService.verifyAsync(token);
    }
}