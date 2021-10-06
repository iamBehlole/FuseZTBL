import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { DeviceModel } from '../_models/devices.model';
import { HttpUtilsService } from '../../_base/crud';


@Injectable({ providedIn: 'root' })
export class DeviceService {	

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	updateDevice(device: DeviceModel): Observable<BaseResponseModel> {
		//device.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/UpdateDevice`, device,			
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	createDevice(device: DeviceModel): Observable<BaseResponseModel> {
		//device.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/AddDevice`, device,
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);		
	}

	getDeviceTypes(): Observable<BaseResponseModel> {
		device: DeviceModel;
		return this.http.post(`${environment.apiUrl}/DeviceManagement/GetDeviceType`, { req: {}},
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}
	deleteDevice(id): Observable<BaseResponseModel> {
		var userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/DeleteDevice`,
			{
				userInfo: userInfo,
				deviceID:id
			},
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	getAllDevices(deviceID: number, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3)
		: Observable<BaseResponseModel> {
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/GetDevices`,
			{ userInfo: this.httpUtils.getUserInfo(), deviceID: "0", channel: "1" },
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
			map((res: BaseResponseModel) => res)
		);
	}

}
