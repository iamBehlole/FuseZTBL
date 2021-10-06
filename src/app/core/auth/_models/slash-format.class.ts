import { NativeDateAdapter } from '@angular/material';
import { formatDate } from '@angular/common';

export class SlashFormat {


  //public PageBit: number;
  //public StartIndex: number;

  //public EndIndex: number;

  public TagName: string;
  //public ParentId: number;
}






export const SlashDateFormats = {
  parse: {
    dateInput: ['YYYY-MM-DD']
  },
  display: {
    dateInput: 'DD/MM/yyyy',
    monthYearLabel: 'MMM/YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM/YYYY',
  },
};
