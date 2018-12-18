import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Location } from './location.model';

export { Location, LocationPoi } from './location.model';

export interface Locations {
  [index: string]: Location;
}


@Injectable({ providedIn: 'root' })
export class LocationService {
  private locationsData: Locations;
  private _locations: BehaviorSubject<Locations>;
  locations: Observable<Locations>;

  private locationOrderData: string[];
  private _locationOrder: BehaviorSubject<string[]>;
  locationOrder: Observable<string[]>;

  constructor(private http: HttpClient) {
    this.locationsData = {};
    this._locations =
      <BehaviorSubject<Locations>>new BehaviorSubject(this.locationsData);
    this.locations = this._locations.asObservable();

    this.locationOrderData = [];
    this._locationOrder =
      <BehaviorSubject<string[]>>new BehaviorSubject(this.locationOrderData);
    this.locationOrder = this._locationOrder.asObservable();

    this.http.get<Location[]>('./assets/data/locations.json')
      .subscribe(l => {
        this.locationOrderData = l.map(a => a.id);
        this._locationOrder.next(this.locationOrderData);

        this._locations.next(l.reduce((locs, o) => {
          locs[o.id] = o;
          return locs;
        }, {}));
      });
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
}
