import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { Activity } from '../_models/activity.model';
import { ActivityService } from '../_services/activity.service';
import { BaseDataSource } from '../../_base/crud';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';


export class ActivityDataSource extends BaseDataSource implements DataSource<Activity> {

	private activitiesSubject = new BehaviorSubject<Activity[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public activity = new Activity();

	constructor(private activityService: ActivityService) {
		super();
	}

	loadActivities(activityId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

    this.activity = new Activity();
    this.activityService.getAllActivities(this.activity).pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((response: BaseResponseModel) => {
			console.log('Activities response');
      console.log(response);
      this.activitiesSubject.next(response.Activities);
		});
		//).subscribe((activities: Activity[]) => this.activitiesSubject.next(activities));
	}

	connect(collectionViewer: CollectionViewer): Observable<Activity[]> {
		console.log("Connecting data source");
		return this.activitiesSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.activitiesSubject.complete();
		this.loadingSubject.complete();
	}

}
