import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../constant/index.constant';
import { seed } from './seed/db.seed';
import * as pg from 'pg';
import { CountryModel } from './model/country.model';
import { OperatorModel } from './model/operator.model';
import { CallRecordModel } from './model/call-record.model';
import { PrefixModel } from './model/prefix.model';

let force = false; // <----------------- To Initialize Database
let alter = false; // <----------------- To Initialize Database

force =
  typeof process.env['PROD_DB_FORCE'] == 'string'
    ? process.env['PROD_DB_FORCE'] == 'true'
    : force;
alter =
  typeof process.env['PROD_DB_ALTER'] == 'string'
    ? process.env['PROD_DB_ALTER'] == 'true'
    : alter;
export const databaseProvider = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        database: process.env['PROD_DB_NAME'] || 'vector-data-portal',
        dialect: 'postgres',
        username: process.env['PROD_USER_NAME'] || 'postgres',
        password: process.env['PROD_DB_PASSWORD'] || 'root',
        host: 'localhost',
        port: 5432,
        dialectModule: pg,
        define: {
          timestamps: false,
        },
        logging: false,
      });
      sequelize.addModels([
        CallRecordModel,
        CountryModel,
        OperatorModel,
        PrefixModel,
      ]);

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
