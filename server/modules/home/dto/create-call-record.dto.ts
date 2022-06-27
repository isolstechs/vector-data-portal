import { ICallRecord } from 'server/modules/interfaces/call-record.interface';
import { IPrefix } from 'server/modules/interfaces/prefix.interface';

export class CreateCallRecord implements ICallRecord {
  id?: number;
  aParty: string;
  bParty: string;
  date: string;
  sessionTime: string;

  prefixId: number;
  prefix: IPrefix | number;
}
