import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopItemPickerComponent } from './shop-item-picker.component';

describe('ShopItemPickerComponent', () => {
  let component: ShopItemPickerComponent;
  let fixture: ComponentFixture<ShopItemPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopItemPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopItemPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
