import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SEQUELIZE } from 'src/common/contants';
import { Sequelize } from 'sequelize-typescript';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
		@Inject(SEQUELIZE) private readonly sequelize: Sequelize,
		private readonly authService: AuthService,
		private readonly spsoService: UserService
    ) {
        super({
          usernameField: 'username',
          passwordField: 'password',
        });
      }

    async validate(identifier: string, password: string): Promise<any>{
        const user = await this.authService.validateUser(identifier, password);
        if (!user) {
         	throw new UnauthorizedException('Invalid user credentials');
        }

        return await this.spsoService.findOneById(user.id);
    }
}