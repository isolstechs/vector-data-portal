import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICountry } from '../../interfaces/country.interface';
import { IOperator } from '../../interfaces/operator.interface';
import { IPrefix } from '../../interfaces/prefix.interface';
import { ApiService } from '../../services/core/api.service';

@Injectable({
  providedIn: 'root',
})
export class SharedApiService {
  API_URL = `${environment.apiUrl}`;

  constructor(private _apiService: ApiService) {}

  getCountries(): Observable<ICountry[]> {
    return this._apiService.request('get', this.API_URL + '/get-countries');
  }

  getOperators(): Observable<IOperator[]> {
    return this._apiService.request('get', this.API_URL + '/get-operators');
  }

  getPrefixes(): Observable<IPrefix[]> {
    return this._apiService.request('get', this.API_URL + '/get-prefixes');
  }
}
