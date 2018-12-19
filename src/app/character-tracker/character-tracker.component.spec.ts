import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CharacterTrackerComponent } from "./character-tracker.component";

describe("CharacterTrackerComponent", () => {
  let component: CharacterTrackerComponent;
  let fixture: ComponentFixture<CharacterTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CharacterTrackerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
