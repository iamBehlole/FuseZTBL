import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppraisalProposed, CropProduction, Loan, LoanApplicationHeader } from '../../../../core/auth/_models/loan-application-header.model';
import { LoanApprovalProposed } from '../../../../core/auth/_models/loan-appoval-of-proposed';
import { Lov, LovConfigurationKey, regExps } from '../../../../core/auth/_models/lov.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { MatSelectChange } from '@angular/material';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { LoanService } from '../../../../core/auth/_services/loan.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'kt-cl-appraisal-of-proposed-investment',
  templateUrl: './cl-appraisal-of-proposed-investment.component.html',
  styleUrls: ['./cl-appraisal-of-proposed-investment.component.scss']
})
export class ClAppraisalOfProposedInvestmentComponent implements OnInit {
  @Input() loanDetail: Loan;
  LoanAOPIForm: FormGroup;
  public LoanApprovalProposed = new LoanApprovalProposed();
  public productionArray: ProductionGrid[] = [];
  public LovCall = new Lov();

  public cropProduction = new CropProduction();
  public appraisalProposed = new AppraisalProposed();

  public appraisalProposedList :  AppraisalProposed[] =[];

  proposedCropType: any;
  selectedProposedCropType: any;
  selectedProposedCropTypeName: string;

  crops: any;
  selectedCrops: any;
  selectedCropsName: string;


  constructor(private formBuilder: FormBuilder,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService,
    private userUtilsService: UserUtilsService,
    private _loanService: LoanService,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef) {
    
  }
  hasFormErrors = false;

  ngOnInit() {
    this.createForm();
    this.getProposedCropType();
    this.getCrops();
  }
  createForm() {
    this.LoanAOPIForm = this.formBuilder.group({
      CropIncomeFutureControl: [this.LoanApprovalProposed.CropIncomeFutureControl],
      CropIncomePresnetControl: [this.LoanApprovalProposed.CropIncomePresnetControl],
      LiveStockIncomeFutureControl: [this.LoanApprovalProposed.LiveStockIncomeFutureControl],
      LiveStockIncomePresnetControl: [this.LoanApprovalProposed.LiveStockIncomePresnetControl],
      OthersFutureControl: [this.LoanApprovalProposed.OthersFutureControl],
      OthersPresnetControl: [this.LoanApprovalProposed.OthersPresnetControl],
      TotalIncomeFutureControl: [this.LoanApprovalProposed.TotalIncomeFutureControl],
      TotalIncomePresnetControl: [this.LoanApprovalProposed.TotalIncomePresnetControl],
      CropRaisingFutureControl: [this.LoanApprovalProposed.CropRaisingFutureControl],
      CropRaisingPresnetControl: [this.LoanApprovalProposed.CropRaisingPresnetControl],
      LiveStockFarmingFutureControl: [this.LoanApprovalProposed.LiveStockFarmingFutureControl],
      LiveStockFarmingPresnetControl: [this.LoanApprovalProposed.LiveStockFarmingPresnetControl],
      OtherExpenditureFutureControl: [this.LoanApprovalProposed.OtherExpenditureFutureControl],
      OtherExpenditurePresnetControl: [this.LoanApprovalProposed.OtherExpenditurePresnetControl],
      LoanFutureControl: [this.LoanApprovalProposed.LoanFutureControl],
      LoanPresnetControl: [this.LoanApprovalProposed.LoanPresnetControl],
      ExpenditureFutureControl: [this.LoanApprovalProposed.ExpenditureFutureControl],
      ExpenditurePresnetControl: [this.LoanApprovalProposed.ExpenditurePresnetControl],
      NetIncomeFutureControl: [this.LoanApprovalProposed.NetIncomeFutureControl],
      NetIncomePresnetControl: [this.LoanApprovalProposed.NetIncomePresnetControl],
      IncreaseFutureControl: [this.LoanApprovalProposed.IncreaseFutureControl],
      IncreasePresnetControl: [this.LoanApprovalProposed.IncreasePresnetControl],
      UncultivatedLand: [this.LoanApprovalProposed.UncultivatedLand, [Validators.pattern(regExps.landMarla)]],
      NocultivatedLand: [this.LoanApprovalProposed.NocultivatedLand, [Validators.pattern(regExps.landMarla)]],
      Type: [this.LoanApprovalProposed.Type, [Validators.required]],
      Crop: [this.LoanApprovalProposed.Crop, [Validators.required]],
      Area: [this.LoanApprovalProposed.Area, [Validators.required, Validators.pattern(regExps.landMarla)]],
      Price: [this.LoanApprovalProposed.Price, [Validators.required]],
      Output: [this.LoanApprovalProposed.Output, [Validators.required]],
      Expenditure: [this.LoanApprovalProposed.Expenditure, [Validators.required]]

    });
  }
  hasError(controlName: string, errorName: string): boolean {
    return this.LoanAOPIForm.controls[controlName].hasError(errorName);
  }
  dtInputChange() {
    
    var CropIncomeFutureControl = this.getValue('CropIncomeFutureControl') === null ? 0 : parseInt(this.getValue('CropIncomeFutureControl'));
    var CropIncomePresnetControl = this.getValue('CropIncomePresnetControl') === null ? null : parseInt(this.getValue('CropIncomePresnetControl'));
    var LiveStockIncomeFutureControl = this.getValue('LiveStockIncomeFutureControl') === null ? 0 : parseInt(this.getValue('LiveStockIncomeFutureControl'));
    var LiveStockIncomePresnetControl = this.getValue('LiveStockIncomePresnetControl') === null ? 0 : parseInt(this.getValue('LiveStockIncomePresnetControl'));
    var OthersFutureControl = this.getValue('OthersFutureControl') === null ? 0 : parseInt(this.getValue('OthersFutureControl'));
    var OthersPresnetControl = this.getValue('OthersPresnetControl') === null ? 0 : parseInt(this.getValue('OthersPresnetControl'));
    var TotalIncomeFutureControl = this.getValue('TotalIncomeFutureControl') === null ? 0 : parseInt(this.getValue('TotalIncomeFutureControl'));
    var TotalIncomePresnetControl = this.getValue('TotalIncomePresnetControl') === null ? 0 : parseInt(this.getValue('TotalIncomePresnetControl'));
    var CropRaisingFutureControl = this.getValue('CropRaisingFutureControl') === null ? 0 : parseInt(this.getValue('CropRaisingFutureControl'));
    var CropRaisingPresnetControl = this.getValue('CropRaisingPresnetControl') === null ? 0 : parseInt(this.getValue('CropRaisingPresnetControl'));
    var LiveStockFarmingFutureControl = this.getValue('LiveStockFarmingFutureControl') === null ? 0 : parseInt(this.getValue('LiveStockFarmingFutureControl'));
    var LiveStockFarmingPresnetControl = this.getValue('LiveStockFarmingPresnetControl') === null ? 0 : parseInt(this.getValue('LiveStockFarmingPresnetControl'));
    var OtherExpenditureFutureControl = this.getValue('OtherExpenditureFutureControl') === null ? 0 : parseInt(this.getValue('OtherExpenditureFutureControl'));
    var OtherExpenditurePresnetControl = this.getValue('OtherExpenditurePresnetControl') === null ? 0 : parseInt(this.getValue('OtherExpenditurePresnetControl'));
    var LoanFutureControl = this.getValue('LoanFutureControl') === null ? 0 : parseInt(this.getValue('LoanFutureControl'));
    var LoanPresnetControl = this.getValue('LoanPresnetControl') === null ? 0 : parseInt(this.getValue('LoanPresnetControl'));
    var ExpenditureFutureControl = this.getValue('ExpenditureFutureControl') === null ? 0 : parseInt(this.getValue('ExpenditureFutureControl'));
    var ExpenditurePresnetControl = this.getValue('ExpenditurePresnetControl') === null ? 0 : parseInt(this.getValue('ExpenditurePresnetControl'));
    var NetIncomeFutureControl = this.getValue('NetIncomeFutureControl') === null ? 0 : parseInt(this.getValue('NetIncomeFutureControl'));
    var NetIncomePresnetControl = this.getValue('NetIncomePresnetControl') === null ? 0 : parseInt(this.getValue('NetIncomePresnetControl'));
    var IncreaseFutureControl = this.getValue('IncreaseFutureControl') === null ? 0 : parseInt(this.getValue('IncreaseFutureControl'));
    var IncreasePresnetControl = this.getValue('IncreasePresnetControl') === null ? 0 : parseInt(this.getValue('IncreasePresnetControl'));


    TotalIncomeFutureControl = CropIncomeFutureControl + LiveStockIncomeFutureControl + OthersFutureControl;
    this.setValue('TotalIncomeFutureControl', "" + TotalIncomeFutureControl);

    TotalIncomePresnetControl = CropIncomePresnetControl + LiveStockIncomePresnetControl + OthersPresnetControl;
    this.setValue('TotalIncomePresnetControl', "" + TotalIncomePresnetControl);

    ExpenditureFutureControl = CropRaisingFutureControl + LiveStockFarmingFutureControl + OtherExpenditureFutureControl + LoanFutureControl;
    this.setValue('ExpenditureFutureControl', "" + ExpenditureFutureControl);

    ExpenditurePresnetControl = CropRaisingPresnetControl + LiveStockFarmingPresnetControl + OtherExpenditurePresnetControl + LoanPresnetControl;
    this.setValue('ExpenditurePresnetControl', "" + ExpenditurePresnetControl);

    NetIncomeFutureControl = TotalIncomeFutureControl - ExpenditureFutureControl;
    this.setValue('NetIncomeFutureControl', "" + NetIncomeFutureControl);

    NetIncomePresnetControl = TotalIncomePresnetControl - ExpenditurePresnetControl;
    this.setValue('NetIncomePresnetControl', "" + NetIncomePresnetControl);

    IncreaseFutureControl = NetIncomeFutureControl - NetIncomePresnetControl;
    this.setValue('IncreaseFutureControl', "" + IncreaseFutureControl);

    this.setValue('IncreasePresnetControl', "0");

  }
  getValue(controlName: string): string {
    return this.LoanAOPIForm.controls[controlName].value;
  }
  setValue(controlName: string, value: string) {
    this.LoanAOPIForm.controls[controlName].setValue(value);
  }

  async getProposedCropType() {
    
    this.proposedCropType = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.ProposedCropType })
    this.selectedProposedCropType = this.proposedCropType.LOVs;
    console.log("this is proposed", this.selectedProposedCropType)
  }

  selectedCropTypeValue(event: MatSelectChange) {
    this.selectedProposedCropTypeName = event.source.value;
  }

  async getCrops() {
    
    this.crops = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Crops })
    this.selectedCrops = this.crops.LOVs;
  }

  selectedCropValue(event: MatSelectChange) {
    this.selectedCropsName = event.source.value;
  }


  loadAppraisalOfProposedDataOnUpdate(appAppraisalOfProposedData, CropProductionList) {
    
    debugger
    
    if (appAppraisalOfProposedData.length != 0, appAppraisalOfProposedData != undefined) {

      //crop

      if ((appAppraisalOfProposedData[0].PresentValue != null, appAppraisalOfProposedData[0].PresentValue != undefined)
        || (appAppraisalOfProposedData[0].FutureValue != null, appAppraisalOfProposedData[0].FutureValue != undefined))
      {
          this.LoanAOPIForm.controls["CropIncomePresnetControl"].setValue(appAppraisalOfProposedData[0].PresentValue);
          this.LoanAOPIForm.controls["CropIncomeFutureControl"].setValue(appAppraisalOfProposedData[0].FutureValue);
      }

      //Livestock / Dairy Income
      if ((appAppraisalOfProposedData[1].PresentValue != null, appAppraisalOfProposedData[1].PresentValue != undefined)
        || (appAppraisalOfProposedData[1].FutureValue != null, appAppraisalOfProposedData[1].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["LiveStockIncomePresnetControl"].setValue(appAppraisalOfProposedData[1].PresentValue);
      this.LoanAOPIForm.controls["LiveStockIncomeFutureControl"].setValue(appAppraisalOfProposedData[1].FutureValue);
      }
      //Others(Specify)
      if ((appAppraisalOfProposedData[2].PresentValue != null, appAppraisalOfProposedData[2].PresentValue != undefined)
        || (appAppraisalOfProposedData[2].FutureValue != null, appAppraisalOfProposedData[2].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["OthersPresnetControl"].setValue(appAppraisalOfProposedData[2].PresentValue);
      this.LoanAOPIForm.controls["OthersFutureControl"].setValue(appAppraisalOfProposedData[2].FutureValue);
      }
      //Total Income
      if ((appAppraisalOfProposedData[3].PresentValue != null, appAppraisalOfProposedData[3].PresentValue != undefined)
        || (appAppraisalOfProposedData[3].FutureValue != null, appAppraisalOfProposedData[3].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["TotalIncomePresnetControl"].setValue(appAppraisalOfProposedData[3].PresentValue);
      this.LoanAOPIForm.controls["TotalIncomeFutureControl"].setValue(appAppraisalOfProposedData[3].FutureValue);
      }
      //Crop Raising Expenditure
      if ((appAppraisalOfProposedData[4].PresentValue != null, appAppraisalOfProposedData[4].PresentValue != undefined)
        || (appAppraisalOfProposedData[4].FutureValue != null, appAppraisalOfProposedData[4].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["CropRaisingPresnetControl"].setValue(appAppraisalOfProposedData[4].PresentValue);
      this.LoanAOPIForm.controls["CropRaisingFutureControl"].setValue(appAppraisalOfProposedData[4].FutureValue);
      }
      //Livestock / Dairy Farming Expenditure
      if ((appAppraisalOfProposedData[5].PresentValue != null, appAppraisalOfProposedData[5].PresentValue != undefined)
        || (appAppraisalOfProposedData[5].FutureValue != null, appAppraisalOfProposedData[5].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["LiveStockFarmingPresnetControl"].setValue(appAppraisalOfProposedData[5].PresentValue);
      this.LoanAOPIForm.controls["LiveStockFarmingFutureControl"].setValue(appAppraisalOfProposedData[5].FutureValue);
      }
      //Rents, Lease, Payments and others(Specify)
      if ((appAppraisalOfProposedData[6].PresentValue != null, appAppraisalOfProposedData[6].PresentValue != undefined)
        || (appAppraisalOfProposedData[6].FutureValue != null, appAppraisalOfProposedData[6].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["OtherExpenditurePresnetControl"].setValue(appAppraisalOfProposedData[6].PresentValue);
      this.LoanAOPIForm.controls["OtherExpenditureFutureControl"].setValue(appAppraisalOfProposedData[6].FutureValue);
      }
      //Loan Installments(ZTBL & other Bank if any)
      if ((appAppraisalOfProposedData[7].PresentValue != null, appAppraisalOfProposedData[7].PresentValue != undefined)
        || (appAppraisalOfProposedData[7].FutureValue != null, appAppraisalOfProposedData[7].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["LoanPresnetControl"].setValue(appAppraisalOfProposedData[7].PresentValue);
      this.LoanAOPIForm.controls["LoanFutureControl"].setValue(appAppraisalOfProposedData[7].FutureValue);
      }
      //Total Expenditure
      if ((appAppraisalOfProposedData[8].PresentValue != null, appAppraisalOfProposedData[8].PresentValue != undefined)
        || (appAppraisalOfProposedData[8].FutureValue != null, appAppraisalOfProposedData[8].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["ExpenditurePresnetControl"].setValue(appAppraisalOfProposedData[8].PresentValue);
      this.LoanAOPIForm.controls["ExpenditureFutureControl"].setValue(appAppraisalOfProposedData[8].FutureValue);
      }
      //Total Net Income
      if ((appAppraisalOfProposedData[9].PresentValue != null, appAppraisalOfProposedData[9].PresentValue != undefined)
        || (appAppraisalOfProposedData[9].FutureValue != null, appAppraisalOfProposedData[9].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["NetIncomePresnetControl"].setValue(appAppraisalOfProposedData[9].PresentValue);
      this.LoanAOPIForm.controls["NetIncomeFutureControl"].setValue(appAppraisalOfProposedData[9].FutureValue);
      }
      //Increase in Net Income
      if ((appAppraisalOfProposedData[10].PresentValue != null, appAppraisalOfProposedData[10].PresentValue != undefined)
        || (appAppraisalOfProposedData[10].FutureValue != null, appAppraisalOfProposedData[10].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["IncreasePresnetControl"].setValue(appAppraisalOfProposedData[10].PresentValue);
      this.LoanAOPIForm.controls["IncreaseFutureControl"].setValue(appAppraisalOfProposedData[10].FutureValue);
      }
      //Caltivated and Un-caltivated
      if ((appAppraisalOfProposedData[0].PresentValue != null, appAppraisalOfProposedData[0].PresentValue != undefined)
        || (appAppraisalOfProposedData[0].FutureValue != null, appAppraisalOfProposedData[0].FutureValue != undefined)) { 
      this.LoanAOPIForm.controls["UncultivatedLand"].setValue(appAppraisalOfProposedData[0].LandUncultivaed);
      this.LoanAOPIForm.controls["NocultivatedLand"].setValue(appAppraisalOfProposedData[0].LandNotCultivated);
      }
    }

    //Type
    debugger
    if (CropProductionList[0] != '', CropProductionList[0] != null, CropProductionList[0] != undefined) {
      if (CropProductionList[0].AppraisalType != '', CropProductionList[0].AppraisalType != null, CropProductionList[0].AppraisalType != undefined) {
        var cropType = this.selectedProposedCropType.filter(x => x.Value == CropProductionList[0].AppraisalType)
        if (cropType.length > 0) {

          this.LoanAOPIForm.controls["Type"].setValue(cropType[0].Id);
        }
      }

      //Crop
      if (CropProductionList[0].CropType != '', CropProductionList[0].CropType != null, CropProductionList[0].CropType != undefined) {

        var Crop = this.selectedCrops.filter(x => x.Name == CropProductionList[0].CropType)
        if (Crop.length > 0) {

          this.LoanAOPIForm.controls["Crop"].setValue(Crop[0].Id);
        }
      }

      //Area
      if (CropProductionList[0].Area != '', CropProductionList[0].Area != null, CropProductionList[0].Area != undefined) {

        this.LoanAOPIForm.controls["Area"].setValue(CropProductionList[0].Area);

      }

      //Output
      if (CropProductionList[0].TotalOutput != '', CropProductionList[0].TotalOutput != null, CropProductionList[0].TotalOutput != undefined) {

        this.LoanAOPIForm.controls["Output"].setValue(CropProductionList[0].TotalOutput);

      }

      //Price
      if (CropProductionList[0].Price != '', CropProductionList[0].Price != null, CropProductionList[0].Price != undefined) {

        this.LoanAOPIForm.controls["Price"].setValue(CropProductionList[0].Price);

      }

      //Expenditure
      if (CropProductionList[0].ExpPrec != '', CropProductionList[0].ExpPrec != null, CropProductionList[0].ExpPrec != undefined) {
        this.LoanAOPIForm.controls["Expenditure"].setValue(CropProductionList[0].ExpPrec);

      }
    }
    //Creating Grid
    var tempArr :ProductionGrid[]=[];

    CropProductionList.forEach((item, key) => {
      var grid = new ProductionGrid();
        
      var Type = this.selectedProposedCropType.filter(x => x.Value == CropProductionList[0].AppraisalType)
      if (Type.length > 0) {
        grid.typeName = Type[0].Description;
      }

      var Crop = this.selectedCrops.filter(x => x.Name == CropProductionList[0].CropType)
      if (Crop.length > 0) {
        grid.cropName = Crop[0].Description;
      }
      grid.area = item.Area
      grid.output = item.TotalOutput
      grid.price = item.Price
      grid.expenditure = item.ExpPrec
      grid.totalIncome = (parseInt(grid.output) * parseInt(grid.price)).toString();
      grid.totalExpenditure = ((parseInt(grid.expenditure) * parseInt(grid.totalIncome)/100)).toString()
      grid.netIncome = (parseInt(grid.output) * parseInt(grid.price)).toString();
      tempArr.push(grid)

    });
    this.productionArray = tempArr;

  }


  AddCropDetail() {
    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

    this.hasFormErrors = false;
    if (this.LoanAOPIForm.invalid) {
      const controls = this.LoanAOPIForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    //this.loanDetail = new Loan();
    //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();
    //this.loanDetail.ApplicationHeader.LoanAppID = 20211682319;

    

    //this.dynamicArray[index].area = this.createCustomer

    this.cropProduction.ItemDetailID = 0;
    this.cropProduction.CropID = parseInt(this.getValue("Type"));
    this.cropProduction.Area = this.getValue("Area");
    this.cropProduction.TotalOutput = parseInt(this.getValue("Output"));
    this.cropProduction.Price = parseInt(this.getValue("Price"));
    this.cropProduction.ExpPrec = this.getValue("Expenditure");
    this.cropProduction.AppraisalType = this.getValue("Crop");
    this.cropProduction.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    this.cropProduction.Remarks = "";

    //this.loanApplicationPurpose.LoanAppID = 0;
    this.spinner.show();
    this._loanService.addCropDetail
      (this.cropProduction, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        
        if (baseResponse.Success) {

          var grid = new ProductionGrid();
          grid.ItemDetailID = baseResponse.Loan.CropProduction.ItemDetailID;
          //cnic: this.loanCustomerForm.controls['CNIC'].value
          grid.typeName = this.getValue("Type");
          grid.cropName = this.getValue("Crop");
          grid.area = this.getValue("Area");
          grid.output = this.getValue("Output");
          grid.price = this.getValue("Price");
          grid.expenditure = this.getValue("Expenditure");
          grid.totalIncome = (parseInt(grid.output) * parseInt(grid.price)).toString();
          grid.totalExpenditure = (parseInt(grid.output) / parseInt(grid.expenditure)).toString()
          grid.netIncome = (parseInt(grid.output) * parseInt(grid.price)).toString();
          this.productionArray.push(grid);

          const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
        else {

          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
      });


    this.cdRef.detectChanges();


    Object.keys(this.LoanAOPIForm.controls).forEach(key => {
      this.LoanAOPIForm.get(key).markAsUntouched();
    });


  }

  parseInt(strValue): number {
    if (strValue == null || strValue == undefined) {
      return 0;
    }
    else
      return parseInt(strValue)
  }

  AddAppraisalProposed() {

    
    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }

 
   
    //this.loanDetail = new Loan();
    //this.loanDetail.ApplicationHeader = new LoanApplicationHeader();
    //this.loanDetail.ApplicationHeader.LoanAppID = 20211682319;

    /***************Crop Entry*************************/
    var cropAppriasalProposed = new AppraisalProposed();
    cropAppriasalProposed.ItemID = 0;
    cropAppriasalProposed.CmAppraisalID = 1;
    cropAppriasalProposed.FirstEntry = 1;
    cropAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    cropAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    cropAppriasalProposed.FutureValue = this.parseInt(this.getValue("CropIncomeFutureControl"));
    cropAppriasalProposed.PresentValue = this.parseInt(this.getValue("CropIncomePresnetControl"));
    cropAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    cropAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(cropAppriasalProposed);

    /***************Live Stock Entry*************************/
    var liveStockAppriasalProposed = new AppraisalProposed();
    liveStockAppriasalProposed.ItemID = 0;
    liveStockAppriasalProposed.CmAppraisalID = 2;
    liveStockAppriasalProposed.FirstEntry = 2;
    liveStockAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    liveStockAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    liveStockAppriasalProposed.FutureValue = this.parseInt(this.getValue("LiveStockIncomeFutureControl"));;
    liveStockAppriasalProposed.PresentValue = this.parseInt(this.getValue("LiveStockIncomePresnetControl"));;
    liveStockAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    liveStockAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(liveStockAppriasalProposed);

  /***************Others Entry*************************/
    var othersAppriasalProposed = new AppraisalProposed();
    othersAppriasalProposed.ItemID = 0;
    othersAppriasalProposed.CmAppraisalID = 3;
    othersAppriasalProposed.FirstEntry = 3;
    othersAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    othersAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    othersAppriasalProposed.FutureValue = this.parseInt(this.getValue("OthersFutureControl"));;
    othersAppriasalProposed.PresentValue = this.parseInt(this.getValue("OthersPresnetControl"));;
    othersAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    othersAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(othersAppriasalProposed);

    /***************Total Income Entry*************************/
    var totalIncomeAppriasalProposed = new AppraisalProposed();
    totalIncomeAppriasalProposed.ItemID = 0;
    totalIncomeAppriasalProposed.CmAppraisalID = 4;
    totalIncomeAppriasalProposed.FirstEntry = 4;
    totalIncomeAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    totalIncomeAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    totalIncomeAppriasalProposed.FutureValue = this.parseInt(this.getValue("TotalIncomeFutureControl"));;
    totalIncomeAppriasalProposed.PresentValue = this.parseInt(this.getValue("TotalIncomePresnetControl"));;
    totalIncomeAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    totalIncomeAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(totalIncomeAppriasalProposed);

    /***************Crop Raising Entry*************************/
    var cropRaisingAppriasalProposed = new AppraisalProposed();
    cropRaisingAppriasalProposed.ItemID = 0;
    cropRaisingAppriasalProposed.CmAppraisalID = 5;
    cropRaisingAppriasalProposed.FirstEntry = 5;
    cropRaisingAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    cropRaisingAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    cropRaisingAppriasalProposed.FutureValue = this.parseInt(this.getValue("CropRaisingFutureControl"));;
    cropRaisingAppriasalProposed.PresentValue = this.parseInt(this.getValue("CropRaisingPresnetControl"));;
    cropRaisingAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    cropRaisingAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(cropRaisingAppriasalProposed);

    /***************Live Stock Farming Entry*************************/
    var liveStockFarmingAppriasalProposed = new AppraisalProposed();
    liveStockFarmingAppriasalProposed.ItemID = 0;
    liveStockFarmingAppriasalProposed.CmAppraisalID = 6;
    liveStockFarmingAppriasalProposed.FirstEntry = 6;
    liveStockFarmingAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    liveStockFarmingAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    liveStockFarmingAppriasalProposed.FutureValue = this.parseInt(this.getValue("LiveStockFarmingFutureControl"));;
    liveStockFarmingAppriasalProposed.PresentValue = this.parseInt(this.getValue("LiveStockFarmingPresnetControl"));;
    liveStockFarmingAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    liveStockFarmingAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(liveStockFarmingAppriasalProposed);

    /***************Other Expenditure Entry*************************/
    var otherExpenditureAppriasalProposed = new AppraisalProposed();
    otherExpenditureAppriasalProposed.ItemID = 0;
    otherExpenditureAppriasalProposed.CmAppraisalID = 7;
    otherExpenditureAppriasalProposed.FirstEntry = 7;
    otherExpenditureAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    otherExpenditureAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    otherExpenditureAppriasalProposed.FutureValue = this.parseInt(this.getValue("OtherExpenditureFutureControl"));;
    otherExpenditureAppriasalProposed.PresentValue = this.parseInt(this.getValue("OtherExpenditurePresnetControl"));;
    otherExpenditureAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    otherExpenditureAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(otherExpenditureAppriasalProposed);

    /***************Loan Entry*************************/
    var loanExpenditureAppriasalProposed = new AppraisalProposed();
    loanExpenditureAppriasalProposed.ItemID = 0;
    loanExpenditureAppriasalProposed.CmAppraisalID = 8;
    loanExpenditureAppriasalProposed.FirstEntry = 8;
    loanExpenditureAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    loanExpenditureAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    loanExpenditureAppriasalProposed.FutureValue = this.parseInt(this.getValue("LoanFutureControl"));;
    loanExpenditureAppriasalProposed.PresentValue = this.parseInt(this.getValue("LoanPresnetControl"));;
    loanExpenditureAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    loanExpenditureAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(loanExpenditureAppriasalProposed);

    /***************Expenditure Entry*************************/
    var expenditureAppriasalProposed = new AppraisalProposed();
    expenditureAppriasalProposed.ItemID = 0;
    expenditureAppriasalProposed.CmAppraisalID = 9;
    expenditureAppriasalProposed.FirstEntry = 9;
    expenditureAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    expenditureAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    expenditureAppriasalProposed.FutureValue = this.parseInt(this.getValue("ExpenditureFutureControl"));;
    expenditureAppriasalProposed.PresentValue = this.parseInt(this.getValue("ExpenditurePresnetControl"));;
    expenditureAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    expenditureAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(expenditureAppriasalProposed);

    /***************Net Income Entry*************************/
    var netIncomeAppriasalProposed = new AppraisalProposed();
    netIncomeAppriasalProposed.ItemID = 0;
    netIncomeAppriasalProposed.CmAppraisalID = 10;
    netIncomeAppriasalProposed.FirstEntry = 10;
    netIncomeAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    netIncomeAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    netIncomeAppriasalProposed.FutureValue = this.parseInt(this.getValue("NetIncomeFutureControl"));;
    netIncomeAppriasalProposed.PresentValue = this.parseInt(this.getValue("NetIncomePresnetControl"));;
    netIncomeAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    netIncomeAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(netIncomeAppriasalProposed);

    /***************Increase Entry*************************/
    var increaseAppriasalProposed = new AppraisalProposed();
    increaseAppriasalProposed.ItemID = 0;
    increaseAppriasalProposed.CmAppraisalID = 11;
    increaseAppriasalProposed.FirstEntry = 11;
    increaseAppriasalProposed.LandNotCultivated = this.getValue("NocultivatedLand");
    increaseAppriasalProposed.LandUncultivaed = this.getValue("UncultivatedLand");
    increaseAppriasalProposed.FutureValue = this.parseInt(this.getValue("IncreaseFutureControl"));;
    increaseAppriasalProposed.PresentValue = this.parseInt(this.getValue("IncreasePresnetControl"));;
    increaseAppriasalProposed.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
    increaseAppriasalProposed.Remarks = "";
    this.appraisalProposedList.push(increaseAppriasalProposed);

    this.spinner.show();
    
    this._loanService.addAppraisalProposed(this.appraisalProposedList, this.loanDetail.TranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
    ).subscribe(baseResponse => {
      
      const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);

    })

  }


  deleteAppraisalItemDetail(appraisalDetail) {

    const confirmAlert = this.layoutUtilsService.AlertElementConfirmation("Alert", "Are you sure you want to delete crop detail?", "");
    confirmAlert.afterClosed().subscribe(res => {
      
      if (!res) {
        return;
      }

      
      this.appraisalProposed.ItemID = appraisalDetail.ItemDetailID;

      this.spinner.show();
      this._loanService.deleteAppraisalItemDetail
        (this.appraisalProposed, this.loanDetail.TranId)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe(baseResponse => {
          
          if (baseResponse.Success) {

            //var docIndex = this.loanDocumentCheckListArray.findIndex(x => x.AppDocID == docObj.source.value);
            //this.loanDocumentCheckListArray.splice(docIndex, 1)

            var cropIndex = this.productionArray.findIndex(x => x.ItemDetailID == appraisalDetail.ItemDetailID)
            this.productionArray.splice(cropIndex, 1);

            const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          }
          else {

            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
          }
        });


      this.cdRef.detectChanges();


      Object.keys(this.LoanAOPIForm.controls).forEach(key => {
        this.LoanAOPIForm.get(key).markAsUntouched();
      });





    });

    


  }


}
export class ProductionGrid {
  ItemDetailID: number;
  type: string;
  typeName: string;
  crop: string;
  cropName: string;
  area: string;
  output: string;
  price: string;
  totalIncome: string;
  expenditure: string;
  totalExpenditure: string;
  netIncome: string;
}
