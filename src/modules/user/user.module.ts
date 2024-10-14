import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectModule } from '../project/project.module';
import { userProvider } from './user.provider';
import { UserService } from './services/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ResponseModule } from '../response/response.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [DatabaseModule, forwardRef(() => ProjectModule), JwtModule.register({
		secret: process.env.JWT_ACCESS_KEY,
		signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
}), ResponseModule],
    providers: [...userProvider, UserService, AuthService, LocalStrategy],
    controllers: [AuthController],
    exports: [UserService, AuthService]
})
export class UserModule {}
