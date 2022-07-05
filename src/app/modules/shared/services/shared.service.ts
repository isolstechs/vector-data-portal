import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ICountry } from '../../interfaces/country.interface';
import { SharedApiService } from './shared-api.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _countriesSubject: BehaviorSubject<ICountry[]> = new BehaviorSubject<
    ICountry[]
  >([]);

  constructor(private _sharedApiService: SharedApiService) {}

  get countries$(): Observable<ICountry[]> {
    return this._countriesSubject.asObservable();
  }

  getCountreis(): Observable<ICountry[]> {
    return this._sharedApiService.getCountries().pipe(
      tap((_countries: ICountry[]) => {
        if (_countries.length) {
          this._countriesSubject.next(_countries);
        }
      })
    );
  }
}
