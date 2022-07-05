import { IPrefix } from './prefix.interface';

export interface ICountry {
  id: number;
  name: string;
  numericCode: number;
  alphaCode: string;

  prefixes?: IPrefix[];
}
