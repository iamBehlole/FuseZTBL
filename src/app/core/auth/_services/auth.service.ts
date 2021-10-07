import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map, share } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel, OTP } from '../../_base/crud/models/_base.request.model';
import { environment } from '../../../../environments/environment';
import { HttpUtilsService } from '../../_base/crud';

import { Router } from '@angular/router';
import { UserUtilsService } from '../../_base/crud/utils/user-utils.service';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AuthService {
  public request = new BaseRequestModel();
  private currentUserSubject: BehaviorSubject<BaseResponseModel>;
  public currentUser: Observable<BaseResponseModel>;


  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private router:Router) {
    const userUtilService = new UserUtilsService();
    const data = userUtilService.getUserDetails();

    if (data != undefined) {
      this.currentUserSubject = new BehaviorSubject<BaseResponseModel>(data);
      //this.currentUserSubject = new BehaviorSubject<LoginResponse>(JSON.parse(data));
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }
    // Authentication/Authorization

  login(user: User): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.User = user;
    this.request.UserPasswordDetails = user;
    const req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Account/Login`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  SendOTPResuest(user: any, text):Observable<BaseResponseModel>{

    this.request.User =user;
    this.request.OTP = new OTP();
    this.request.OTP.Id ="1";
    this.request.OTP.Text =text;
    const req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Account/VerifyOTP`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

refreshToken (token: string) {
  this.request = new BaseRequestModel();
  const refreshToken = JSON.parse(localStorage.getItem('ZTBLUserRefreshToke'));
  const expiredToken = JSON.parse(localStorage.getItem('ZTBLUserToken'));
  this.request.Token = expiredToken;
  this.request.RefreshToken = refreshToken;
  const req = JSON.stringify(this.request);

  return this.http.post(`${environment.apiUrl}/Account/RefreshToken`, req);
}



    getUserByToken(): Observable<User> {
        const userToken = localStorage.getItem(environment.authTokenKey);
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Authorization', 'Bearer ' + userToken);
        return this.http.get<User>(API_USERS_URL, { headers: httpHeaders });
    }

    register(user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
            .pipe(
                map((res: User) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
    public requestPassword(email: string): Observable<any> {
    	return this.http.get(API_USERS_URL + '/forgot?=' + email)
    		.pipe(catchError(this.handleError('forgot-password', []))
	    );
    }


    getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(API_USERS_URL);
    }

    getUserById(userId: number): Observable<User> {

		return this.http.get<User>(API_USERS_URL + `/${userId}`);
	}


    // DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete(url);
    }

    // UPDATE => PUT: update the user on the server

	updateUser(_user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
	}

    // CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
    	const httpHeaders = new HttpHeaders();
     httpHeaders.set('Content-Type', 'application/json');
		   return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders});
	}

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, { headers: httpHeaders});
    }

    // Permission
    getAllPermissions(): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(API_ROLES_URL);
    }

    getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    }

    // CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders});
	}

    // UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<Role> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<Role>(url);
	}

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
    }

    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, { headers: httpHeaders});
	}

 	/*
 	 * Handle Http operation that failed.
 	 * Let the app continue.
     *
	 * @param operation - name of the operation that failed
 	 * @param result - optional value to return as the observable result
 	 */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
