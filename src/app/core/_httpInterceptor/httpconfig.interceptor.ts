import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthNoticeService, AuthService } from '../auth';
import { Router } from '@angular/router';
import { result } from 'lodash';
import { BaseRequestModel } from '../_base/crud/models/_base.request.model';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authNoticeService: AuthNoticeService,
    private _authService :AuthService,
    private injector: Injector, private router: Router,
    private http: HttpClient,
  ) { }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;

    const token: string = JSON.parse(localStorage.getItem('ZTBLUserToken'));
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error.status === 403) {
        this.authNoticeService.setNotice(error.error.Message, 'danger');
        return throwError(error);
      }
      if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/signin') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }

      return throwError(error);
    }));
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = JSON.parse(localStorage.getItem('ZTBLUserRefreshToke'));

      if (token)
        return this._authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            localStorage.setItem('ZTBLUserToken', JSON.stringify(token['Token']));
            localStorage.setItem('ZTBLUserRefreshToke', JSON.stringify(token['RefreshToken']));
            this.refreshTokenSubject.next(token['Token']);
            return next.handle(this.addTokenHeader(request, token['Token']));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.router.navigateByUrl('/auth/login');
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
   return  request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }


}
