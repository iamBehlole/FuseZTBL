
import { BaseModel } from '../../_base/crud';

export class Userpassworddetails extends BaseModel {

  Password: string;
  LastSessionID: string;
  CreatedBy: string;

  clear(): void {
    this.Password = '';
    this.LastSessionID = '';
    this.CreatedBy = '';
  }
}

