import { UserInfoModel } from '../../_base/crud/models/_userInfo.model';

export class Activity {
  ActivityID: number;
  ActivityName: string;
  ParentActivityName: string;
  ActivityUrl: string;
  ParentActivityID?: number;
  isActivityChecked: boolean;
  IsActive: boolean;
  IsParent: any;
  Status: boolean;
  IsReadOnly: boolean;
  TagName:string;
  PageIcon:string;
  C: boolean;
  R: boolean;
  U: boolean;
  D: boolean;
  CreatedBy: string;
  UpdatedBy: string;
  EndedBy: string;


  //userInfo: UserInfoModel;

  clear() {
    this.ActivityID = 0;
    this.ActivityName = '';
    this.ActivityUrl = '';
    this.ParentActivityID=0;
    this.C = false;
    this.R = false;
    this.U = false;
    this.D = false;
    this.IsParent = false;
    this.IsReadOnly = false;
    this.IsActive = false;
  }
}

