import { Inject, Injectable } from '@nestjs/common';
import {
  COUNTRY_MODEL,
  OPERATOR_MODEL,
  PREFIX_MODEL,
} from './core/constant/repsitory.constant';
import { CountryModel } from './core/database/model/country.model';
import { OperatorModel } from './core/database/model/operator.model';
import { PrefixModel } from './core/database/model/prefix.model';

@Injectable()
export class AppService {
  constructor(
    @Inject(COUNTRY_MODEL) private _countryModel: typeof CountryModel,
    @Inject(OPERATOR_MODEL) private _operatorModel: typeof OperatorModel,
    @Inject(PREFIX_MODEL) private _prefixModel: typeof PrefixModel
  ) {}
  async getCountries(): Promise<any> {
    return this._countryModel.findAll({
      attributes: ['id', 'name', 'code'],
    });
  }

  async getOperators(): Promise<any> {
    return this._operatorModel.findAll({
      attributes: ['id', 'name'],
    });
  }

  async getPrefixes(): Promise<any> {
    return this._prefixModel.findAll({
      attributes: ['id', 'prefix', 'countryId', 'operatorId'],
    });
  }
}
