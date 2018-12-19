import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { Item, ItemService, FoundItems } from "../item.service";

import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.scss"]
})
export class ItemListComponent implements OnInit {
  items: Item[];
  selectedItems: number[];
  foundItems: FoundItems;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
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

  deleteRecord(index: number) {
    this.itemService.deleteSelectedItem(index);
  }
}
