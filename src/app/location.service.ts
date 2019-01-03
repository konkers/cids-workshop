import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import { Location, LocationPoi } from "./location.model";
import {
  Found,
  FoundLocation,
  State,
  StateService,
  TrappedChestsLocation
} from "./state.service";
import { Config, ConfigService } from "./config.service";
import { KeyItemService } from "./key-item.service";

export { Location, LocationBossStats, LocationPoi } from "./location.model";

export interface Locations {
  [index: string]: Location;
}

// These below are used to aggregate state by location instead of char,
// key item, boss, etc.
export interface PoiState {
  enabled: boolean;
  visible: boolean;
  keyItem?: string;
  character?: string;
  boss?: string;
  bossKeyItem?: string;
  hasKeyItem: boolean;
  foundItem: boolean;
}

export interface TrappedChestState {
  found: boolean;
  keyItem: string;
  foundItem: boolean;
}

export interface TrappedChestsState {
  [index: number]: TrappedChestState;
}

export interface PoiStates {
  [index: number]: PoiState;
}

export interface LocationState {
  enabled: boolean;
  poi: PoiStates;
  trapped_chests: TrappedChestsState;
}

export interface LocationStates {
  [index: string]: LocationState;
}

@Injectable({ providedIn: "root" })
export class LocationService {
  private locationsData: Locations;
  private _locations: BehaviorSubject<Locations>;
  locations: Observable<Locations>;

  private locationOrderData: string[];
  private _locationOrder: BehaviorSubject<string[]>;
  locationOrder: Observable<string[]>;

  locationState$: Observable<LocationStates>;
  private locationStateData: LocationStates;

  state: State;
  config: Config;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private stateService: StateService,
    private keyItemService: KeyItemService
  ) {
    this._locations = <BehaviorSubject<Locations>>(
      new BehaviorSubject(undefined)
    );
    this.locations = this._locations.asObservable();

    this._locationOrder = <BehaviorSubject<string[]>>(
      new BehaviorSubject(undefined)
    );
    this.locationOrder = this._locationOrder.asObservable();

    this.stateService.getState().subscribe(state => {
      this.state = state;
    });

    this.configService.getConfig().subscribe(config => {
      this.config = config;
    });

    this.locationState$ = combineLatest(
      this.stateService.getState(),
      this.configService.getConfig(),
      this.keyItemService.getKeyItemsFound(),
      this.locations
    ).pipe(
      map(results => {
        const state = Object.assign({}, results[0]);
        state.key_items = results[2];
        return this.processState(state, results[1], results[3]);
      })
    );
    this.locationState$.subscribe(s => {
      this.locationStateData = s;
    });

    this.http.get<Location[]>("./assets/data/locations.json").subscribe(l => {
      this.locationOrderData = l.map(a => a.id);
      this._locationOrder.next(this.locationOrderData);

      this.locationsData = l.reduce((locs, o) => {
        locs[o.id] = o;
        return locs;
      }, {});

      this._locations.next(this.locationsData);
    });
  }

  private checkReq(state: State, poi: LocationPoi): boolean {
    if ("reqs" in poi) {
      for (const req of poi.reqs) {
        if (!(req in state.key_items) && !(req in state.bosses)) {
          return false;
        }
      }
    }

    return true;
  }

  private processFlags(config: Config, poi: LocationPoi) {
    if (!("flags" in poi)) {
      return true;
    }
    let visible = false;
    for (let flag of poi.flags) {
      let invert = false;
      if (flag.substring(0, 1) === "!") {
        invert = true;
        flag = flag.substring(1);
      }
      if (flag in config.flags) {
        let flagVal = config.flags[flag];
        if (invert) {
          flagVal = !flagVal;
        }

        visible = visible || flagVal;
      } else {
        console.log(`Flag ${flag} unknown`);
      }
    }
    return visible;
  }

  private processPois(
    state: State,
    config: Config,
    loc: Location,
    l: LocationState
  ) {
    if (!("poi" in loc)) {
      l.enabled = true;
    } else {
      for (const p of Object.keys(loc.poi)) {
        const poi = loc.poi[p];
        const ps: PoiState = {
          enabled: false,
          visible: true,
          hasKeyItem: false,
          foundItem: false
        };

        if (this.checkReq(state, poi)) {
          ps.enabled = true;

          // If any of the pois are enabled,  The location stays enabled.
          l.enabled = true;
        }

        // Evaluate flags for poi visibility.
        ps.visible = this.processFlags(config, poi);

        if (state.location_info[loc.id]) {
          const info = state.location_info[loc.id];
          if (info.poi_states[p]) {
            ps.character = info.poi_states[p].char;
          }

          if (info.poi_found_item[p]) {
            ps.foundItem = true;
          }
        }

        // Check if this poi has a key item associated with it (i.e. bosses
        // in Kq and Km.
        if ("key_item_flag" in poi) {
          const ki_flag = poi.key_item_flag;
          if (ki_flag in config.flags && config.flags[ki_flag]) {
            ps.hasKeyItem = true;
          }
        }
        l.poi[p] = ps;
      }
    }
  }

  private processFound(
    state: State,
    states: LocationStates,
    type: string,
    stateKey: string,
    poiKey: string
  ) {
    for (const id of Object.keys(state[stateKey])) {
      const k: FoundLocation = state[stateKey][id];
      if (k.location === "virt") {
        continue;
      }
      if (k.type && k.type === type) {
        states[k.location].poi[k.slot][poiKey] = id;
      }
    }
  }

  private processState(
    state: State,
    config: Config,
    locationsData: Locations
  ): LocationStates {
    const states: LocationStates = {};

    if (
      state === undefined ||
      config === undefined ||
      locationsData === undefined
    ) {
      return states;
    }

    for (const locId of Object.keys(locationsData)) {
      const loc = locationsData[locId];
      const l: LocationState = { enabled: false, poi: [], trapped_chests: {} };

      this.processPois(state, config, loc, l);

      if (locId in state.trapped_chests) {
        const chests = state.trapped_chests[locId];
        for (const c of Object.keys(chests)) {
          l.trapped_chests[c] = {
            found: chests[c],
            keyItem: null,
            foundItem: false
          };
        }
        for (const c of Object.keys(
          state.location_info[locId].chest_found_item
        )) {
          if (state.location_info[locId].chest_found_item[c]) {
            l.trapped_chests[c].foundItem = true;
          }
        }
      }
      states[locId] = l;
    }

    this.processFound(state, states, "poi", "key_items", "keyItem");
    this.processFound(state, states, "poi", "bosses", "boss");
    this.processFound(state, states, "boss", "key_items", "bossKeyItem");

    for (const id of Object.keys(state.key_items)) {
      const k: FoundLocation = state.key_items[id];
      if (k.location === "virt" || k.type !== "trapped") {
        continue;
      }
      if (!states[k.location].trapped_chests[k.slot]) {
        states[k.location].trapped_chests[k.slot] = {
          found: false,
          keyItem: null,
          foundItem: false
        };
      }
      states[k.location].trapped_chests[k.slot].keyItem = id;
    }
    return states;
  }

  public getLocations(): Observable<Locations> {
    return this.locations;
  }

  public getLocationOrder(): Observable<string[]> {
    return this.locationOrder;
  }

  public getLocation(id: string): Observable<Location> {
    return this.getLocations().pipe(map(locs => locs[id]));
  }

  private processPoi(
    poiType: string,
    poiKey: string,
    found: Found,
    l: string,
    poiId: string,
    addFunc: (slot: number) => void,
    deleteFunc: () => void
  ) {
    if (l === undefined) {
      return;
    }
    const loc = this.locationsData[l];

    if (this.config.options.always_remove_key) {
      if (poiId in found) {
        deleteFunc();
        return;
      }
    } else {
      // First check if poi is already recorded.  If so, remove it.
      for (const p of Object.keys(loc.poi)) {
        const poi = loc.poi[p];
        const poiState = this.locationStateData[l].poi[p];
        if (poi.type === poiType && poiState[poiKey] === poiId) {
          deleteFunc();
          return;
        }
      }
    }

    // Not here, lets see if we have a free slot.
    for (const p of Object.keys(loc.poi)) {
      const poi = loc.poi[p];
      const poiState = this.locationStateData[l].poi[p];
      if (poi.type === poiType && !(poiKey in poiState)) {
        // addFunc() will make sure the key item is not recorded somewhere else.
        addFunc(Number(p));
        return;
      }
    }
  }

  processKeyItem(loc: string, keyItem: string) {
    this.processPoi(
      "key",
      "keyItem",
      this.state.key_items,
      loc,
      keyItem,
      slot => {
        this.stateService.recordKeyItem(keyItem, "poi", loc, slot);
      },
      () => {
        this.stateService.unrecordKeyItem(keyItem);
      }
    );
  }

  processChar(locId: string, charId: string) {
    if (!locId || !charId) {
      return;
    }

    const loc = this.locationsData[locId];
    const locState = this.locationStateData[locId];
    for (const i of Object.keys(locState.poi)) {
      const poiState = locState.poi[i];
      if (poiState.character === charId) {
        this.stateService.unrecordCharacter(charId, locId, Number(i));
        return;
      }
    }

    for (const i of Object.keys(loc.poi)) {
      const poi = loc.poi[i];
      const poiState = locState.poi[i];
      if (poi.type === "char" && !poiState.character) {
        this.stateService.recordCharacter(
          charId,
          locId,
          Number(i),
          !this.config.flags.nodupes
        );
        return;
      }
    }
  }

  processBoss(loc: string, boss: string) {
    this.processPoi(
      "boss",
      "boss",
      this.state.bosses,
      loc,
      boss,
      slot => {
        this.stateService.recordBoss(boss, "poi", loc, slot);
      },
      () => {
        this.stateService.unrecordBoss(boss);
      }
    );
  }

  processFoundKeyItem(
    type: string,
    loc: string,
    slot: number,
    keyItem: string
  ) {
    const found = this.state.key_items[keyItem];
    if (found === undefined) {
      this.stateService.recordKeyItem(keyItem, type, loc, slot);
    } else if (
      found.type === type &&
      found.location === loc &&
      found.slot === slot
    ) {
      this.stateService.unrecordKeyItem(keyItem);
    }
  }

  processBossKeyItem(loc: string, slot: number, keyItem: string) {
    this.processFoundKeyItem("boss", loc, slot, keyItem);
  }

  processTrappedKeyItem(loc: string, slot: number, keyItem: string) {
    this.processFoundKeyItem("trapped", loc, slot, keyItem);
  }

  processChestKeyItem(loc: string, slot: number, keyItem: string) {
    const found = this.state.key_items[keyItem];
    if (found === undefined) {
      this.stateService.recordKeyItem(keyItem, "trapped", loc, slot);
    } else if (
      found.type === "trapped" &&
      found.location === loc &&
      found.slot === slot
    ) {
      this.stateService.unrecordKeyItem(keyItem);
    }
  }

  recordTrappedChest(locId: string, chest: number, found: boolean) {
    this.stateService.recordTrappedChest(locId, chest, found);
  }

  getLocationState(location$: Observable<Location>): Observable<LocationState> {
    return combineLatest(this.locationState$, location$).pipe(
      map(r => {
        const states = r[0];
        const loc = r[1];

        const l: LocationState = {
          enabled: false,
          poi: [],
          trapped_chests: {}
        };
        if (states === undefined || loc === undefined) {
          return l;
        }

        return states[loc.id];
      })
    );
  }
}
