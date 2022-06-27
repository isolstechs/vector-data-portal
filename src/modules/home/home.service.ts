import { Inject, Injectable } from '@nestjs/common';
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
import { ICallRecord } from '../interfaces/call-record.interface';
import { IDate } from '../interfaces/date.interaface';

@Injectable()
export class HomeService {
  constructor(
    @Inject(CALL_RECORD_MODEL) private _callRecordModel: typeof CallRecordModel,
    @Inject(COUNTRY_MODEL) private _countryModel: typeof CountryModel,
    @Inject(OPERATOR_MODEL) private _operatorModel: typeof OperatorModel,
    @Inject(PREFIX_MODEL) private _prefixModel: typeof PrefixModel,
  ) {}
  async create(_createCallrecords: ICallRecord[]) {
    const prefixes = this._prefixModel.findAll({
      raw: true,
    });

    return 'This action adds a new home';
  }

  findAll(_date: IDate) {
    return `This action returns all home`;
  }

  export(_date: IDate) {
    // return `This action returns a #${id} home`;
  }
}
