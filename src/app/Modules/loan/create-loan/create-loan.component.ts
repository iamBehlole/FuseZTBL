import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ClCustomersComponent} from '../cl-customers/cl-customers.component';
import {ClSecuritiesComponent,} from '../cl-securities/cl-securities.component';
import {ClLegalHeirsComponent} from '../cl-legal-heirs/cl-legal-heirs.component';
import {ClLoanWitnessComponent} from '../cl-loan-witness/cl-loan-witness.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ClApplicationHeaderComponent} from '../cl-application-header/cl-application-header.component';
import {ClPurposeComponent} from '../cl-purpose/cl-purpose.component';
import {ClAppraisalOfProposedInvestmentComponent} from '../cl-appraisal-of-proposed-investment/cl-appraisal-of-proposed-investment.component';
import {ClUploadDocumentComponent} from '../cl-upload-document/cl-upload-document.component';
import {Loan, LoanApplicationHeader} from 'app/core/auth/_models/loan-application-header.model';
import {RecoveryService} from '../../../core/auth/_services/recovery.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {LoanService} from '../../../core/auth/_services/loan.service';

@Component({
    selector: 'kt-create-loan',
    templateUrl: './create-loan.component.html',
    styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {

    @ViewChild(ClApplicationHeaderComponent, {static: false}) appHeaderComponent: ClApplicationHeaderComponent;
    @ViewChild(ClCustomersComponent, {static: false}) appCustomerComponent: ClCustomersComponent;
    @ViewChild(ClSecuritiesComponent, {static: false}) securityComponent: ClSecuritiesComponent;
    @ViewChild(ClLegalHeirsComponent, {static: false}) legalHeirsComponent: ClLegalHeirsComponent;
    @ViewChild(ClPurposeComponent, {static: false}) appPurposeComponent: ClPurposeComponent;
    @ViewChild(ClLoanWitnessComponent, {static: false}) loanWitnessComponent: ClLoanWitnessComponent;
    @ViewChild(ClAppraisalOfProposedInvestmentComponent, {static: false}) appraisalOfProposedComponent: ClAppraisalOfProposedInvestmentComponent;
    @ViewChild(ClUploadDocumentComponent, {static: false}) uploadDocumentComponent: ClUploadDocumentComponent;
    loanApplicationReq: Loan;

    constructor(private route: ActivatedRoute,
                private _recoveryService: RecoveryService,
                private _loanService: LoanService,
                private cdRef: ChangeDetectorRef,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
                private router: Router
    ) {

        router.events.subscribe((val: any) => {

            if (val.url == '/loan/create') {

                this.onCreateRestForm();

            }
        });
    }

    public LnTransactionID: string;
    public Lcno: string;
    dynamicList: any;

    // Objects
    applicationHeaderDetail: any;
    applicationCustomerDetail: any;
    applicationPurposeDetail: any;
    applicationSecuritiesDetail: any;
    applicationLegalHeirsDetail: any;
    applicationAppraisalOfProposed: any;
    applicationAppraisalOfProposedDetail: any;
    applicationUploadDocumentsDetail: any;
    witnesses: any;

    CustomersLoanAppList: any;

    ngOnInit() {
    }


    onCreateRestForm() {
        console.log('rest form');
        this.applicationHeaderDetail.DevAmount = '';
        this.appHeaderComponent.loadAppDataOnUpdate(this.applicationHeaderDetail);
    }

    ngAfterViewInit() {
        this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
        this.Lcno = this.route.snapshot.params['Lcno'];
        if ((this.LnTransactionID != undefined && this.LnTransactionID != null) && (this.Lcno != undefined && this.Lcno != null)) {
            this.getLoanDetail();

        }

        // child is set
        //this.securityComponent.areaQuantities
        //this.securityComponent.getCustomerLand();
    }

    //for using child components data
    //ngAfterViewInit() {

    //}


    onTabChangeClick($event) {
        if ($event.index == 3) {
            this.securityComponent.getCustomerLand();
        }
        if ($event.index == 4) {
            debugger
            this.legalHeirsComponent.loadCustomers(this.CustomersLoanAppList);
        }
        if ($event.index == 7) {
            this.loanWitnessComponent.getCheckList();
        }

    }


    fillLoanApplicationObject(req: Loan) {
        this.loanApplicationReq = req;


    }

    fillLoanCustomerCall(req: Loan) {
        this.loanApplicationReq = req;
    }


    getLoanDetail() {

        var LoanAppID = this.LnTransactionID;
        var loanCaseNo = this.Lcno;


        if ((LoanAppID == undefined || LoanAppID == '') && (loanCaseNo == undefined || loanCaseNo == '')) {


            return;
        }

        this.spinner.show();

        this._loanService
            .getLoanDetails(loanCaseNo, LoanAppID)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    var loanRes = baseResponse.Loan;
                    //this.dynamicList = JSON.parse(baseResponse.Recovery.DynamicDataList);
                    //console.log(this.dynamicList);
                    // console.log('loan inquiry new');
                    console.log('get loan details');
                    console.log('this is loanRES', loanRes);

                    this.loanApplicationReq = new Loan();
                    this.loanApplicationReq.TranId = baseResponse.TranId;
                    this.loanApplicationReq.ApplicationHeader = new LoanApplicationHeader();
                    this.loanApplicationReq.ApplicationHeader.LoanAppID = loanRes.ApplicationHeader.LoanAppID;

                    // App Main Header
                    debugger
                    this.applicationHeaderDetail = loanRes.ApplicationHeader;

                    this.appHeaderComponent.loadAppDataOnUpdate(this.applicationHeaderDetail);

                    this.CustomersLoanAppList = loanRes.CustomersLoanAppList;

                    this.appCustomerComponent.loadAppCustomerDataOnUpdate(loanRes.CustomersLoanAppList);

                    this.appPurposeComponent.loadAppPurposeDataOnUpdate(loanRes.LoanApplicationpurposeList);

                    this.securityComponent.loadAppSecuritiesDataOnUpdate(loanRes.LoanSecuritiesList);

                    this.legalHeirsComponent.loadAppLegalHeirsDataOnUpdate(loanRes.LoanApplicationLegalHeirsList, loanRes.CustomersLoanAppList);

                    this.appraisalOfProposedComponent.loadAppraisalOfProposedDataOnUpdate(loanRes.AppraisalProposedList, loanRes.CropProductionList);

                    this.uploadDocumentComponent.loadUploadDocumentsOnUpdate(loanRes.DocumentUploadList, loanCaseNo);

                    this.loanWitnessComponent.loadAppWitnessDataOnUpdate(loanRes.PersonalSuretiesList,
                        loanRes.CorporateSuretyList, loanRes.LoanRefrencesList, loanRes.LoanPastPaidList,
                        loanRes.LoanWitnessList, loanRes.CurrentLoansList);

                    /*
                    // App Customer
                    this.applicationCustomerDetail = this.dynamicList.dtGetCustomer;
                    this.appCustomerComponent.loadAppCustomerDataOnUpdate(this.applicationCustomerDetail);

                    // App Purpose

                    this.applicationPurposeDetail = this.dynamicList.dtGetPurposeLoanApplication;
                    this.appPurposeComponent.loadAppPurposeDataOnUpdate(this.applicationPurposeDetail);



                    // App Securities

                    this.applicationSecuritiesDetail = this.dynamicList.GetSecurityLoanApplication;
                    this.securityComponent.loadAppSecuritiesDataOnUpdate(this.applicationSecuritiesDetail);


                    // LegalHeirs

                    this.applicationLegalHeirsDetail = this.dynamicList.GetLegalheirsLoanApplication;
                    this.legalHeirsComponent.loadAppLegalHeirsDataOnUpdate(this.applicationLegalHeirsDetail);



                    // Appraisal Of Proposed

                    this.applicationAppraisalOfProposed = this.dynamicList.GetPropsedInvestment;
                    this.applicationAppraisalOfProposedDetail = this.dynamicList.GetPropsedInvestmentDetail;


                    this.appraisalOfProposedComponent.loadAppraisalOfProposedDataOnUpdate(this.applicationAppraisalOfProposed, this.applicationAppraisalOfProposedDetail);



                    // Documents

                    this.applicationUploadDocumentsDetail = this.dynamicList.GetDocumentLoanApplication;
                    this.uploadDocumentComponent.loadUploadDocumentsOnUpdate(this.applicationUploadDocumentsDetail);



                    // Loan Details/Witnesses

                    this.witnesses = this.dynamicList.GetWitnessDetail;
                    this.loanWitnessComponent.loadAppWitnessDataOnUpdate(this.witnesses);

                    */

                    // dtGetApplicationMain For Application Header
                    // dtGetCustomer Customer
                    // dtGetPurposeLoanApplication Purpose
                    // GetSecurityLoanApplication
                    // GetPropsedInvestment
                    // GetPropsedInvestmentDetail
                    // GetDocumentLoanApplication
                    // GetWitnessDetail

                    //console.log(JSON.parse("{ "Code": "00", "Message": "Success.", "Id": 0, "Autonumber": null, "dtGetApplicationMain": [{ "LOAN_ACCOUNT_NO": "202381900101", "LOAN_APP_ID": 20191378542.0, "BRANCH_ID": 102.0, "STATUS_NAME": "L.C SANCTIONED", "ZONEID": 50055.0, "MANAGER_COMMETS": "LOANCASE IS SANCTIONED BY 64460 ( OK ).", "APPLICATION_TITLE": null, "LOAN_CATEGORY_ID": 1.0, "SANCTION_DATE": "2019-02-12T00:00:00", "CREATED_BY": "B-3774", "ACCOUNT_NO": "20238013379620", "LOAN_CASE_NO": "410293", "CREATED_ON": "2019-02-12T17:45:48", "BRANCHNAME": "NOORPUR TOWN", "APP_DATE": "2019-02-12T00:00:00", "DEV_AMOUNT": 0.0, "PROD_AMOUNT": 330000.0, "DEV_PROD_FLAG": "Production Loan", "APP_STATUS": 10.0, "MCO_REMARKS": null, "CIRCLE_ID": 53444.0, "CIRCLE_CODE": "20238-46", "APP_NUMBER_MANUAL": "1187034", "LOAN_ACCOUNT_NO1": "202381900101", "REMARKS": null, "APP_STATUS_PS": 37.0, "STAUS_NAME_PS": "N/A", "CAD_RECEIVE_DATE": null, "CAD_RECEIVE_DATE_PS": null }], "dtGetCustomer": [{ "HUSBANDNAME": "TARIQ MAHMOOD", "ISCNICVERIFIED": "Y", "CUSTOMERNAME": "REHANA KOUSAR", "CUSTOMERID": "102-6891", "REL_NAME": "SELF", "ADDRESS": "49/SP", "PHONERES": null, "PHONEOFF": null, "PHONECELL": "00923072926160", "CNIC": "3640251934926", "OLDNIC": null, "FATHERNAME": "TARIQ MAHMOOD", "MARKOFIDENTIFICATION": null, "DOB": "1979-01-01T00:00:00", "EMAIL": null, "ISPAKISTANRESIDENT": "Y", "CITIZENSHIP": 1.0, "CNICEXPIRYDATE": "2023-06-20T00:00:00", "NTN": null, "MOTHERNAME": "NAZIRA BIBI", "DISTRICTID": 62.0, "GENDER": "F", "OCCUPATIONID": 7.0, "ACTIVE": "Y", "USER_ID": "B-3774", "ACCNOTMP": null, "ENTRYDATE": "2016-01-02T23:56:48", "BRANCHID": 102.0, "MARTIALSTATUS": "M", "CUSTOMERTYPE": "I", "FAXNUMBER": null, "FATHER_SPOUSE_CNIC": null, "CASTID": 383.0, "EDUCATION": 11.0, "ACCNOTMP1": null, "MAJOR_BORROWER": "A", "SOURCE_LA_ID": 1.0, "CUSTOMER_LOAN_APP_ID": 20191495529.0, "BORROWER_STATUS_ID": 17.0, "RELATIONID": 8.0 }], "dtGetPurposeLoanApplication": [{ "GL_DESCRIPTION": "9018--SADA BAHA SCHEME A--181-SADA BAHAR SCHEME (SBS)", "PROD_ID": 20191827780.0, "REQUIRED_ITEM_DEV": null, "SUB_PROPOSAL_ID": null, "SEASON": 1.0, "CROP_ID": 80.0, "DEV_ITEM_NAME": " ", "CROP_NAME": "104-Potatoes", "CROP_CODE": "104", "CULTIVATED_AREA": 1000.0, "UNIT": 3.0, "UNIT_NAME": "MARLA", "NECESSITIES_DETAIL": "OK", "MARKET_VALUES": 0.0, "QUANTITY": null, "TOTAL_ESTIMATED_COST": 265000.0, "AMOUNT_IN_HAND": 0.0, "AMOUNT_REQUIRED": 265000.0, "LOAN_APP_ID": 20191378542.0, "BRANCH_ID": 102.0, "GL_CODE": "9018", "ITEM_NAME": null, "SEASON_NAME": "RABI", "PROD_DEV": "P", "SCHEME_CODE": "181", "SCHEME_NAME": "181-SADA BAHAR SCHEME (SBS)", "FUND_NONFUND_FLAG": "N", "MARK_CAL_MODE": 1.0, "CONSENT_INSURANCE_OPT_CROP": "N" }, { "GL_DESCRIPTION": "9160--WORKING CAPITAL FOR DAIRY (SBS)--181-SADA BAHAR SCHEME (SBS)", "PROD_ID": 20191827781.0, "REQUIRED_ITEM_DEV": null, "SUB_PROPOSAL_ID": null, "SEASON": null, "CROP_ID": null, "DEV_ITEM_NAME": " ", "CROP_NAME": null, "CROP_CODE": null, "CULTIVATED_AREA": 1000.0, "UNIT": 3.0, "UNIT_NAME": "MARLA", "NECESSITIES_DETAIL": "OK", "MARKET_VALUES": 0.0, "QUANTITY": null, "TOTAL_ESTIMATED_COST": 65000.0, "AMOUNT_IN_HAND": 0.0, "AMOUNT_REQUIRED": 65000.0, "LOAN_APP_ID": 20191378542.0, "BRANCH_ID": 102.0, "GL_CODE": "9160", "ITEM_NAME": null, "SEASON_NAME": null, "PROD_DEV": "P", "SCHEME_CODE": "181", "SCHEME_NAME": "181-SADA BAHAR SCHEME (SBS)", "FUND_NONFUND_FLAG": "N", "MARK_CAL_MODE": 1.0, "CONSENT_INSURANCE_OPT_CROP": "N" }], "GetLandInformationByloanappId": [{ "ID": 20191417572.0, "LOAN_APP_ID": 20191378542.0, "LAND_INFO_ID": 20181034708.0, "PASSBOOK_NO": "345286A", "TOT_AREA": "1000", "OWN_AREA_ADDRESS": "49/SP", "TYPE_FLAG": "IP", "LAND_TYPE_FLAG": "INSIDE PASSBOOK SYSTEM", "ATTACHED_FLAG": "ATTACHED", "VILLAGE_NAME": null, "BRANCH_ID": 102.0, "CHARGE_CREATION_ID": 83131.0, "IS_REDEEM": "N" }, { "ID": -1.0, "LOAN_APP_ID": 20191378542.0, "LAND_INFO_ID": 2016745178.0, "PASSBOOK_NO": "345286", "TOT_AREA": "1000", "OWN_AREA_ADDRESS": null, "TYPE_FLAG": "IP", "LAND_TYPE_FLAG": "INSIDE PASSBOOK SYSTEM", "ATTACHED_FLAG": "NOT ATTACHED", "VILLAGE_NAME": null, "BRANCH_ID": null, "CHARGE_CREATION_ID": 0.0, "IS_REDEEM": "N" }], "GetSecurityLoanApplication": [{ "APP_SECURITY_ID": 20191412684.0, "LOAN_APP_ID": 20191378542.0, "PLUDGED_VALUE": 540000.0, "MAX_CREDIT_LIMIT": 432000.0, "FK_COLL_TYPE_ID": 1.0, "FK_QUANTITY_UNIT": 9.0, "QUANTITY": 180.0, "ENTERED_BY": "B-3774", "ENTERED_DATE": "2019-02-12T17:47:59", "COLLECTRAL_TYPE_DESC": "AGRICULTURAL LAND UNDER PASS BOOK (PIU)", "BASIS_OF_EVALUATION": "PIU", "UNIT_PRICE": 3000.0 }], "GetLegalheirsLoanApplication": [], "GetPropsedInvestment": [{ "GROUP_FLAG": "FARM INCOME", "ID": 1.0, "NAME": "Crop Income", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM INCOME", "ID": 2.0, "NAME": "Livestock/Dairy Income", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM INCOME", "ID": 3.0, "NAME": "Other(Specify)", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM INCOME", "ID": 4.0, "NAME": "Total Income", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "False" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 5.0, "NAME": "Crop Raising Expenditure", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 6.0, "NAME": "LiveStock / Dairy Farming expenditure", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 7.0, "NAME": "Rents, Lease, Payments and others(Specify)", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 8.0, "NAME": "Loan Instalments (ZTBL & other Bank if Any)", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "True" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 9.0, "NAME": "Total Expenditure", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "False" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 10.0, "NAME": "Total Net Income", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "False" }, { "GROUP_FLAG": "FARM EXPENDITURE", "ID": 11.0, "NAME": "Increase In Net Income", "FUTURE_VALUE": null, "PRESENT_VALUE": null, "LOANAPP_ID": null, "LAND_NOT_CULTIVATED": null, "LAND_UNCULTIVATED": null, "ISENABLE": "False" }], "GetPropsedInvestmentDetail": [], "GetDocumentLoanApplication": [], "GetAllPersonalSuretiesDetail": [], "GetCorporateSuretyDAL": [], "GetLoanReferanceDetail": [], "GetWitnessDetail": [], "GetCWR": [], "GetORR": [{ "LOAN_APP_ID": 20191378542.0, "LOAN_APP_CUST_ID": 20191495529.0, "LOAN_PROD_DEV_ID": 20191827780.0, "CALCULATED_ORR": 1.0, "MANUAL_ORR": 1.0, "CALCULATED_ORR1": 1.0, "FINAL_ORR_ID": 201943398.0, "CUSTOMERNAME": "REHANA KOUSAR", "CNIC": "3640251934926", "GLSUBID": 678.0, "GL": "9018 SADA BAHA SCHEME A" }, { "LOAN_APP_ID": 20191378542.0, "LOAN_APP_CUST_ID": 20191495529.0, "LOAN_PROD_DEV_ID": 20191827781.0, "CALCULATED_ORR": 1.0, "MANUAL_ORR": 1.0, "CALCULATED_ORR1": 1.0, "FINAL_ORR_ID": 201943399.0, "CUSTOMERNAME": "REHANA KOUSAR", "CNIC": "3640251934926", "GLSUBID": 1985.0, "GL": "9160 WORKING CAPITAL FOR DAIRY (SBS)" }], "GetSanctionList": [{ "PROD_ID": 20191827780.0, "PROD_DEV": "P", "AMOUNT_REQUIRED": 265000.0, "AMOUNT_RECOMMEDNED": 265000.0, "PROPOSAL_NAME": null, "SUB_PROPOSAL_NAME": null, "GL_DESCRIPTION": "9018--SADA BAHA SCHEME A", "CAD_LIMIT": 265000.0, "SANCTIONED_AMOUNT": 265000.0, "ORG_UNITID": 102.0, "TOTAL_DISBURSEMENT": 265000.0, "EXPIRY_DATE": "2022-02-12T00:00:00", "RECOVERED_PRINCIPAL": 265000.0, "RECOVERED_MARKUP": 36886.0, "SCHEME_CODE": "181", "CROP_CODE": "104", "IRATE_ON_SANCTION": null, "IS_ACTIVE": "Y" }, { "PROD_ID": 20191827780.0, "PROD_DEV": "P", "AMOUNT_REQUIRED": 265000.0, "AMOUNT_RECOMMEDNED": 265000.0, "PROPOSAL_NAME": null, "SUB_PROPOSAL_NAME": null, "GL_DESCRIPTION": "9018--SADA BAHA SCHEME A", "CAD_LIMIT": 265000.0, "SANCTIONED_AMOUNT": 265000.0, "ORG_UNITID": 102.0, "TOTAL_DISBURSEMENT": 265000.0, "EXPIRY_DATE": "2022-02-12T00:00:00", "RECOVERED_PRINCIPAL": 0.0, "RECOVERED_MARKUP": 13251.0, "SCHEME_CODE": "181", "CROP_CODE": "104", "IRATE_ON_SANCTION": null, "IS_ACTIVE": "Y" }, { "PROD_ID": 20191827781.0, "PROD_DEV": "P", "AMOUNT_REQUIRED": 65000.0, "AMOUNT_RECOMMEDNED": 65000.0, "PROPOSAL_NAME": null, "SUB_PROPOSAL_NAME": null, "GL_DESCRIPTION": "9160--WORKING CAPITAL FOR DAIRY (SBS)", "CAD_LIMIT": 65000.0, "SANCTIONED_AMOUNT": 65000.0, "ORG_UNITID": 102.0, "TOTAL_DISBURSEMENT": 65000.0, "EXPIRY_DATE": "2022-02-12T00:00:00", "RECOVERED_PRINCIPAL": 65000.0, "RECOVERED_MARKUP": 9048.0, "SCHEME_CODE": "181", "CROP_CODE": null, "IRATE_ON_SANCTION": null, "IS_ACTIVE": "Y" }, { "PROD_ID": 20191827781.0, "PROD_DEV": "P", "AMOUNT_REQUIRED": 65000.0, "AMOUNT_RECOMMEDNED": 65000.0, "PROPOSAL_NAME": null, "SUB_PROPOSAL_NAME": null, "GL_DESCRIPTION": "9160--WORKING CAPITAL FOR DAIRY (SBS)", "CAD_LIMIT": 65000.0, "SANCTIONED_AMOUNT": 65000.0, "ORG_UNITID": 102.0, "TOTAL_DISBURSEMENT": 65000.0, "EXPIRY_DATE": "2022-02-12T00:00:00", "RECOVERED_PRINCIPAL": 0.0, "RECOVERED_MARKUP": 3251.0, "SCHEME_CODE": "181", "CROP_CODE": null, "IRATE_ON_SANCTION": null, "IS_ACTIVE": "Y" }], "GetSAC": [{ "ID": 1.0, "CODE": 101.0, "DESCRIPTION": "Photograph of the applicant duly attested by the MCO has been scanned and uploaded in the system.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 2.0, "CODE": 102.0, "DESCRIPTION": "Name and Parentage of the Borrower in loan application has been compared and verified with CNIC and CBAS.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 3.0, "CODE": 103.0, "DESCRIPTION": "Signed Introductory Certificate has been scanned and uploaded in the system.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 4.0, "CODE": 104.0, "DESCRIPTION": "List of legal heirs of the borrower duly verified by the MCO, has been scanned and uploaded in the system.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 5.0, "CODE": 105.0, "DESCRIPTION": "Consent of the borrower to obtain loan whether on the basis of Produce Index Units (PIUs) or average mutation value, duly attested by the MCO, has been scanned and uploaded in the system.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 6.0, "CODE": 106.0, "DESCRIPTION": "a)\tThe original title documents in loan cases with new Pass Book have been scanned and uploaded in the system.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 7.0, "CODE": 107.0, "DESCRIPTION": "b)\tIn loan cases with security area already mortgaged, it is to confirm that documents relating to collateral are scanned in the SDMS.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 8.0, "CODE": 108.0, "DESCRIPTION": "The valuation of collateral has been made in accordance with the standing instructions and any abnormality or inconsistency noted, as compared with the valuation trend of such collateral in the same vicinity, has been justified and backed with documents.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 9.0, "CODE": 109.0, "DESCRIPTION": "LTI/RTI/Signature (s) of the borrower (s) has been obtained/witnessed on Bank’s prescribed LA Form duly countersigned by concerned MCO/Bank Official has been scanned and uploaded in the system", "VAL": null, "FK_LOAN_APP_ID": null }], "GetDAC": [{ "ID": 10.0, "CODE": 1001.0, "DESCRIPTION": "Acknowledgement of intimation of sanction of loan and its terms and conditions have been received on its duplicate copy from the borrower(s) and made part of loan case file.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 11.0, "CODE": 1002.0, "DESCRIPTION": "In case of documentation is other than Bank’s standard documents or in case of any complexity, Legal opinion has been obtained from Bank’s Legal Advisor/Legal Services Department through Zonal Manager, Credit Administration.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 12.0, "CODE": 1003.0, "DESCRIPTION": "The charge of the Bank has properly been entered against collateral as per documents available in the file. Charge Creation Certificate along with Zarai Pass Book duly indicating that Bank’s charge has been entered in the Revenue Record duly authenticated by the Revenue Officer has been made part of file.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 13.0, "CODE": 1004.0, "DESCRIPTION": "Loan Agreement has been executed between the Bank and the Borrower procedurally, witnessed properly as per “Qanoon-e-Shahadat” Order- 1984 and no column has been left blank.", "VAL": null, "FK_LOAN_APP_ID": null }, { "ID": 14.0, "CODE": 1005.0, "DESCRIPTION": "Following documents have been obtained and made part of system/file:\n\n• Under Pass Book System:\nAgricultural Pass Book\n\n• Outside Pass Book System/Building:\n\ni. Copy of the record of rights of security area i.e. Register Haqdaran-e-Zamin (Fard Jamabandi).\nii. Registry of plot/Bai-Nama/Allotment letter\niii. Approved map or Completion Plan of the building\niv. Non-Encumbrance Certificate (NEC)\nv. Khasra Gardawri (Optional)\nvi. Aks-Shajra (Optional)\nvii. Valuation Report by the approved Surveyor of the Bank\nviii. NOC from Society that the property can be mortgaged\nix. Legal Opinion\n\n• Agri-Land in Unsettled Area:\n\nAlienability Certificate issued by the Deputy Commissioner/ Assistant Commissioner/ Political Agent/ Asstt. Political Agent\n\n• Surety Loans:\n\ni. Surety bond by the borrower.\nii. Two guarantees in shape of agri land (Fard Jamabandi)\n", "VAL": null, "FK_LOAN_APP_ID": null }], "GetDeclarations": [{ "LOAN_APP_ID": 20191378542.0, "TEXT": "I Mr.ABID HUSSAIN Designation : MANAGER Job Category : SR-2005, certify that charge on security document of borrower(s) is intact in the system as well in the manual file at the time of rollover.", "TAG": "R", "STATE": 2.0, "STATE_PS": null, "ENTRY_DATE": "2020-02-11T13:30:15", "STATUS_NAME": "L A SAVED" }, { "LOAN_APP_ID": 20191378542.0, "TEXT": "I Mr.ABID HUSSAIN Designation : MANAGER Job Category : SR-2005, certify that charge on security document of borrower(s) is intact in the system as well in the manual file at the time of rollover.", "TAG": "R", "STATE": 2.0, "STATE_PS": null, "ENTRY_DATE": "2020-02-11T13:30:46", "STATUS_NAME": "L A SAVED" }], "GetWorkFlow": [{ "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 11.0, "USER_ID": "B-1127", "COMMENTS": "Disbursement Made", "COMMENT_ID": 5672.0, "STATUS_NAME": null, "COMMENT_DATE": "2019-02-12T17:55:50" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 11.0, "USER_ID": "B-1127", "COMMENTS": "Disbursement Made", "COMMENT_ID": 5673.0, "STATUS_NAME": null, "COMMENT_DATE": "2019-02-12T17:56:01" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 11.0, "USER_ID": "B-1127", "COMMENTS": "Disbursement Made", "COMMENT_ID": 7789.0, "STATUS_NAME": null, "COMMENT_DATE": "2020-02-11T13:32:03" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 11.0, "USER_ID": "B-1127", "COMMENTS": "Disbursement Made", "COMMENT_ID": 7790.0, "STATUS_NAME": null, "COMMENT_DATE": "2020-02-11T13:32:14" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 2.0, "USER_ID": "B-3774", "COMMENTS": null, "COMMENT_ID": 4334132.0, "STATUS_NAME": "L A SAVED", "COMMENT_DATE": "2019-02-12T17:48:15" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 3.0, "USER_ID": "B-3774", "COMMENTS": "CWR REQUEST SUBMITTED BY 130531", "COMMENT_ID": 4334134.0, "STATUS_NAME": "CWR REQUEST GENERATED", "COMMENT_DATE": "2019-02-12T17:48:26" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 4.0, "USER_ID": "B-1127", "COMMENTS": "CWR RESPONSE GENERATED BY 64460", "COMMENT_ID": 4334137.0, "STATUS_NAME": "CWR RESPONSE GENERATED", "COMMENT_DATE": "2019-02-12T17:48:52" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 5.0, "USER_ID": "B-3774", "COMMENTS": "ORR SUBMITTED BY 130531", "COMMENT_ID": 4334142.0, "STATUS_NAME": "ORR APPLIED", "COMMENT_DATE": "2019-02-12T17:49:32" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 6.0, "USER_ID": "B-1127", "COMMENTS": "ORR AUTHORIZED BY 64460 ( K ).", "COMMENT_ID": 4334144.0, "STATUS_NAME": "CAD LEVEL II/ LEVEL 1 PROCESSED", "COMMENT_DATE": "2019-02-12T17:49:52" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 8.0, "USER_ID": "B-1161", "COMMENTS": "CAD HAS VERIFIED CASE BY 81221 ( A ).", "COMMENT_ID": 4334147.0, "STATUS_NAME": "CAD PROCESSED/REF TO BR.MGR", "COMMENT_DATE": "2019-02-12T17:50:22" }, { "LOAN_APP_ID": 20191378542.0, "STATUS_ID": 10.0, "USER_ID": "B-1127", "COMMENTS": "LOANCASE IS SANCTIONED BY 64460 ( OK ).-CASE IS SANCTIONED AND READY FOR DISBURSEMENT.", "COMMENT_ID": 4334155.0, "STATUS_NAME": "L.C SANCTIONED", "COMMENT_DATE": "2019-02-12T17:51:52" }], "GetRolloverActivity": [], "GetRescheduleActivity": [], "GetDisbursementsRecoveries": [{ "DISB_DESC": "DISB-1", "FIRST_SANCTIONED_AMOUNT": 265000.0, "PROPOSAL_NAME": "181-SADA BAHAR SCHEME (SBS)", "SUB_PROPOSAL_NAME": "104-Potatoes", "SCHEME_CODE": "181", "CROP_CODE": "104", "NEW_NEXT_DUE_DATE": "2222-01-01T00:00:00", "GL_DESCRIPTION": "9018", "LOAN_DISB_ID": 20191881608.0, "RECOVERED_PRINCIPAL": 265000.0, "RECOVERED_MARKUP": 36886.0, "LAST_RECOVERY_DATE": "2020-02-10T00:00:00", "FIRST_DEFAULT_DATE": null, "DISB_DATE": "2019-02-12T00:00:00", "NEXT_DUE_DATE": "2222-01-01T00:00:00", "OTHER_RECEIVEABLE": 0.0, "LEGAL_CHARGES_RECIVEABLE": 0.0, "SAM_COST_OF_FUND": 0.0, "SAM_COST_OF_FUND_REC": 0.0, "DISBURSED_AMOUNT": 265000.0, "TODATE_MARKUP": 36886.0, "BALANCE": 0.0, "IS_ACTIVE": "CLOSED", "DISB_STATUS_NAME": "NORMAL ", "TODATE_PROVISION": 0.0, "TODATE_ACCRUAL": 36886.0, "PROG_REMISSION": 0.0, "PROG_WRTOFF": 0.0, "INT_RATE": 14.0, "VALID_UNTIL": "2020-02-11T00:00:00", "MARKUP_STOP_FLAG": "N", "PROG_ADDTIONAL_MARKUP": 0.0, "NEXT_DUEDATE_INST_BASED": "2222-01-01T00:00:00", "IS_DECEASED": "NO" }, { "DISB_DESC": "DISB-2", "FIRST_SANCTIONED_AMOUNT": 65000.0, "PROPOSAL_NAME": "181-SADA BAHAR SCHEME (SBS)", "SUB_PROPOSAL_NAME": null, "SCHEME_CODE": "181", "CROP_CODE": null, "NEW_NEXT_DUE_DATE": "2222-01-01T00:00:00", "GL_DESCRIPTION": "9160", "LOAN_DISB_ID": 20191881609.0, "RECOVERED_PRINCIPAL": 65000.0, "RECOVERED_MARKUP": 9048.0, "LAST_RECOVERY_DATE": "2020-02-10T00:00:00", "FIRST_DEFAULT_DATE": null, "DISB_DATE": "2019-02-12T00:00:00", "NEXT_DUE_DATE": "2222-01-01T00:00:00", "OTHER_RECEIVEABLE": 0.0, "LEGAL_CHARGES_RECIVEABLE": 0.0, "SAM_COST_OF_FUND": 0.0, "SAM_COST_OF_FUND_REC": 0.0, "DISBURSED_AMOUNT": 65000.0, "TODATE_MARKUP": 9048.0, "BALANCE": 0.0, "IS_ACTIVE": "CLOSED", "DISB_STATUS_NAME": "NORMAL ", "TODATE_PROVISION": 0.0, "TODATE_ACCRUAL": 9048.0, "PROG_REMISSION": 0.0, "PROG_WRTOFF": 0.0, "INT_RATE": 14.0, "VALID_UNTIL": "2020-02-11T00:00:00", "MARKUP_STOP_FLAG": "N", "PROG_ADDTIONAL_MARKUP": 0.0, "NEXT_DUEDATE_INST_BASED": "2222-01-01T00:00:00", "IS_DECEASED": "NO" }, { "DISB_DESC": "DISB-3", "FIRST_SANCTIONED_AMOUNT": 265000.0, "PROPOSAL_NAME": "181-SADA BAHAR SCHEME (SBS)", "SUB_PROPOSAL_NAME": "104-Potatoes", "SCHEME_CODE": "181", "CROP_CODE": "104", "NEW_NEXT_DUE_DATE": "2021-02-10T00:00:00", "GL_DESCRIPTION": "9018", "LOAN_DISB_ID": 20202257714.0, "RECOVERED_PRINCIPAL": 0.0, "RECOVERED_MARKUP": 13251.0, "LAST_RECOVERY_DATE": null, "FIRST_DEFAULT_DATE": null, "DISB_DATE": "2020-02-11T00:00:00", "NEXT_DUE_DATE": "2021-02-10T00:00:00", "OTHER_RECEIVEABLE": 0.0, "LEGAL_CHARGES_RECIVEABLE": 0.0, "SAM_COST_OF_FUND": 0.0, "SAM_COST_OF_FUND_REC": 0.0, "DISBURSED_AMOUNT": 265000.0, "TODATE_MARKUP": 33961.0, "BALANCE": 285710.0, "IS_ACTIVE": "YES", "DISB_STATUS_NAME": "NORMAL ", "TODATE_PROVISION": 0.0, "TODATE_ACCRUAL": 32944.0, "PROG_REMISSION": 13251.0, "PROG_WRTOFF": 0.0, "INT_RATE": 14.0, "VALID_UNTIL": null, "MARKUP_STOP_FLAG": "N", "PROG_ADDTIONAL_MARKUP": 0.0, "NEXT_DUEDATE_INST_BASED": "2021-02-10T00:00:00", "IS_DECEASED": "NO" }, { "DISB_DESC": "DISB-4", "FIRST_SANCTIONED_AMOUNT": 65000.0, "PROPOSAL_NAME": "181-SADA BAHAR SCHEME (SBS)", "SUB_PROPOSAL_NAME": null, "SCHEME_CODE": "181", "CROP_CODE": null, "NEW_NEXT_DUE_DATE": "2021-02-10T00:00:00", "GL_DESCRIPTION": "9160", "LOAN_DISB_ID": 20202257715.0, "RECOVERED_PRINCIPAL": 0.0, "RECOVERED_MARKUP": 3251.0, "LAST_RECOVERY_DATE": null, "FIRST_DEFAULT_DATE": null, "DISB_DATE": "2020-02-11T00:00:00", "NEXT_DUE_DATE": "2021-02-10T00:00:00", "OTHER_RECEIVEABLE": 0.0, "LEGAL_CHARGES_RECIVEABLE": 0.0, "SAM_COST_OF_FUND": 0.0, "SAM_COST_OF_FUND_REC": 0.0, "DISBURSED_AMOUNT": 65000.0, "TODATE_MARKUP": 8330.0, "BALANCE": 70079.0, "IS_ACTIVE": "YES", "DISB_STATUS_NAME": "NORMAL ", "TODATE_PROVISION": 0.0, "TODATE_ACCRUAL": 8081.0, "PROG_REMISSION": 3251.0, "PROG_WRTOFF": 0.0, "INT_RATE": 14.0, "VALID_UNTIL": null, "MARKUP_STOP_FLAG": "N", "PROG_ADDTIONAL_MARKUP": 0.0, "NEXT_DUEDATE_INST_BASED": "2021-02-10T00:00:00", "IS_DECEASED": "NO" }] })");

                    this.cdRef.detectChanges();
                } else {

                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

}



