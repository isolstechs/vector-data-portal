import {
  CALL_RECORD_MODEL,
  COUNTRY_MODEL,
  OPERATOR_MODEL,
  PREFIX_MODEL,
} from 'server/core/constant/repsitory.constant';
import { CallRecordModel } from 'server/core/database/model/call-record.model';
import { CountryModel } from 'server/core/database/model/country.model';
import { OperatorModel } from 'server/core/database/model/operator.model';
import { PrefixModel } from 'server/core/database/model/prefix.model';

export const HomeProviders = [
  {
    provide: CALL_RECORD_MODEL,
    useValue: CallRecordModel,
  },
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
