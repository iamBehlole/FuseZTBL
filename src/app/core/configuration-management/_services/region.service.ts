import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { HttpUtilsService } from '../../_base/crud';
import { RegionModel } from '../_models/region.model';


@Injectable({ providedIn: 'root' })
export class RegionService {	

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	updateRegion(region: RegionModel): Observable<BaseResponseModel> {
		//region.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/UpdateRegion`, region,			
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	createRegion(region: RegionModel): Observable<BaseResponseModel> {
		//region.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/AddRegion`, region,
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);		
	}

	deleteRegion(id): Observable<BaseResponseModel> {
		var userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/DeleteRegion`,
			{
				userInfo: userInfo,
				regionID:id
			},
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	getAllRegions(regionID: number, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3)
		: Observable<BaseResponseModel> {
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/GetRegions`,
			{ userInfo: this.httpUtils.getUserInfo(), regionID: "0", channel: "1" },
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
			map((res: BaseResponseModel) => res)
		);
	}

}
