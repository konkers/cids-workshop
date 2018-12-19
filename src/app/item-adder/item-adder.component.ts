import { Component, OnInit, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { Item, ItemService, FoundItems } from "../item.service";

@Component({
  selector: "app-item-adder",
  templateUrl: "./item-adder.component.html",
  styleUrls: ["./item-adder.component.scss"]
})
export class ItemAdderComponent implements OnInit {
  @Input() autoCheckLoc: string;

  items: Item[];
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
  }

  addItem(item: Item) {
    this.searchControl.setValue("");
    this.itemService.addSelectedItem(item);
    if (this.autoCheckLoc) {
      this.itemService.markFoundItem(item.id, this.autoCheckLoc, true);
    }
  }

  displayItem(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();

    return this.items.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
