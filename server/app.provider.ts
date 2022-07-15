import {
  COUNTRY_MODEL,
  OPERATOR_MODEL,
  PREFIX_MODEL,
} from './core/constant/repsitory.constant';
import { CountryModel } from './core/database/model/country.model';
import { OperatorModel } from './core/database/model/operator.model';
import { PrefixModel } from './core/database/model/prefix.model';

export const AppProviders = [
  {
    provide: COUNTRY_MODEL,
    useValue: CountryModel,
  },
  {
    provide: OPERATOR_MODEL,
    useValue: OperatorModel,
  },
  {
    provide: PREFIX_MODEL,
    useValue: PrefixModel,
  },
];
