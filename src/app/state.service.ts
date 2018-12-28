import { Injectable, Inject } from "@angular/core";
import { SESSION_STORAGE, StorageService } from "angular-webstorage-service";
import { BehaviorSubject, Observable } from "rxjs";

import { FoundItems, State, STATE_VERSION } from "./state.model";

export {
  Found,
  FoundLocation,
  State,
  TrappedChests,
  TrappedChestsLocation
} from "./state.model";

const STORAGE_KEY = "workshop.state";

@Injectable({ providedIn: "root" })
export class StateService {
  state$: Observable<State>;
  private stateData: State;
  private _state: BehaviorSubject<State>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    console.log(this.storage.get(STORAGE_KEY));
    this.stateData = this.storage.get(STORAGE_KEY) || this.defaultState();
    this.updateStateData();
    console.log(this.stateData);

    this._state = <BehaviorSubject<State>>new BehaviorSubject(this.stateData);
    this.state$ = this._state.asObservable();
  }

  getState() {
    return this.state$;
  }

  private store() {
    if (
      "hook" in this.stateData.key_items ||
      "magma-key" in this.stateData.key_items
    ) {
      this.stateData.key_items["underground"] = { location: "virt", slot: 0 };
    } else {
      delete this.stateData.key_items["underground"];
    }

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

  recordCharacter(char: string, type: string, loc: string, slot: number) {
    if (!(char in this.stateData.chars)) {
      this.stateData.chars[char] = { location: loc, slot: slot, type: type };
      this.store();
    }
  }

  unrecordCharacter(char: string) {
    delete this.stateData.chars[char];
    this.store();
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
      chars: {},
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
    if (this.stateData.version <= 2) {
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
  }
}
