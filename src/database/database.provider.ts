import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../common/contants';
import { databaseConfig } from './database.config';
import { User } from 'src/modules/user/user.entity';
import { Project } from 'src/modules/project/project.entity';
import { File } from 'src/modules/storage/file.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Project, File]);
      await sequelize.sync();

      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
        await sequelize.sync();
        console.log('Database synchronized successfully');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      
      return sequelize;
    },
  },
];
