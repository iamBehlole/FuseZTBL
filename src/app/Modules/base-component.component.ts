import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Activity } from '../../core/auth/_models/activity.model';
import { UserUtilsService } from '../../core/_base/crud/utils/user-utils.service';


export class BaseComponentPage {
	_currentActivity: Activity = new Activity();

	//constructor(activityName: string) {
	//	var u = new UserUtilsService();
	//	this._currentActivity = u.getActivity(activityName);
	//}

	validateMobile(event: any) {
		const pattern = /[0-9\+\-\ ]/;

		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
}
