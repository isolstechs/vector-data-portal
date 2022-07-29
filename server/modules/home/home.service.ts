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
import * as sequelize from 'sequelize';

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
    let callRecords: ICallRecord[] = [];
    let prefixObj = {};
    let prefixCodes = _createCallrecords.map(
      (_ccr: ICallRecord) => _ccr.prefix
    );

    const prefixes: any = await this._prefixModel.findAll({
      where: { prefix: { [Op.in]: prefixCodes } },
      attributes: ['id', 'prefix'],
      raw: true,
    });

    // saving prefixes as object
    prefixes.forEach((_p: IPrefix) => (prefixObj[_p.prefix] = _p.id));

    _createCallrecords.forEach((_ccr: ICallRecord) => {
      if (!prefixObj[_ccr.prefix as any]) {
        throw new NotImplementedException(
          `Prefix "${_ccr.prefix}" not found in database. Please upload prefix first and try again.`
        );
      }
      callRecords.push({
        aParty: _ccr.aParty,
        bParty: _ccr.bParty,
        date: _ccr.date,
        sessionTime: _ccr.sessionTime,
        prefixId: prefixObj[_ccr.prefix as any],
        trmType: _ccr.trmType,
      });
    });
    // for (let j = 0; j < 10000; j++) {
    //   console.log(j);

    let i = 0;
    let count = 0;

    while (count <= callRecords.length) {
      await this._callRecordModel.bulkCreate(
        callRecords.slice(count, (i + 1) * 10000) as any
      );

      count += 10000;
      ++i;
    }
    // }

    await this._callRecordModel.sequelize.query(
      `
      
    DELETE  FROM
    "call-records" a
  	  USING "call-records" b
  WHERE
    a.id > b.id
  AND a."prefixId" = b."prefixId"
  AND a."aParty" = b."aParty"
  AND a."bParty" = b."bParty"
  AND a.date = b.date
  AND a."sessionTime" = b."sessionTime"
  AND a."trmType" = b."trmType"
    
      `

      //   `DELETE a FROM \`call-records\` a
      // INNER JOIN \`call-records\` b
      // WHERE
      //     a.id < b.id
      //     AND a.aParty = b.aParty
      //     AND a.bParty = b.bParty
      //     AND a.date = b.date
      //     AND a.sessionTime = b.sessionTime
      //     AND a.trmType = b.trmType
      //     AND a.prefixId = b.prefixId;`
    );

    //     await this._callRecordModel.sequelize.query(`
    //     DELETE
    // FROM
    //     call-records a
    //         USING call-records b
    // WHERE
    //     a.id < b.id
    //     AND a.aParty = b.aParty
    //     AND a.bParty = b.bParty
    //     AND a.date = b.date
    //     AND a.sessionTime = b.sessionTime
    //     AND a.trmType = b.trmType
    //     AND a.prefixId = b.prefixId
    //     `);
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
        attributes: [
          'aParty',
          'bParty',
          'date',
          'sessionTime',
          'prefixId',
          'trmType',
        ],
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

    // getting coming prefixes from db, if available we will filter them
    const prefixesFromDb = await PrefixModel.findAll({
      where: {
        prefix: {
          [Op.in]: _prefixData.map((_p) => _p.prefix),
        },
      },
    });

    // creating prefixes obj
    const prefixesLookupObj = _.keyBy(prefixesFromDb, function (o) {
      return o.prefix;
    });

    _prefixData = _.filter(_prefixData, function (u) {
      return prefixesLookupObj[u.prefix] == undefined;
    });

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
    // countries = _.uniqBy(countries, 'name');

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
    let countriesResults;
    try {
      countriesResults = await Promise.all(countryPrimiseArray);
    } catch (error) {
      if (
        error.message == 'WHERE parameter "code" has invalid "undefined" value'
      ) {
        throw new NotImplementedException(
          'Does not found provided country(s) in the database. Please check country list to confirm provided country names matches countries in the database'
        );
      }

      throw new NotImplementedException('Error! Cannot create country');
    }

    const operatorsObj = _.keyBy(operatorsResults, function (_o) {
      return _o[0]?.name;
    });

    const countriesObj = _.keyBy(countriesResults, function (_o) {
      return _o[0]?.name;
    });

    // creating operators object
    // operatorsResults.forEach(([_operator, _c]) => {
    //   operatorsObj[_operator?.dataValues.name] = _operator?.dataValues.id;
    // });

    // creating countries object
    // countriesResults.forEach(([_country, _c]) => {
    //   countriesObj[_country?.dataValues.name] = _country?.dataValues.id;
    // });

    const prefixesToBeSaved = [];
    _prefixData.forEach((_p) => {
      prefixesToBeSaved.push({
        prefix: _p.prefix,
        countryId: countriesObj[_p.country][0]?.id,
        operatorId: operatorsObj[_p.operator][0]?.id,
      });
    });

    await PrefixModel.bulkCreate(prefixesToBeSaved);
  }
}
