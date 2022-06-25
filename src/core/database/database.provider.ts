import { Sequelize } from 'sequelize-typescript';
import * as mysql2 from 'mysql2';
import { SEQUELIZE } from '../constant/index.constant';
import { seed } from './seed/db.seed';
import { CountryModel } from './model/country.model';
import { DataModel } from './model/data.model';
import { OperatorModel } from './model/operator.model';

const force: any = process.env.PROD_DB_FORCE ?? false; // <----------------- To Initialize Database
const alter: any = process.env.PROD_DB_ALTER ?? false; // <----------------- To Alternate Database

export const databaseProvider = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        database: process.env.PROD_DB_NAME || 'vector-data-portal',
        dialect: 'mysql',
        username: process.env.PROD_USER_NAME || 'root',
        password: process.env.PROD_DB_PASSWORD || '',
        host: 'localhost',
        port: 3306,
        dialectModule: mysql2,
        define: {
          timestamps: false,
        },
        logging: false,
      });
      sequelize.addModels([CountryModel, DataModel, OperatorModel]);

      await sequelize.sync({ force, alter }).then(async () => {
        if (force) {
          await seed();
          setTimeout(() => {
            console.log('database created');
          }, 500);
        } else if (alter) {
          setTimeout(() => {
            console.log('\nDB updated\n');
          }, 500);
        }
      });
      return sequelize;
    },
  },
];
