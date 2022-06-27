import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICallRecord } from '../../interfaces/call-record.interface';
import { IDate } from '../../interfaces/date.interaface';
import { ApiService } from '../../services/core/api.service';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  API_URL = `${environment.apiUrl}/home`;

  constructor(private _apiService: ApiService) {}

  createCallRecords(_callRecords: ICallRecord[]): Observable<any> {
    return this._apiService.request(
      'post',
      this.API_URL + '/create-call-records',
      _callRecords,
    );
  }

  getCallrecords(_date: IDate): Observable<ICallRecord[]> {
    return this._apiService.request(
      'post',
      this.API_URL + '/get-call-records',
      _date,
    );
  }
}
