import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { DeviceService } from '../_services/device.service';
import { DeviceModel } from '../_models/devices.model';
import { BaseDataSource } from '../../_base/crud';

export class DeviceDataSource extends BaseDataSource implements DataSource<DeviceModel> {

	private devicesSubject = new BehaviorSubject<DeviceModel[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private deviceService: DeviceService) {
		super();
	}

	loadDevices(deviceId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.deviceService.getAllDevices(deviceId, filter, sortDirection, pageIndex, pageSize).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((devices: DeviceModel[]) => this.devicesSubject.next(devices));
	}

	connect(collectionViewer: CollectionViewer): Observable<DeviceModel[]> {
		console.log("Connecting data source");
		return this.devicesSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.devicesSubject.complete();
		this.loadingSubject.complete();
	}

}
