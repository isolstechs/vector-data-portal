import { Inject, Injectable } from '@nestjs/common';
import { COUNTRY_MODEL } from './core/constant/repsitory.constant';
import { CountryModel } from './core/database/model/country.model';

@Injectable()
export class AppService {
  constructor(
    @Inject(COUNTRY_MODEL) private _countryModel: typeof CountryModel
  ) {}
  async getCountries(): Promise<any> {
    return this._countryModel.findAll({
      attributes: ['id', 'name', 'code'],
    });
  }
}
