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

  searchControl = new FormControl();
  filteredItems: Observable<Item[]>;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getItems().subscribe(items => {
      this.items = items;

      this.filteredItems = this.searchControl.valueChanges.pipe(
        startWith<string | Item>(""),
        map(value => (typeof value === "string" ? value : value.name)),
        map(name => (name ? this._filter(name) : this.items.slice()))
      );
    });

    this.itemService.getSelectedItems().subscribe(s => {
      this.selectedItems = s;
    });

    this.itemService.getFoundItems().subscribe(f => {
      this.foundItems = f;
    });
  }

  displayItem(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  addItem(item: Item) {
    this.searchControl.setValue("");
    this.itemService.addSelectedItem(item);
  }

  deleteRecord(index: number) {
    this.itemService.deleteSelectedItem(index);
  }

  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();

    return this.items.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
