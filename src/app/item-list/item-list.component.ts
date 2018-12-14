import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Item, ItemRecord } from '../item.model';
import { ItemService } from '../item.service';

import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items: Item[];
  itemRecords: ItemRecord[];
  itemRecordsSource = new MatTableDataSource<ItemRecord>();

  searchControl = new FormControl();
  filteredItems: Observable<Item[]>;

  displayedColumns: string[] = ['item', 'shop', 'action'];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.itemService.getItems()
      .subscribe(items => {
        this.items = items;

        this.filteredItems = this.searchControl.valueChanges
          .pipe(
            startWith<string | Item>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.items.slice())
          );

      });

    this.itemService.getItemRecords()
      .subscribe(records => {
        this.itemRecords = records;
        this.itemRecordsSource.data = records;
        console.log(records);
      });
  }

  displayItem(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  addItem(item: Item) {
    this.searchControl.setValue('');
    this.itemService.addItemRecord(item);
  }

  deleteRecord(index: number) {
    this.itemService.deleteItemRecord(index);
  }
  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();

    return this.items.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  drop(event: CdkDragDrop<ItemRecord[]>) {
    console.log(event);
    this.itemService.moveItemRecord(event.previousIndex, event.currentIndex);
  }

}
