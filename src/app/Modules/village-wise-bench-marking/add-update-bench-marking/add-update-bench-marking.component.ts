import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutUtilsService } from '../../../core/_base/crud';
import { NgxSpinnerService } from 'ngx-spinner';
import { VillageWiseBenchMarkingService } from '../../../core/auth/_services/village-wise-bench-marking.service';
import { BaseResponseModel } from '../../../core/_base/crud/models/_base.response.model';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VillageBenchMark} from '../../../core/auth/_models/village-benchmark.model';
import { UserUtilsService } from '../../../core/_base/crud/utils/user-utils.service';
import { LovService } from '../../../core/auth/_services/lov.service';
import { Lov, LovConfigurationKey} from '../../../core/auth/_models/lov.class';


@Component({
  selector: 'kt-add-update-bench-marking',
  templateUrl: './add-update-bench-marking.component.html',
  styleUrls: ['./add-update-bench-marking.component.scss']
})
export class AddUpdateBenchMarkingComponent implements OnInit {

  addUpdateBenchMarkForm: FormGroup;

  GenderLov: any;
  LovCall = new Lov();


    // tslint:disable-next-line:variable-name
  req_array: VillageBenchMark[] = [];
  tableLength = false;

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private _villageBenchmark: VillageWiseBenchMarkingService,
    private _lovService: LovService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userUtilsService: UserUtilsService,
  ) { }

  ngOnInit(): void{
    this.createForm();
    this.LoadLovs();
  }

    // tslint:disable-next-line:typedef
  createForm(){
    this.addUpdateBenchMarkForm = this.fb.group({
      VillageName: ['', Validators.required],
      NoOfFormaer: ['', Validators.required],
      FarmSize: ['', Validators.required],
      GenderCount: ['', Validators.required],
      GenderType: ['', Validators.required],
      AverageLoanSize: ['', Validators.required],
      SubsistenceFarmer: [''],
      EconomicFarmer: [''],
      BigFarmars: [''],
      AgriBusinessPotential: [''],
    });
  }

    // tslint:disable-next-line:typedef
  async LoadLovs(){
    this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender});
    this.GenderLov = this.GenderLov.LOVs;
    console.log(this.GenderLov);
  }

    // tslint:disable-next-line:typedef
  Add(){
    this.tableLength = true;
    this.req_array.push(this.addUpdateBenchMarkForm.value);
    console.log(this.req_array);


    this.addUpdateBenchMarkForm.reset();
    this.addUpdateBenchMarkForm.markAsUntouched();
    this.addUpdateBenchMarkForm.markAsPristine();
  }

    // tslint:disable-next-line:typedef
  clear(){
    this.tableLength = false;
    this.req_array = [];
    this.addUpdateBenchMarkForm.reset();
    this.addUpdateBenchMarkForm.markAsUntouched();
    this.addUpdateBenchMarkForm.markAsPristine();
  }

    // tslint:disable-next-line:typedef
  edit(){}

    // tslint:disable-next-line:typedef
  delete(){
    this.tableLength = false;
  }

    // tslint:disable-next-line:typedef
  Submit(){
    this.spinner.show();
    this._villageBenchmark.addUpdateVillageBenchMark(this.req_array)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) => {
      if (baseResponse.Success === true){
        this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
        console.log(baseResponse);
        // this.router.navigateByUrl('./get-village-bench-marking')
      }
      else{
          this.layoutUtilsService.alertElement('', baseResponse.Message);
      }
    });
  }

}
