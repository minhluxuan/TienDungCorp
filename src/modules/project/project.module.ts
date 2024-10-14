import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { projectProvider } from './project.provider';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ResponseModule } from '../response/response.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { StorageModule } from '../storage/storage.module';
import { storageProvider } from '../storage/storage.provider';

@Module({
    imports: [DatabaseModule, ResponseModule, JwtModule.register({
		secret: process.env.JWT_ACCESS_KEY,
		signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
}), UserModule, StorageModule],
    providers: [...projectProvider, ProjectService, ...storageProvider],
    controllers: [ProjectController],
    exports: [ProjectService, ...projectProvider]
})
export class ProjectModule {}
