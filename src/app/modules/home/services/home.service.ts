import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ICallRecord } from '../../interfaces/call-record.interface';
import { IDate } from '../../interfaces/date.interaface';
import { IPrefixList } from '../../interfaces/prefix-list.interface';
import { HomeApiService } from './home-api.service';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  callRecordsSubject: BehaviorSubject<ICallRecord[]> = new BehaviorSubject<
    ICallRecord[]
  >([]);

  constructor(private _homeApiService: HomeApiService) {}

  get callRecords$(): Observable<ICallRecord[]> {
    return this.callRecordsSubject.asObservable();
  }

  createCallRecord(_callRecords: ICallRecord[]): Observable<ICallRecord[]> {
    return this._homeApiService.createCallRecords(_callRecords).pipe(tap());
  }

  createPrefixes(_prefixes: IPrefixList[]): Observable<IPrefixList[]> {
    return this._homeApiService.createPrefixes(_prefixes).pipe(tap());
  }

  getCallRecords(_date: IDate): Observable<ICallRecord[]> {
    return this._homeApiService.getCallrecords(_date).pipe(
      tap((_callRecords: ICallRecord[]) => {
        if (_callRecords.length) {
          debugger;
          _callRecords = _.uniqWith(
            _callRecords,
            (_recordA, _recordB) =>
              _recordA.aParty == _recordB.aParty &&
              _recordA.bParty == _recordB.bParty &&
              _recordA.date == _recordB.date &&
              _recordA.sessionTime == _recordB.sessionTime &&
              _recordA.trmType == _recordB.trmType &&
              _recordA.prefixId == _recordB.prefixId
          );
          this.callRecordsSubject.next(_callRecords);
        }
      })
    );
  }
}
