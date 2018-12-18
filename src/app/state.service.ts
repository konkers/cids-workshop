import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import { FoundItems, State, STATE_VERSION } from './state.model';
import { Location } from './location.model';

export { State } from './state.model';

// These below are used to aggregate state by location instead of char,
// key item, boss, etc.
export interface PoiState {
  enabled: boolean;
}

export interface PoiStates {
  [index: number]: PoiState;
}

export interface LocationState {
  enabled: boolean;
  poi: PoiStates;
}

export interface LocationStates {
  [index: string]: LocationState;
}

const STORAGE_KEY = 'workshop.state';

@Injectable({ providedIn: 'root' })
export class StateService {
  state$: Observable<State>;
  private stateData: State;
  private _state: BehaviorSubject<State>;

  locationState$: Observable<LocationStates>;
  private locationStateData: LocationStates;
  private _locationState: BehaviorSubject<LocationState>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    console.log(this.storage.get(STORAGE_KEY));
    this.stateData = this.storage.get(STORAGE_KEY) || this.defaultState();
    console.log(this.stateData);

    this._state = <BehaviorSubject<State>>new BehaviorSubject(this.stateData);
    this.state$ = this._state.asObservable();

    this.processLocationState();
  }

  getState() {
    return this.state$;
  }

  private processLocationState() {
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
    this.stateData.key_items[key] = { location: loc, slot: slot };
    this.store();
  }

  defaultState(): State {
    return {
      version: STATE_VERSION,
      found_items: {},
      key_items: {},
    };
  }

  reset() {
    this.stateData = this.defaultState();
    this.store();
  }

  getLocationState(location$: Observable<Location>): Observable<LocationState> {
    const state$ = this.getState();

    return combineLatest(state$, location$, (state, loc) => {
      const l: LocationState = { enabled: false, poi: [] };
      if (state === undefined || loc === undefined) {
        return l;
      }

      for (const p of Object.keys(loc.poi)) {
        const poi = loc.poi[p];
        const ps: PoiState = {
          enabled: true,
        };
        if ('reqs' in poi) {
          for (const req of poi.reqs) {
            if (!(req in state.key_items)) {
              ps.enabled = false;
            }
          }
        }

        if (ps.enabled) {
          l.enabled = true;
        }
        l.poi[p] = poi;
      }

      return l;
    });
  }
}
