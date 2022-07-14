import { IPrefix } from './prefix.interface';

export interface ICountry {
  id: number;
  name: string;
  code: string;

  prefixes?: IPrefix[];
}
