import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KeyItem } from './key-item.model';
import { KeyItemsFound } from './state.model';
import { StateService } from './state.service';

export { KeyItem } from './key-item.model';
export { KeyItemLocation } from './state.model';

export interface KeyItems {
  [index: string]: KeyItem;
}

@Injectable({
  providedIn: 'root'
})
export class KeyItemService {
  private _keyItems: BehaviorSubject<KeyItems>;
  keyItems$: Observable<KeyItems>;

  private _keyItemOrder: BehaviorSubject<string[]>;
  keyItemOrder$: Observable<string[]>;

  constructor(private http: HttpClient, private stateService: StateService) {
    this._keyItems = <BehaviorSubject<KeyItems>>new BehaviorSubject(undefined);
    this.keyItems$ = this._keyItems.asObservable();

    this._keyItemOrder =
      <BehaviorSubject<string[]>>new BehaviorSubject(undefined);
    this.keyItemOrder$ = this._keyItemOrder.asObservable();

    this.http.get<KeyItem[]>('./assets/data/key-items.json').subscribe(keyItems => {
      this._keyItemOrder.next(keyItems.map(ki => ki.id));

      this._keyItems.next(keyItems.reduce((kis, ki) => {
        kis[ki.id] = ki;
        return kis;
      }, {}));
    });
  }

  getKeyItems(): Observable<KeyItems> {
    return this.keyItems$;
  }

  getKeyItemOrder(): Observable<string[]> {
    return this.keyItemOrder$;
  }

  getKeyItemsFound(): Observable<KeyItemsFound> {
    return this.stateService.getState().pipe(
      map(state => state.key_items
      ));
  }
}
