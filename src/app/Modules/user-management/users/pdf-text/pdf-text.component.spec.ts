import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTextComponent } from './pdf-text.component';

describe('PdfTextComponent', () => {
  let component: PdfTextComponent;
  let fixture: ComponentFixture<PdfTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
