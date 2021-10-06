import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { FaultDetailModel } from '../_models/fault-detail.model';
import { FaultService } from '../_services/fault.service';
import { BaseDataSource } from '../../_base/crud';



export class FaultDataSource extends BaseDataSource implements DataSource<FaultDetailModel> {

	private faultsSubject = new BehaviorSubject<FaultDetailModel[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private faultService: FaultService) {
		super();
	}

	loadFaults(faultId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.faultService.getAllFaults(faultId, filter, sortDirection, pageIndex, pageSize).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((faults: FaultDetailModel[]) => this.faultsSubject.next(faults));
	}

	connect(collectionViewer: CollectionViewer): Observable<FaultDetailModel[]> {
		console.log("Connecting data source");
		return this.faultsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.faultsSubject.complete();
		this.loadingSubject.complete();
	}

}
