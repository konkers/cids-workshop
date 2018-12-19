import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { Item, ItemService, FoundItems } from "../item.service";

@Component({
  selector: "app-shop-item-picker",
  templateUrl: "./shop-item-picker.component.html",
  styleUrls: ["./shop-item-picker.component.scss"]
})
export class ShopItemPickerComponent implements OnInit {
  @Input() location: string;
  @Input() shopType: string;

  items: Item[];
  selectedItems: number[];
  foundItems: FoundItems;

  constructor(private itemService: ItemService) {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
    this.itemService.getSelectedItems().subscribe(s => {
      this.selectedItems = s;
    });

    this.itemService.getFoundItems().subscribe(f => {
      this.foundItems = f;
    });
  }

  filterItems(items: Item[], selectedItems: number[]): number[] {
    return selectedItems.filter(i => this.displayItem(i));
  }

  displayItem(i: number) {
    if (!this.items || i >= this.items.length) {
      return false;
    }
    return this.items[i].shop_type === this.shopType;
  }

  found(id: number) {
    return id in this.foundItems && this.location in this.foundItems[id];
  }

  checked(id: number, found: boolean) {
    this.itemService.markFoundItem(id, this.location, found);
  }

  calcShopItems() {
    // let shopItems = [];
    // for (const ri in this.itemRecords) {
    //   const r = this.itemRecords[ri];
    //   shopItems[ri] = false;
    //   for (const t in r.town_ids) {
    //     if (this.location === t) {
    //       shopItems[ri] = true;
    //     }
    //   }
    // }
    // this.shopItems = shopItems;
  }

  ngOnInit() {}
}
