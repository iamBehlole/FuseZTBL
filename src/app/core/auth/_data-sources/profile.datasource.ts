import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { Profile } from '../_models/profile.model';
import { ProfileService } from '../_services/profile.service';
import { BaseDataSource } from '../../_base/crud';


export class ProfileDataSource extends BaseDataSource implements DataSource<Profile> {

	private profilesSubject = new BehaviorSubject<Profile[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private profileService: ProfileService) {
		super();
	}

	loadProfiles(profileId: number,
		filter: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		this.profileService.getAllProfiles().pipe(
			catchError(() => of([])),
			finalize(() => this.loadingSubject.next(false))
		).subscribe((profiles: Profile[]) => this.profilesSubject.next(profiles));
	}

	connect(collectionViewer: CollectionViewer): Observable<Profile[]> {
		console.log("Connecting data source");
		return this.profilesSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.profilesSubject.complete();
		this.loadingSubject.complete();
	}

}
