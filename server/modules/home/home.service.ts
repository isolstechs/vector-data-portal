import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
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
import { Op } from 'sequelize';
import { ICountry } from '../interfaces/country.interface';
import { IOperator } from '../interfaces/operator.interface';
import * as _ from 'lodash';
import { IPrefixList } from '../interfaces/prefix-list.interface';
import { countryList } from './country-list';

@Injectable()
export class HomeService {
  constructor(
    @Inject(CALL_RECORD_MODEL) private _callRecordModel: typeof CallRecordModel,
    @Inject(COUNTRY_MODEL) private _countryModel: typeof CountryModel,
    @Inject(OPERATOR_MODEL) private _operatorModel: typeof OperatorModel,
    @Inject(PREFIX_MODEL) private _prefixModel: typeof PrefixModel
  ) {}

  // for creating call records
  async create(_createCallrecords: ICallRecord[]) {
    let promiseArray = [];
    let count = 0;
    let callRecords: ICallRecord[] = [];
    let prefixObj = {};
    let prefixCodes = _createCallrecords.map(
      (_ccr: ICallRecord) => _ccr.prefix
    );

    const prefixes = await this._prefixModel.findAll({
      where: { prefix: { [Op.in]: prefixCodes } },
      attributes: ['id', 'prefix'],
      raw: true,
    });

    // saving prefixes as object
    prefixes.forEach((_p: IPrefix) => (prefixObj[_p.prefix] = _p.id));

    _createCallrecords.forEach((_ccr: ICallRecord) => {
      if (!prefixObj[_ccr.prefix as any]) {
        throw new NotImplementedException(
          'Could not found given prefix! Prefix: ' + _ccr.prefix
        );
      }
      callRecords.push({
        aParty: _ccr.aParty,
        bParty: _ccr.bParty,
        date: _ccr.date,
        sessionTime: _ccr.sessionTime,
        prefixId: prefixObj[_ccr.prefix as any],
      });
    });

    let i = 0;
    while (count <= callRecords.length) {
      promiseArray.push(
        this._callRecordModel.bulkCreate(
          callRecords.slice(count, (i + 1) * 10000) as any
        )
      );

      count += 10000;
      ++i;
    }

    await Promise.all(promiseArray);
  }

  // for finding call records
  async findAll(_date: IDate): Promise<any> {
    let where;
    let callRecords;

    if (_date.start != 'all') {
      where = { date: { [Op.gt]: _date.start, [Op.lt]: _date.end } };
    }

    try {
      callRecords = await this._callRecordModel.findAll({
        where,
        attributes: ['aParty', 'bParty', 'date', 'sessionTime', 'prefixId'],
        // include: [
        //   {
        //     model: this._prefixModel,
        //     attributes: ['prefix', 'countryId'],
        //     include: [
        //       { model: this._operatorModel, attributes: ['name'] },
        //       { model: this._countryModel, attributes: ['name', 'code'] },
        //     ],
        //   },
        // ],
      });
    } catch (error) {
      console.log(error);
    }

    return callRecords;
  }

  // for creating prefix
  async createPrefix(_prefixData: IPrefixList[]): Promise<any> {
    let operatorPrimiseArray = [];
    let countryPrimiseArray = [];
    let countries: ICountry[] = [];
    let operators: IOperator[] = [];
    let previousCountry: string;

    _prefixData.forEach((_p: IPrefixList) => {
      // saving country if new than previous one
      _p.country = _p.country.toLowerCase();
      _p.operator = _p.operator.toLowerCase();

      if (_p.country != previousCountry) {
        const country = countryList.find(
          (_c) => _c.name.toLowerCase() == _p.country
        );
        countries.push({ name: _p.country, code: country?.code });

        previousCountry = _p.country;
      }
      operators.push({ name: _p.operator });
    });

    operators = _.uniqBy(operators, 'name');
    countries = _.uniqBy(countries, 'name');

    operators.forEach((_o) => {
      operatorPrimiseArray.push(
        this._operatorModel.findOrCreate({
          where: { name: _o.name },
        })
      );
    });

    countries.forEach((_c) => {
      countryPrimiseArray.push(
        this._countryModel.findOrCreate({
          where: { name: _c.name, code: _c.code },
        })
      );
    });

    const operatorsResults = await Promise.all(operatorPrimiseArray);
    const countriesResults = await Promise.all(countryPrimiseArray);

    const operatorsObj = {};
    const countriesObj = {};

    operatorsResults.forEach(([_operator, _c]) => {
      const operatorVals = _operator?.dataValues;
      operatorsObj[operatorVals.name] = operatorVals.id;
    });

    countriesResults.forEach(([_country, _c]) => {
      const countryVals = _country?.dataValues;
      countriesObj[countryVals.name] = countryVals.id;
    });

    const prefixesToBeSaved = [];
    let prefixes = [];
    _prefixData.forEach((_p) => {
      // prefixes.push({
      //   prefix: _p.prefix,
      //   countryId: countriesObj[_p.country],
      //   operatorId: operatorsObj[_p.operator],
      // });
      prefixesToBeSaved.push(
        this._prefixModel.findOrCreate({
          where: {
            prefix: _p.prefix,
            countryId: countriesObj[_p.country],
            operatorId: operatorsObj[_p.operator],
          },
        })
      );
    });

    // let count = 0;
    // let i = 0;
    // while (count <= prefixes.length) {
    //   prefixesToBeSaved.push(
    //     this._prefixModel.bulkCreate(
    //       prefixes.slice(count, (i + 1) * 10000) as any
    //     )
    //   );

    //   count += 10000;
    //   ++i;
    // }
    await Promise.all(prefixesToBeSaved);
  }
}
