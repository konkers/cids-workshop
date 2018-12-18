import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyItemTrackerComponent } from './key-item-tracker.component';

describe('KeyItemTrackerComponent', () => {
  let component: KeyItemTrackerComponent;
  let fixture: ComponentFixture<KeyItemTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyItemTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyItemTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
