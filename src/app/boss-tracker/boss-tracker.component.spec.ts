import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BossTrackerComponent } from "./boss-tracker.component";

describe("BossTrackerComponent", () => {
  let component: BossTrackerComponent;
  let fixture: ComponentFixture<BossTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BossTrackerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
