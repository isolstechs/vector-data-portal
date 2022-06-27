import {
  CALL_RECORD_MODEL,
  COUNTRY_MODEL,
  OPERATOR_MODEL,
  PREFIX_MODEL,
} from 'src/core/constant/repsitory.constant';
import { CallRecordModel } from 'src/core/database/model/call-record.model';
import { CountryModel } from 'src/core/database/model/country.model';
import { OperatorModel } from 'src/core/database/model/operator.model';
import { PrefixModel } from 'src/core/database/model/prefix.model';

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
