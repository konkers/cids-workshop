import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import {KeyItems, KeyItemService} from '../key-item.service';
import { KeyItemsFound } from '../state.model';

@Component({
  selector: 'app-key-item-tracker',
  templateUrl: './key-item-tracker.component.html',
  styleUrls: ['./key-item-tracker.component.scss']
})
export class KeyItemTrackerComponent implements OnInit {
  @Output() select = new EventEmitter<string>();

  keyItems$: Observable<KeyItems>;
  keyItemOrder$: Observable<string[]>;

  keyItemsFound$: Observable<KeyItemsFound>;

  constructor(private keyItemService: KeyItemService) {
      this.keyItems$ = keyItemService.getKeyItems();
      this.keyItemOrder$ = keyItemService.getKeyItemOrder();
      this.keyItemsFound$ = keyItemService.getKeyItemsFound();
   }

  ngOnInit() {
  }

  selectKeyItem(keyItem: string) {
    this.select.emit(keyItem);
  }
}
