import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MyMessageService } from './my-message.service';
import { isPlatformBrowser } from '@angular/common';
// import { AuthService } from '../auth/services/auth.service';
// import * as path from "path";
// import { type } from "os";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // authService: any;
  private isBrowser: boolean = false;

  constructor(
    private http: HttpClient,
    private _myMessageService: MyMessageService,
    private _router: Router, // private inj: Injector
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public request(
    method: 'post' | 'get' | 'put' | 'delete',
    type: string,
    _objectToSend?: any,
    _httpParams?: HttpParams
  ): Observable<any> {
    // this.authService = this.inj.get(AuthService);

    let base: any;
    // const path = this.getDomainName();
    // path + "/api" +

    const options: any = {
      headers: { Authorization: 'Bearer ' },
      // + this.authService.getToken()
    };
    if (method === 'post') {
      base = this.http.post(type, _objectToSend, options);
    } else if (method === 'get') {
      if (_httpParams) {
        options.params = _httpParams;
      }
      base = this.http.get(type, options);
    } else if (method === 'delete') {
      base = this.http.delete(type, options);
    } else if (method === 'put') {
      base = this.http.put(type, _objectToSend, options);
    }
    const request = base.pipe(
      map((data) => {
        if (this.isBrowser) {
          console.log(
            '%capi.service %csuccess',
            'color: black; background: yellow; padding: 2px; border-radius: 2px;',
            'color: white; background: blue; padding: 2px; border-radius: 2px;',
            data
          );
        }
        return data;
      }),
      catchError((err) => {
        if (this.isBrowser) {
          console.log(err);
          console.log(
            '%capi.service %cError',
            'color: black; background: yellow; padding: 2px; border-radius: 2px;',
            'color: white; background: red; padding: 2px; border-radius: 2px;',
            err
          );
        }

        if (err && err.statusText === 'Unauthorized') {
          // if token expired on webserver
          // if (err?.error?.message == 'userExpired') { this._accountExpiredNotificationService.showNotification(true); }
          // else
          // if (err?.error?.message == 'tokenExpired') {
          //   this._myMessageService.raiseMessage(
          //     'warn',
          //     'Token Expired! Please login again'
          //   );
          //   this.authService.logout();
          //   this._router.navigateByUrl('/auth/sign-out');
          // }
        } else if (
          err.error &&
          err.error.name == 'SequelizeUniqueConstraintError'
        ) {
          this._myMessageService.raiseMessage(
            'warn',
            'Username already exists! Please use another one.'
          );
        } else if (err && err.error && err.error.message == 'noPrefixesFound') {
          this._myMessageService.raiseMessage('warn', 'No Rate Found!');
        } else if (err && err.error && err.error.message) {
          // error message for db query
          this._myMessageService.raiseMessage(
            'error',
            'Error in fetching Data'
          );
          return throwError(err.error.message); // returning only message to the componenet back
        } else {
          this._myMessageService.raiseGenericErrorMessage();
        }

        console.error('===> Error ', err);
        return throwError(err);
      })
    );

    return request;
  }

  // private getDomainName(): string {
  //   // if (environment.production) {
  //   //   return window.location.origin;
  //   //   // return this.path;
  //   // }
  //   return "http://localhost:4200";
  // }
}
