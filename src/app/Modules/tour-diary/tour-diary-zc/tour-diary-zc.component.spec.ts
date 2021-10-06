import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDiaryZcComponent } from './tour-diary-zc.component';

describe('TourDiaryZcComponent', () => {
  let component: TourDiaryZcComponent;
  let fixture: ComponentFixture<TourDiaryZcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourDiaryZcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDiaryZcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
