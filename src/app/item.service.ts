import { HttpClient } from "@angular/common/http";
import { Identifiers } from "@angular/compiler";
import { Inject, Injectable } from "@angular/core";
import { SESSION_STORAGE, StorageService } from "angular-webstorage-service";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ConfigService } from "./config.service";
import { Item } from "./item.model";
import { FoundItems, ItemLocations } from "./state.model";
import { StateService } from "./state.service";

export { FoundItems, ItemLocations } from "./state.model";
export { Item } from "./item.model";

const STORAGE_KEY = "tracker.items.service";

@Injectable({ providedIn: "root" })
export class ItemService {
  items: Observable<Item[]>;
  selectedItems: number[];
  foundItems: FoundItems;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private stateService: StateService
  ) {
    this.items = this.http.get<Item[]>("./assets/data/items.json");
    this.configService.getConfig().subscribe(c => {
      this.selectedItems = c.selected_items;
    });
    this.stateService.getState().subscribe(s => {
      this.foundItems = s.found_items;
    });
  }

  public getItems(): Observable<Item[]> {
    return this.items;
  }

  public getSelectedItems(): Observable<number[]> {
    return this.configService.getConfig().pipe(map(c => c.selected_items));
  }

  public getFoundItems(): Observable<FoundItems> {
    return this.stateService.getState().pipe(map(s => s.found_items));
  }

  public addSelectedItem(item: Item) {
    console.log("add", item);
    this.selectedItems.push(item.id);
    this.configService.updateSelectedItems(this.selectedItems);
  }

  public deleteSelectedItem(index: number) {
    this.selectedItems.splice(index, 1);
    this.configService.updateSelectedItems(this.selectedItems);
  }

  public moveItemRecord(prev: number, next: number) {
    const id = this.selectedItems[prev];
    this.selectedItems.splice(prev, 1);
    this.selectedItems.splice(next, 0, id);
    this.configService.updateSelectedItems(this.selectedItems);
  }

  public updateFoundItems(itemId: number, found: ItemLocations) {
    this.foundItems[itemId] = found;
    console.log(this.foundItems);
    this.stateService.updateFoundItems(this.foundItems);
  }

  public markFoundItem(itemId: number, location: string, found: boolean) {
    if (!(itemId in this.foundItems)) {
      this.foundItems[itemId] = {};
    }
    if (found) {
      this.foundItems[itemId][location] = true;
    } else {
      delete this.foundItems[itemId][location];
    }
    this.stateService.updateFoundItems(this.foundItems);
  }
}
