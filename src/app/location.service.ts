import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Location } from './location.model';
import { State, StateService } from './state.service';

export { Location, LocationPoi } from './location.model';

export interface Locations {
  [index: string]: Location;
}


// These below are used to aggregate state by location instead of char,
// key item, boss, etc.
export interface PoiState {
  enabled: boolean;
  keyItem?: string;
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

  constructor(private http: HttpClient, private stateService: StateService) {
    this._locations =
      <BehaviorSubject<Locations>>new BehaviorSubject(undefined);
    this.locations = this._locations.asObservable();

    this._locationOrder =
      <BehaviorSubject<string[]>>new BehaviorSubject(undefined);
    this.locationOrder = this._locationOrder.asObservable();

    this.locationState$ =
      combineLatest(this.stateService.getState(), this.locations,
        (s, l) => this.processState(s, l));
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

  private processState(state: State, locationsData: Locations): LocationStates {
    const states: LocationStates = {};

    if (state === undefined || locationsData === undefined) {
      return states;
    }
    for (const locId of Object.keys(locationsData)) {
      const loc = locationsData[locId];
      const l: LocationState = { enabled: false, poi: [] };
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

  public processKeyItem(l: string, keyItem: string) {
    if (l === undefined) {
      return;
    }
    const loc = this.locationsData[l];

    // First check if they key item is already recorded.  If so, remove it.
    for (const p of Object.keys(loc.poi)) {
      const poi = loc.poi[p];
      const poiState = this.locationStateData[l].poi[p];
      if (poi.type === 'key' && poiState.keyItem === keyItem ) {
        this.stateService.unrecordKeyItem(keyItem, l, Number(p));
        return;
      }
    }

    // Not here, lets see if we have a free slot.
    for (const p of Object.keys(loc.poi)) {
      const poi = loc.poi[p];
      const poiState = this.locationStateData[l].poi[p];
      if (poi.type === 'key' && !('keyItem' in poiState)) {
        // recordKeyItem() will make sure the key item is not recorded
        // somewhere else.
        this.stateService.recordKeyItem(keyItem, l, Number(p));
        return;
      }
    }
  }

  getLocationState(location$: Observable<Location>): Observable<LocationState> {
    // TODO: rewrite this to use this.locationState$
    const state$ = this.stateService.getState();

    return combineLatest(this.locationState$, location$, (states, loc) => {

      const l: LocationState = { enabled: false, poi: [] };
      if (states === undefined || loc === undefined) {
        return l;
      }

      return states[loc.id];
    });
  }
}
