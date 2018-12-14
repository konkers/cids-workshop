import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import {Location} from './location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  locations: Observable<Location[]>;

  constructor(private http: HttpClient) {
    this.locations = this.http.get<Location[]>('./assets/data/locations.json');
  }

  public getLocations(): Observable<Location[]> {
    return this.locations;
  }
}

