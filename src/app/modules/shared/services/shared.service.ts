import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ICountry } from '../../interfaces/country.interface';
import { IOperator } from '../../interfaces/operator.interface';
import { IPrefix } from '../../interfaces/prefix.interface';
import { SharedApiService } from './shared-api.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _countriesSubject: BehaviorSubject<ICountry[]> = new BehaviorSubject<
    ICountry[]
  >([]);

  private _operatorsSubject: BehaviorSubject<IOperator[]> = new BehaviorSubject<
    IOperator[]
  >([]);

  private _prefixesSubject: BehaviorSubject<IPrefix[]> = new BehaviorSubject<
    IPrefix[]
  >([]);

  constructor(private _sharedApiService: SharedApiService) {}

  get countries$(): Observable<ICountry[]> {
    return this._countriesSubject.asObservable();
  }

  get operators$(): Observable<IOperator[]> {
    return this._operatorsSubject.asObservable();
  }

  get prefixes$(): Observable<IPrefix[]> {
    return this._prefixesSubject.asObservable();
  }

  getCountries(): Observable<ICountry[]> {
    return this._sharedApiService.getCountries().pipe(
      tap((_countries: ICountry[]) => {
        if (_countries.length) {
          this._countriesSubject.next(_countries);
        }
      })
    );
  }

  getOperators(): Observable<IOperator[]> {
    return this._sharedApiService.getOperators().pipe(
      tap((_operators: IOperator[]) => {
        if (_operators.length) {
          this._operatorsSubject.next(_operators);
        }
      })
    );
  }

  getPrefixes(): Observable<IPrefix[]> {
    return this._sharedApiService.getPrefixes().pipe(
      tap((_prefixes: IPrefix[]) => {
        if (_prefixes.length) {
          this._prefixesSubject.next(_prefixes);
        }
      })
    );
  }
}
