import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ObservableData } from "./observable-data";
import { KeyItem } from "./key-item.model";
import { Found, StateService } from "./state.service";

export { KeyItem } from "./key-item.model";
export { Found, FoundLocation } from "./state.service";

export interface KeyItems {
  [index: string]: KeyItem;
}

@Injectable({
  providedIn: "root"
})
export class KeyItemService {
  // TODO: replace with IndexedData.
  private _keyItems: BehaviorSubject<KeyItems>;
  keyItems$: Observable<KeyItems>;

  private _keyItemOrder: BehaviorSubject<string[]>;
  keyItemOrder$: Observable<string[]>;

  private state: ObservableData<Found>;

  constructor(private http: HttpClient, private stateService: StateService) {
    this._keyItems = <BehaviorSubject<KeyItems>>new BehaviorSubject(undefined);
    this.keyItems$ = this._keyItems.asObservable();

    this._keyItemOrder = <BehaviorSubject<string[]>>(
      new BehaviorSubject(undefined)
    );
    this.keyItemOrder$ = this._keyItemOrder.asObservable();

    this.state = new ObservableData<Found>(undefined);

    this.stateService.getState().subscribe(state => {
      const newState: Found = Object.assign({}, state.key_items);
      if ("hook" in state.key_items || "magma-key" in state.key_items) {
        newState["underground"] = { location: "virt", slot: 0 };
      } else {
        delete newState["underground"];
      }

      if (
        232 in state.found_items &&
        Object.keys(state.found_items[232]).length > 0 &&
        !("pass" in state.key_items)
      ) {
        newState["pass"] = { location: "virt", slot: 0 };
      }
      this.state.data = newState;
      this.state.next();
    });

    this.http
      .get<KeyItem[]>("./assets/data/key-items.json")
      .subscribe(keyItems => {
        this._keyItemOrder.next(keyItems.map(ki => ki.id));

        this._keyItems.next(
          keyItems.reduce((kis, ki) => {
            kis[ki.id] = ki;
            return kis;
          }, {})
        );
      });
  }

  getKeyItems(): Observable<KeyItems> {
    return this.keyItems$;
  }

  getKeyItemOrder(): Observable<string[]> {
    return this.keyItemOrder$;
  }

  getKeyItemsFound(): Observable<Found> {
    return this.state.data$;
  }
}
