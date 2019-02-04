import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { KeyItemPickerComponent } from "./key-item-picker.component";

describe("KeyItemPickerComponent", () => {
  let component: KeyItemPickerComponent;
  let fixture: ComponentFixture<KeyItemPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyItemPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyItemPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
