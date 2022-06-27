import { Inject, Injectable } from '@nestjs/common';
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
import { ICallRecord } from '../interfaces/call-record.interface';
import { IDate } from '../interfaces/date.interaface';
import { IPrefix } from '../interfaces/prefix.interface';

@Injectable()
export class HomeService {
  constructor(
    @Inject(CALL_RECORD_MODEL) private _callRecordModel: typeof CallRecordModel,
    @Inject(COUNTRY_MODEL) private _countryModel: typeof CountryModel,
    @Inject(OPERATOR_MODEL) private _operatorModel: typeof OperatorModel,
    @Inject(PREFIX_MODEL) private _prefixModel: typeof PrefixModel
  ) {}
  async create(_createCallrecords: ICallRecord[]) {
    // const prefixes: IPrefix[] = this._prefixModel.findAll({
    //   raw: true,
    // }) as any;
    console.log();

    // _createCallrecords.forEach((_ccr: ICallRecord) => {
    //   console.log(_ccr);
    // });

    // return prefixes;
  }

  findAll(_date: IDate) {
    return `This action returns all home`;
  }

  export(_date: IDate) {
    // return `This action returns a #${id} home`;
  }
}
