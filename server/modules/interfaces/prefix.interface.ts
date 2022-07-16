import { ICountry } from './country.interface';
import { IOperator } from './operator.interface';

export interface IPrefix {
  id?: number;
  prefix: number;

  countryId: number;
  operatorId: number;

  country?: ICountry;
  operator?: IOperator;
}
