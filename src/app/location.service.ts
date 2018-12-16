import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Location } from './location.model';

export { Location } from './location.model';

export interface Locations {
  [index: string]: Location;
}


@Injectable({ providedIn: 'root' })
export class LocationService {
  private locationsData: Locations;
  private _locations: BehaviorSubject<Locations>;
  locations: Observable<Locations>;

  constructor(private http: HttpClient) {
    this.locationsData = {};
    this._locations =
      <BehaviorSubject<Locations>>new BehaviorSubject(this.locationsData);
    this.locations = this._locations.asObservable();
    this.http.get<Location[]>('./assets/data/locations.json')
      .subscribe(l => {
        console.log(l),
        this._locations.next(l.reduce((locs, o) => {
          locs[o.id] = o;
          return locs;
        }, {}));
  });
}

  public getLocations(): Observable < Locations > {
  return this.locations;
}

  public getLocationOrder(): string[] {
  return [
    'baron',
    'mist',
    'kaipo',
    'toroia',
    'fabul',
    'silvera',
    'mysidia',
    'agart',
    'eblan-cave',
    'd-castle',
    'tomra',
    'feymarch',
    'kokkol',
    'hummingway',
  ];
}
}
