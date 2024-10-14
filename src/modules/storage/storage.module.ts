import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageService } from './storage.service';
import { storageProvider } from './storage.provider';
import { StorageController } from './storage.controller';
import { UserModule } from '../user/user.module';
import { ResponseModule } from '../response/response.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from '../project/project.module';

@Module({
    imports: [DatabaseModule, ResponseModule, JwtModule.register({
		secret: process.env.JWT_ACCESS_KEY,
		signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
}), UserModule, forwardRef(() => ProjectModule)],
    providers: [StorageService, ...storageProvider],
    exports: [StorageService],
    controllers: [StorageController]
})
export class StorageModule {}
