import { Injectable, Inject } from "@angular/core";
import { SESSION_STORAGE, StorageService } from "angular-webstorage-service";
import { BehaviorSubject, Observable } from "rxjs";

import { FoundItems, State, STATE_VERSION } from "./state.model";
import { ObservableData } from "./observable-data";

export {
  Found,
  FoundLocation,
  State,
  TrappedChests,
  TrappedChestsLocation
} from "./state.model";

const STORAGE_KEY = "workshop.state";

export interface CharactersFoundState {
  [index: string]: number;
}

@Injectable({ providedIn: "root" })
export class StateService {
  state$: Observable<State>;
  private stateData: State;
  private _state: BehaviorSubject<State>;

  private charsFound: ObservableData<CharactersFoundState>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.stateData = this.storage.get(STORAGE_KEY) || this.defaultState();
    this.updateStateData();

    this._state = <BehaviorSubject<State>>new BehaviorSubject(this.stateData);
    this.state$ = this._state.asObservable();

    const charsFound: CharactersFoundState = {};
    for (const locId of Object.keys(this.stateData.location_info)) {
      const loc = this.stateData.location_info[locId];
      for (const poiId of Object.keys(loc.poi_states)) {
        const poi = loc.poi_states[poiId];
        if (poi.char) {
          if (poi.char in charsFound) {
            charsFound[poi.char] += 1;
          } else {
            charsFound[poi.char] = 1;
          }
        }
      }
    }

    this.charsFound = new ObservableData<CharactersFoundState>(charsFound);
  }

  getState() {
    return this.state$;
  }

  getCharactersFound(): Observable<CharactersFoundState> {
    return this.charsFound.data$;
  }

  private store() {
    console.log("saving state", this.stateData);
    this._state.next(this.stateData);
    this.storage.set(STORAGE_KEY, this.stateData);
  }

  updateFoundItems(foundItems: FoundItems) {
    this.stateData.found_items = foundItems;
    this.store();
  }

  private slotEmpty(loc: string, slot: number): boolean {
    for (const id of Object.keys(this.stateData.key_items)) {
      const ki = this.stateData.key_items[id];
      if (ki.slot === slot && ki.location === loc) {
        return false;
      }
    }
    return true;
  }

  private recordItemFound(loc: string, slot: number, field: string) {
    if (
      this.stateData.location_info[loc] &&
      this.stateData.location_info[loc][field][slot] === true
    ) {
      delete this.stateData.location_info[loc][field][slot];
    } else {
      this.stateData.location_info[loc][field][slot] = true;
    }
  }

  recordKeyItem(key: string, type: string, loc: string, slot: number) {
    if (key === undefined) {
      return;
    }

    // Ensure we have location info for this location.
    if (!this.stateData.location_info[loc]) {
      this.stateData.location_info[loc] = {
        poi_states: {},
        poi_found_item: {},
        chest_found_item: {}
      };
    }

    if (key === "chest") {
      switch (type) {
        case "boss":
          this.recordItemFound(loc, slot, "poi_found_item");
          break;
        case "trapped":
          this.recordItemFound(loc, slot, "chest_found_item");
          break;
      }
      this.store();
    } else if (!(key in this.stateData.key_items)) {
      this.stateData.key_items[key] = { location: loc, slot: slot, type: type };
      this.store();
    }
  }

  unrecordKeyItem(key: string) {
    delete this.stateData.key_items[key];
    this.store();
  }

  ensureLocationPoi(locId: string, poiIndex: number) {
    if (!this.stateData.location_info[locId]) {
      this.stateData.location_info[locId] = {
        poi_states: {},
        poi_found_item: {},
        chest_found_item: {}
      };
    }

    const loc = this.stateData.location_info[locId];

    if (!loc.poi_states[poiIndex]) {
      loc.poi_states[poiIndex] = {};
    }
  }

  recordCharacter(
    char: string,
    locId: string,
    slotId: number,
    allowDupes: boolean
  ) {
    if (
      !allowDupes &&
      char in this.charsFound.data &&
      this.charsFound.data[char] > 0
    ) {
      return;
    }

    this.ensureLocationPoi(locId, slotId);

    const slot = this.stateData.location_info[locId].poi_states[slotId];
    if (char && !slot.char) {
      slot.char = char;
      this.store();
      if (char in this.charsFound.data) {
        this.charsFound.data[char] += 1;
      } else {
        this.charsFound.data[char] = 1;
      }
      this.charsFound.next();
    }
  }

  unrecordCharacter(char: string, loc: string, slot: number) {
    delete this.stateData.location_info[loc].poi_states[slot].char;
    this.store();
    this.charsFound.data[char] -= 1;
    this.charsFound.next();
  }

  recordBoss(boss: string, type: string, loc: string, slot: number) {
    if (!(boss in this.stateData.bosses)) {
      this.stateData.bosses[boss] = { location: loc, slot: slot, type: type };
      this.store();
    }
  }

  unrecordBoss(boss: string) {
    delete this.stateData.bosses[boss];
    this.store();
  }

  recordTrappedChest(locId: string, chest: number, found: boolean) {
    if (!(locId in this.stateData.trapped_chests)) {
      this.stateData.trapped_chests[locId] = {};
    }
    this.stateData.trapped_chests[locId][chest] = found;
    this.store();
  }

  defaultState(): State {
    return {
      version: STATE_VERSION,
      found_items: {},
      key_items: {},
      bosses: {},
      location_info: {},
      trapped_chests: {}
    };
  }

  private checkStateField(field: string) {
    const defaults = this.defaultState();

    if (!(field in this.stateData)) {
      this.stateData[field] = defaults[field];
    }
  }
  private updateStateData() {
    if (this.stateData.version <= 3) {
      this.stateData = this.defaultState();
      return;
    }
    this.checkStateField("found_items");
    this.checkStateField("key_items");
    this.checkStateField("chars");
    this.checkStateField("bosses");
    this.checkStateField("location_info");
    this.checkStateField("trapped_chests");
    this.stateData.version = STATE_VERSION;
  }

  reset() {
    this.stateData = this.defaultState();
    this.store();
    this.charsFound.data = {};
    this.charsFound.next();
  }
}
