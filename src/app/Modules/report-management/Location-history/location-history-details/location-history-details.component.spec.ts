import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationHistoryDetailsComponent } from './location-history-details.component';

describe('LocationHistoryDetailsComponent', () => {
  let component: LocationHistoryDetailsComponent;
  let fixture: ComponentFixture<LocationHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
