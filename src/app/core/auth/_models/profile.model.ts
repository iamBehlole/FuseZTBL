import { UserInfoModel } from '../../_base/crud/models/_userInfo.model';

export class Profile {
  ProfileID: number;
  ProfileName: string;
  ProfileDesc: string;
  ActivityList: string;
  ChannelID: number;
  CreatedBy: string;
  UpdatedBy: string;
  EndedBy: string;
  Status: boolean;
  isSelected: boolean;
  AccessToData: number;
}
