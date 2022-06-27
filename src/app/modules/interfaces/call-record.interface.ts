import { IPrefix } from './prefix.interface';

export interface ICallRecord {
  id?: number;
  aParty: string;
  bParty: string;
  date: string;
  sessionTime: string;

  prefixId: number;
  prefix: IPrefix;
}
