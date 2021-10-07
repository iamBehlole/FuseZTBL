import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpUtilsService} from '../../_base/crud';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Activity} from '../_models/activity.model';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {UserUtilsService} from '../../_base/crud/utils/user-utils.service';

@Injectable({
    providedIn: 'root'
})
export class VillageWiseBenchMarkingService {

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    userInfo = this.userUtilsService.getUserDetails();

    getVillageBenchMark(village) {
        const circle = this.userInfo.UserCircleMappings;
        const circleIds = [];


        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        const _circles = JSON.stringify(circleIds);

        const request = {
            Circle: {
                CircleIds: _circles
            },
            VillageBenchMarking: {
                VillageName: village.VillageName
            },
            DeviceLocation: {
                BtsId: '0',
                BtsLoc: '',
                Lat: '0.0',
                Long: '0.0',
                Src: 'BTS',
                time: '0',
                id: 0
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };
        const r = JSON.stringify(request);
        console.log(r);

        return this.http.post(`${environment.apiUrl}/VillageBenchMarkingController/GetVillageBenchMarking`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    addUpdateVillageBenchMark(village) {
        const circle = this.userInfo.UserCircleMappings;
        const circleIds = [];


        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        const _circles = JSON.stringify(circleIds);

        const request = {
            Circle: {
                CircleIds: _circles
            },
            VillageBenchMarking: {
                VillageBenchMarkingList: village
            },
            DeviceLocation: {
                BtsId: '0',
                BtsLoc: '',
                Lat: '0.0',
                Long: '0.0',
                Src: 'BTS',
                time: '0',
                id: 0
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };
        const r = JSON.stringify(request);
        console.log(r);

        return this.http.post(`${environment.apiUrl}/VillageBenchMarkingController/AddUpdateBenchMarking`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

}


