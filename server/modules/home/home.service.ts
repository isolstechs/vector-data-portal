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

@Injectable()
export class HomeService {
  constructor(
    @Inject(CALL_RECORD_MODEL) private _callRecordModel: typeof CallRecordModel,
    @Inject(COUNTRY_MODEL) private _countryModel: typeof CountryModel,
    @Inject(OPERATOR_MODEL) private _operatorModel: typeof OperatorModel,
    @Inject(PREFIX_MODEL) private _prefixModel: typeof PrefixModel
  ) {}
  async create(_createCallrecords: ICallRecord[]) {
    let callRecords: ICallRecord[] = [];
    let prefixCodes = _createCallrecords.map(
      (_ccr: ICallRecord) => _ccr.prefix
    );

    const prefixes = await this._prefixModel.findAll({
      where: { code: { [Op.in]: prefixCodes } },
      attributes: ['id', 'code', 'countryId', 'operatorId'],
      raw: true,
    });

    _createCallrecords.forEach((_ccr: ICallRecord) => {
      const prefix = prefixes.find((_p: IPrefix) => _p.code == _ccr.prefix);
      if (!prefix) {
        throw new NotImplementedException(
          'Could not found given prefix! Prefix: ' + _ccr.prefix
        );
      }
      callRecords.push({
        aParty: _ccr.aParty,
        bParty: _ccr.bParty,
        date: _ccr.date,
        sessionTime: _ccr.sessionTime,
        prefixId: prefix.id,
      });
    });

    await this._callRecordModel.bulkCreate(callRecords as any);
  }

  async findAll(_date: IDate): Promise<any> {
    let where;

    if (_date.start != 'all') {
      where = { date: { [Op.between]: [_date.start, _date.end] } };
    }

    return await this._callRecordModel.findAll({
      where,
      attributes: ['id', 'aParty', 'bParty', 'date', 'sessionTime'],
      include: [
        {
          model: this._prefixModel,
          attributes: ['id', 'code', 'countryId', 'operatorId'],
          include: [
            {
              model: this._countryModel,
              attributes: ['name', 'alphaCode', 'numericCode'],
            },
            {
              model: this._operatorModel,
              attributes: ['name'],
            },
          ],
        },
      ],
    });
  }
}
