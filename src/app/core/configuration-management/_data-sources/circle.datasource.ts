import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { CircleModel } from '../_models/circle.model';
import { CircleService } from '../_services/circle.service';
import { BaseDataSource } from '../../_base/crud';


export class CircleDataSource extends BaseDataSource implements DataSource<CircleModel> {

	private circlesSubject = new BehaviorSubject<CircleModel[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private circleService: CircleService) {
		super();
	}

	loadCircles(circleId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.circleService.getAllCircles(circleId, filter, sortDirection, pageIndex, pageSize).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((circle: CircleModel[]) => this.circlesSubject.next(circle));
	}

	connect(collectionViewer: CollectionViewer): Observable<CircleModel[]> {
		console.log("Connecting data source");
		return this.circlesSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.circlesSubject.complete();
		this.loadingSubject.complete();
	}

}
