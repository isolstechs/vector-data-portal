import { ICallRecord } from 'src/modules/interfaces/call-record.interface';
import { IPrefix } from 'src/modules/interfaces/prefix.interface';

export class CreateCallRecord implements ICallRecord {
  id?: number;
  aParty: string;
  bParty: string;
  date: string;
  sessionTime: string;

  prefixId: number;
  prefix: IPrefix | number;
}
