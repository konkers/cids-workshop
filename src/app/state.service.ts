import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';

import { FoundItems, State, STATE_VERSION } from './state.model';

export { Found, FoundLocation, State } from './state.model';

const STORAGE_KEY = 'workshop.state';

@Injectable({ providedIn: 'root' })
export class StateService {
  state$: Observable<State>;
  private stateData: State;
  private _state: BehaviorSubject<State>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    console.log(this.storage.get(STORAGE_KEY));
    this.stateData = this.storage.get(STORAGE_KEY) || this.defaultState();
    if (this.stateData.version !== STATE_VERSION) {
      this.stateData = this.defaultState();
    }
    console.log(this.stateData);

    this._state = <BehaviorSubject<State>>new BehaviorSubject(this.stateData);
    this.state$ = this._state.asObservable();
  }

  getState() {
    return this.state$;
  }


  private store() {
    if ('hook' in this.stateData.key_items || 'magma-key' in this.stateData.key_items) {
      this.stateData.key_items['underground'] = { location: 'virt', slot: 0 };
    } else {
      delete this.stateData.key_items['underground'];
    }

    console.log('saving state', this.stateData);
    this._state.next(this.stateData);
    this.storage.set(STORAGE_KEY, this.stateData);
  }

  updateFoundItems(foundItems: FoundItems) {
    this.stateData.found_items = foundItems;
    this.store();
  }

  recordKeyItem(key: string, loc: string, slot: number) {
    if (!(key in this.stateData.key_items)) {
      this.stateData.key_items[key] = { location: loc, slot: slot };
      this.store();
    }
  }

  unrecordKeyItem(key: string, loc: string, slot: number) {
    delete this.stateData.key_items[key];
    this.store();
  }

  recordCharacter(char: string, loc: string, slot: number) {
    if (!(char in this.stateData.chars)) {
      this.stateData.chars[char] = { location: loc, slot: slot };
      this.store();
    }
  }

  unrecordCharacter(char: string, loc: string, slot: number) {
    delete this.stateData.chars[char];
    this.store();
  }

  recordBoss(boss: string, loc: string, slot: number) {
    if (!(boss in this.stateData.bosses)) {
      this.stateData.bosses[boss] = { location: loc, slot: slot };
      this.store();
    }
  }

  unrecordBoss(boss: string, loc: string, slot: number) {
    delete this.stateData.bosses[boss];
    this.store();
  }

  defaultState(): State {
    return {
      version: STATE_VERSION,
      found_items: {},
      key_items: {},
      chars: {},
      bosses: {},
    };
  }

  reset() {
    this.stateData = this.defaultState();
    this.store();
  }
}
