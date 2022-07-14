import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICountry } from '../../interfaces/country.interface';
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
}
