import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { VendorLabService } from '../_services/vendor-labs.service';
import { VendorLabModel } from '../_models/vendor-labs.model';
import { BaseDataSource } from '../../_base/crud';



export class VendorLabDataSource extends BaseDataSource implements DataSource<VendorLabModel> {

	private vendorLabsSubject = new BehaviorSubject<VendorLabModel[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private vendorLabService: VendorLabService) {
		super();
	}

	loadVendorLabs(vendorLabId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.vendorLabService.getAllVendorLabs(vendorLabId, filter, sortDirection, pageIndex, pageSize).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((vendors: VendorLabModel[]) => this.vendorLabsSubject.next(vendors));
	}

	connect(collectionViewer: CollectionViewer): Observable<VendorLabModel[]> {
		console.log("Connecting data source");
		return this.vendorLabsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.vendorLabsSubject.complete();
		this.loadingSubject.complete();
	}

}
