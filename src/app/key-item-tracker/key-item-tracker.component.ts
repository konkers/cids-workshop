import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";

import { Found, KeyItems, KeyItemService } from "../key-item.service";

@Component({
  selector: "app-key-item-tracker",
  templateUrl: "./key-item-tracker.component.html",
  styleUrls: ["./key-item-tracker.component.scss"]
})
export class KeyItemTrackerComponent implements OnInit {
  @Input() extraActions?: boolean;
  @Output() select = new EventEmitter<string>();

  keyItems$: Observable<KeyItems>;
  keyItemOrder$: Observable<string[]>;

  keyItemsFound$: Observable<Found>;

  constructor(private keyItemService: KeyItemService) {
    this.keyItems$ = keyItemService.getKeyItems();
    this.keyItemOrder$ = keyItemService.getKeyItemOrder();
    this.keyItemsFound$ = keyItemService.getKeyItemsFound();
  }

  ngOnInit() {
    if (this.extraActions === undefined) {
      this.extraActions = false;
    }
  }

  selectKeyItem(keyItem: string) {
    this.select.emit(keyItem);
  }
}
