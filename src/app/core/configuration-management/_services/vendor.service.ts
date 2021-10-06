import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { HttpUtilsService } from '../../_base/crud';
import { VendorModel } from '../_models/vendor.model';


@Injectable({ providedIn: 'root' })
export class VendorService {	

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	updateVendor(vendor: VendorModel): Observable<BaseResponseModel> {
		//vendor.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/UpdateVendor`, vendor,			
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	createVendor(vendor: VendorModel): Observable<BaseResponseModel> {
		//vendor.userInfo = this.httpUtils.getUserInfo();				
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/AddVendor`, vendor,
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);		
	}

	deleteVendor(id): Observable<BaseResponseModel> {
		var userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/DeleteVendor`,
			{
				userInfo: userInfo,
				vendorID:id
			},
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	getAllVendors(vendorID: number, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3)
		: Observable<BaseResponseModel> {
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/GetVendors`,
			{ userInfo: this.httpUtils.getUserInfo(), vendorID: "0", channel: "1" },
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
			map((res: BaseResponseModel) => res)
		);
	}

}
