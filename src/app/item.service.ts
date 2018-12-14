import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import { Item, ItemRecord } from './item.model';

const STORAGE_KEY = 'tracker.items.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  items: Observable<Item[]>;
  recordedItems: Observable<ItemRecord[]>;
  private recordedItemsData: ItemRecord[];
  private _recordedItems: BehaviorSubject<ItemRecord[]>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, private http: HttpClient) {
    this.items = this.http.get<Item[]>('./assets/data/items.json');
    this.recordedItemsData = this.storage.get(STORAGE_KEY) || [];
    this._recordedItems = <BehaviorSubject<ItemRecord[]>>new BehaviorSubject(this.recordedItemsData);
    this.recordedItems = this._recordedItems.asObservable();
  }


  public getItems(): Observable<Item[]> {
    return this.items;
  }

  public getItemRecords(): Observable<ItemRecord[]> {
    return this.recordedItems;
  }

  private recordsChanged() {
    this._recordedItems.next(this.recordedItemsData);
    this.storage.set(STORAGE_KEY, this.recordedItemsData);
  }
  public addItemRecord(item: Item) {
    const record: ItemRecord = { item_id: item.id, town_ids: [] };
    this.recordedItemsData.push(record);
    this.recordsChanged();
  }

  public deleteItemRecord(index: number) {
    this.recordedItemsData.splice(index, 1);
    this.recordsChanged();
  }

  public moveItemRecord(prev: number, next: number) {
    const record = this.recordedItemsData[prev];
    this.recordedItemsData.splice(prev, 1);
    this.recordedItemsData.splice(next, 0, record);
    this.recordsChanged();
  }

  public updateRecord(itemId: number, townIds: number[]) {
    for (let i = 0; i < this.recordedItemsData.length; i++) {
      if (this.recordedItemsData[i].item_id === itemId) {
        this.recordedItemsData[i].town_ids = townIds;
      }
    }
    this.recordsChanged();
  }

}
