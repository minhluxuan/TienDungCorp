import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './modules/project/project.module';
import { StorageModule } from './modules/storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { appProviders } from './app.provider';

@Module({
  imports: [ProjectModule, StorageModule, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService, ...appProviders],
})
export class AppModule {}
