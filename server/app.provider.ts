import { COUNTRY_MODEL } from './core/constant/repsitory.constant';
import { CountryModel } from './core/database/model/country.model';

export const AppProviders = [
  {
    provide: COUNTRY_MODEL,
    useValue: CountryModel,
  },
];
