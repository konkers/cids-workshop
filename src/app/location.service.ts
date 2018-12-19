import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Location } from './location.model';
import { State, StateService } from './state.service';
import { Config, ConfigService } from './config.service';

export { Location, LocationPoi } from './location.model';

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

@Injectable({ providedIn: 'root' })
export class LocationService {
  private locationsData: Locations;
  private _locations: BehaviorSubject<Locations>;
  locations: Observable<Locations>;

  private locationOrderData: string[];
  private _locationOrder: BehaviorSubject<string[]>;
  locationOrder: Observable<string[]>;

  locationState$: Observable<LocationStates>;
  private locationStateData: LocationStates;

  constructor(private http: HttpClient, private configService: ConfigService, private stateService: StateService) {
    this._locations =
      <BehaviorSubject<Locations>>new BehaviorSubject(undefined);
    this.locations = this._locations.asObservable();

    this._locationOrder =
      <BehaviorSubject<string[]>>new BehaviorSubject(undefined);
    this.locationOrder = this._locationOrder.asObservable();

    this.locationState$ =
      combineLatest(this.stateService.getState(), this.configService.getConfig(), this.locations)
      .pipe(
        map(results => this.processState(results[0], results[1], results[2]))
        );
    this.locationState$.subscribe(s => { this.locationStateData = s; });

    this.http.get<Location[]>('./assets/data/locations.json')
      .subscribe(l => {
        this.locationOrderData = l.map(a => a.id);
        this._locationOrder.next(this.locationOrderData);

        this.locationsData = l.reduce((locs, o) => {
          locs[o.id] = o;
          return locs;
        }, {});

        this._locations.next(this.locationsData);
      });


  }

  // This is a big horrible function that is begging to be refactored.
  private processState(state: State, config: Config, locationsData: Locations): LocationStates {
    const states: LocationStates = {};

    if (state === undefined || config === undefined || locationsData === undefined) {
      return states;
    }
    for (const locId of Object.keys(locationsData)) {
      const loc = locationsData[locId];
      const l: LocationState = { enabled: false, poi: [] };

      for (const p of Object.keys(loc.poi)) {
        const poi = loc.poi[p];
        const ps: PoiState = {
          enabled: true,
          visible: true,
        };

        // Scan through any reqs to see if the poi is enabled.
        if ('reqs' in poi) {
          for (const req of poi.reqs) {
            if (!(req in state.key_items)) {
              ps.enabled = false;
            }
          }
        }

        // If any of the pois are enabled,  The location stays enabled.
        if (ps.enabled) {
          l.enabled = true;
        }

        // Evaluate flags for poi visibility.
        if ('flags' in poi) {
          let visible = false;
          for (let flag of poi.flags) {
            let invert = false;
            if (flag.substring(0, 1) === '!') {
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
            ps.visible = visible;
          }
        }


        l.poi[p] = ps;
      }
      states[locId] = l;
    }

    for (const id of Object.keys(state.key_items)) {
      const k = state.key_items[id];
      if (k.location === 'virt') {
        continue;
      }
      states[k.location].poi[k.slot].keyItem = id;
    }

    for (const id of Object.keys(state.chars)) {
      const k = state.chars[id];
      if (k.location === 'virt') {
        continue;
      }
      states[k.location].poi[k.slot].character = id;
    }

    for (const id of Object.keys(state.bosses)) {
      const k = state.bosses[id];
      if (k.location === 'virt') {
        continue;
      }
      states[k.location].poi[k.slot].boss = id;
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
    return this.getLocations().pipe(
      map(locs => locs[id]
      ));
  }

  private processPoi(poiType: string, poiKey: string, l: string, poiId: string,
    addFunc: (slot: number) => void, deleteFunc: (slot: number) => void) {
    if (l === undefined) {
      return;
    }
    const loc = this.locationsData[l];

    // First check if poi is already recorded.  If so, remove it.
    for (const p of Object.keys(loc.poi)) {
      const poi = loc.poi[p];
      const poiState = this.locationStateData[l].poi[p];
      if (poi.type === poiType && poiState[poiKey] === poiId) {
        deleteFunc(Number(p));
        return;
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
    this.processPoi('key', 'keyItem', loc, keyItem,
      (slot) => { this.stateService.recordKeyItem(keyItem, loc, slot); },
      (slot) => { this.stateService.unrecordKeyItem(keyItem, loc, slot); }
    );
  }

  processChar(loc: string, char: string) {
    this.processPoi('char', 'character', loc, char,
      (slot) => { this.stateService.recordCharacter(char, loc, slot); },
      (slot) => { this.stateService.unrecordCharacter(char, loc, slot); }
    );
  }

  processBoss(loc: string, boss: string) {
    this.processPoi('boss', 'boss', loc, boss,
      (slot) => { this.stateService.recordBoss(boss, loc, slot); },
      (slot) => { this.stateService.unrecordBoss(boss, loc, slot); }
    );
  }

  getLocationState(location$: Observable<Location>): Observable<LocationState> {
    // TODO: rewrite this to use this.locationState$
    const state$ = this.stateService.getState();

    return combineLatest(this.locationState$, location$).pipe(
      map(r => {
        const states = r[0];
        const loc = r[1];

      const l: LocationState = { enabled: false, poi: [] };
      if (states === undefined || loc === undefined) {
        return l;
      }

      return states[loc.id];
    }));
  }
}
