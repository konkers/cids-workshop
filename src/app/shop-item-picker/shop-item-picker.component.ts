import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {Item, ItemRecord} from '../item.model';
import {ItemService, FoundItems, ItemLocations} from '../item.service';

@Component({
  selector: 'app-shop-item-picker',
  templateUrl: './shop-item-picker.component.html',
  styleUrls: ['./shop-item-picker.component.scss']
})

export class ShopItemPickerComponent implements OnInit {
  items: Item[];
  selectedItems: number[];
  foundItems: FoundItems;

  location: string;
  shopType: string;

  constructor(
      private route: ActivatedRoute, private router: Router,
      private itemService: ItemService) {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
    this.itemService.getSelectedItems()
      .subscribe(s => {
        this.selectedItems = s;
      });

    this.itemService.getFoundItems()
      .subscribe(f => {
        this.foundItems = f;
      });
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

  ngOnInit() {
    this.route.paramMap.subscribe(m => {
      this.location = m.get('loc');
      this.shopType = m.get('type');
      this.calcShopItems();
      console.log(this.location, this.shopType);
    });
  }
}
