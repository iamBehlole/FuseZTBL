import { BaseModel } from '../../_base/crud';

export class VillageBenchMark extends BaseModel {
  Id: string;
  VillageName: string;
  NoOfFormaer: number;
  FarmSize: number;
  GenderCount: number;
  GenderType: string;
  AverageLoanSize: number;
  SubsistenceFarmer: number;
  EconomicFarmer: number;
  BigFarmars: number;
  AgriBusinessPotential: string;
  Status: string;
  CreatedBy: string
}

// export class GetVillageBenchMark {
//   Branch: string;
//   VillageName: string
// }

