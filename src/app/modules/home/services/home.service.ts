import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ICallRecord } from '../../interfaces/call-record.interface';
import { IDate } from '../../interfaces/date.interaface';
import { HomeApiService } from './home-api.service';

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

  getCallRecord(_date: IDate): Observable<ICallRecord[]> {
    return this._homeApiService.getCallrecords(_date).pipe(
      tap((_callRecords: ICallRecord[]) => {
        if (_callRecords.length) {
          this.callRecordsSubject.next(_callRecords);
        }
      }),
    );
  }
}
