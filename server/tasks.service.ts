import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CALL_RECORD_MODEL } from './core/constant/repsitory.constant';
import { CallRecordModel } from './core/database/model/call-record.model';

@Injectable()
export class TasksService {
  constructor(
    @Inject(CALL_RECORD_MODEL) private _callRecordModel: typeof CallRecordModel
  ) {}
  @Cron('40 3 * * *')
  async handleCron() {
    if (process.env['PROD_DB_NAME']) {
      await this._callRecordModel.sequelize.query(
        `DELETE  FROM
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
      );
    }
  }
}
