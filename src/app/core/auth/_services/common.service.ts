import { Injectable } from '@angular/core';
import { regExps } from '../_models/lov.class';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  isMatchSequentialInput(Input) {


    if (regExps.sequential.test(Input)) {
      return true;
    }

    else {

      if (regExps.sequentialsecond.test(Input)) 
        return true;
      else
      return false;
    }
  }



  stringToDateOld(date) {
    debugger;
    if (date != undefined && date != null && date != '') {
      const day = date.substr(0, 2);
      const month = date.substr(2, 2);
      const year = date.substr(4, date.length);
      const Fdate = new Date(year, month, day);
      return Fdate;

    }
    else
      return '';

  }


  stringToDate(date) {
    if (date != undefined && date != null && date != '') {
      const day = date.substr(0, 2);
      const month = date.substr(2, 2);
      const year = date.substr(4, date.length);
      const Fdate = new Date(year+"-"+month+"-"+day);
      return Fdate;

    }
    else
      return '';

  }

  dateToString(date) {
    debugger;
    if (date != undefined && date != null && date != '') {
      const format = 'DDMMyyyy';
      const locale = 'en-US';
      return formatDate(date, format, locale);
    }
    else
      return '';

  }

}
