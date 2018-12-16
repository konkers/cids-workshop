import {Injectable, Inject} from '@angular/core';
import {SESSION_STORAGE, StorageService} from 'angular-webstorage-service';
import {BehaviorSubject, Observable} from 'rxjs';

import {FoundItems, State, STATE_VERSION} from './state.model';

const STORAGE_KEY = 'workshop.state';

@Injectable({providedIn: 'root'})
export class StateService {
  state$: Observable<State>;
  private stateData: State;
  private _state: BehaviorSubject<State>;


  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    console.log(this.storage.get(STORAGE_KEY));
    this.stateData = this.storage.get(STORAGE_KEY) || this.defaultState();
    console.log(this.stateData);

    this._state = <BehaviorSubject<State>>new BehaviorSubject(this.stateData);
    this.state$ = this._state.asObservable();
  }

  getState() {
    return this.state$;
  }

   private store() {
    console.log('saving state', this.stateData);
    this._state.next(this.stateData);
    this.storage.set(STORAGE_KEY, this.stateData);
   }

   updateFoundItems(foundItems: FoundItems) {
     this.stateData.found_items = foundItems;
     this.store();
   }

   defaultState(): State {
    return {
      version: STATE_VERSION,
      found_items: {},
    };
   }

   reset() {
     this.stateData = this.defaultState();
     this.store();
   }
}
