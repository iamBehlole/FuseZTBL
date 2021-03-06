// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
	// intercept request and add token
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
  ): Observable<HttpEvent<any>> {

		// tslint:disable-next-line:no-debugger
    // modify request
    ///OS Change Set
    ///// Interceptor Profile Picture
    if (!request.url.includes("Document/SubmitDocument") && !request.url.includes("Land/LandDataUpload") && !request.url.includes("Customer/MarkAsDeceasedCustomer") && !request.url.includes("SeedKhadVendor/AddUpdateVendor") && !request.url.includes("LoanUtilization/UploadUtlization")) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'

          //Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    }
	
		// console.log('----request----');
		// console.log(request);
		// console.log('--- end of request---');

		return next.handle(request).pipe(
			tap(
				event => {
					 if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.status);
					}
				},
				error => {
					// http response status code
					// console.log('----response----');
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
					console.error(error.status);
					console.error(error.message);
					// console.log('--- end of response---');
				}
			)
		);
	}
}
