import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { HttpUtilsService } from '../../_base/crud';
import { FaultDetailModel } from '../_models/fault-detail.model';



@Injectable({ providedIn: 'root' })
export class FaultService {	

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	updateFault(fault: FaultDetailModel): Observable<BaseResponseModel> {
		//fault.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/UpdateFault`, fault,			
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	createFault(fault: FaultDetailModel): Observable<BaseResponseModel> {
		//fault.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/AddFault`, fault,
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);		
	}

	deleteFault(id): Observable<BaseResponseModel> {
		var userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/DeleteFault`,
			{
				userInfo: userInfo,
				faultID:id
			},
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	getAllFaults(faultID: number, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3)
		: Observable<BaseResponseModel> {
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/GetFaultIDs`,
			{ userInfo: this.httpUtils.getUserInfo(), faultID: "0", channel: "1" },
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
			map((res: BaseResponseModel) => res)
		);
	}

}
