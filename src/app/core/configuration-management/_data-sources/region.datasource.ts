import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { RegionModel } from '../_models/region.model';
import { RegionService } from '../_services/region.service';
import { BaseDataSource } from '../../_base/crud';



export class RegionDataSource extends BaseDataSource implements DataSource<RegionModel> {

	private regionsSubject = new BehaviorSubject<RegionModel[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private regionService: RegionService) {
		super();
	}

	loadRegions(regionId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.regionService.getAllRegions(regionId, filter, sortDirection, pageIndex, pageSize).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((regions: RegionModel[]) => this.regionsSubject.next(regions));
	}

	connect(collectionViewer: CollectionViewer): Observable<RegionModel[]> {
		console.log("Connecting data source");
		return this.regionsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.regionsSubject.complete();
		this.loadingSubject.complete();
	}

}
