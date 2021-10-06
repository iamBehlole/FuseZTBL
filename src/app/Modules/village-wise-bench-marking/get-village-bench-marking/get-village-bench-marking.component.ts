import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { VillageWiseBenchMarkingService } from "../../../../core/auth/_services/village-wise-bench-marking.service";
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VillageBenchMark} from '../../../../core/auth/_models/village-benchmark.model';
import { UserUtilsService } from "../../../../core/_base/crud/utils/user-utils.service";

@Component({
  selector: 'kt-get-village-bench-marking',
  templateUrl: './get-village-bench-marking.component.html',
  styleUrls: ['./get-village-bench-marking.component.scss']
})
export class GetVillageBenchMarkingComponent implements OnInit {

  displayedColumns = ['VillageName', 'NoOfFormaer', 'FarmSize', 'GenderCount', 'GenderType','AverageLoanSize', 'AgriBusinessPotential'];

  getVillageBenchmarkForm : FormGroup;

  dv;
  itemsPerPage = 10;
  totalItems;
  pageIndex = 1;

  getVillage : any = {};

  matTableLenght : boolean = false;
  LoggedInUserInfo: BaseResponseModel;

  selected_b;
  selected_z;

  //Zone Inventory
  Zone: any = [];
  SelectedZones: any = [];

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];

  //Circle Inventory
  Circles: any = [];
  SelectedCircles: any = [];

  //dataSource = new MatTableDataSource();
  dataSource : MatTableDataSource<VillageBenchMark>

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private _villageBenchmark: VillageWiseBenchMarkingService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userUtilsService: UserUtilsService,
  ) { }

  ngOnInit() {
    
    this.createForm();
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      debugger;
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchId
      console.log(this.SelectedZones)
      this.getVillageBenchmarkForm.controls["Zone"].setValue(this.SelectedZones.ZoneName);
      this.getVillageBenchmarkForm.controls["Branch"].setValue(this.SelectedBranches.Name);
    }

  }

  createForm(){
    this.getVillageBenchmarkForm = this.fb.group({
      Zone:[''],
      Branch:[''],
      Circle:[''],
      VillageName:['']
    })
  }

  viewBenchMark(VillageBenchMark : any){

  }

  search(){
    this.getVillage.Branch = this.getVillageBenchmarkForm.controls.Branch.value;
    this.getVillage.Circle = this.getVillageBenchmarkForm.controls.Circle.value;
    this.getVillage.VillageName = this.getVillageBenchmarkForm.controls.VillageName.value;
    this.spinner.show();
    this._villageBenchmark.getVillageBenchMark(this.getVillage)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        debugger
        this.dataSource = baseResponse.VillageBenchMarking.VillageBenchMarkingList
        this.matTableLenght = true
        this.dv = this.dataSource
        this.totalItems = this.dv.length;
        this.dataSource = this.dv.slice(0, this.itemsPerPage);
      }
      else{
        this.matTableLenght = false;

          // this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
          // this.pageIndex = 1;
          // this.dv = this.dv.slice(1,0);
          this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    //this.OffSet = pageIndex;
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
  }

}



