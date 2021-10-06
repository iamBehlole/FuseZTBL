import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { VendorModel } from '../_models/vendor.model';
import { VendorService } from '../_services/vendor.service';
import { BaseDataSource } from '../../_base/crud';



export class VendorDataSource extends BaseDataSource implements DataSource<VendorModel> {

	private vendorsSubject = new BehaviorSubject<VendorModel[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private vendorService: VendorService) {
		super();
	}

	loadVendors(vendorId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.vendorService.getAllVendors(vendorId, filter, sortDirection, pageIndex, pageSize).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((vendors: VendorModel[]) => this.vendorsSubject.next(vendors));
	}

	connect(collectionViewer: CollectionViewer): Observable<VendorModel[]> {
		console.log("Connecting data source");
		return this.vendorsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.vendorsSubject.complete();
		this.loadingSubject.complete();
	}

}
