import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Locations, LocationService } from '../location.service';

@Component({
  selector: 'app-location-tracker',
  templateUrl: './location-tracker.component.html',
  styleUrls: ['./location-tracker.component.scss']
})
export class LocationTrackerComponent implements OnInit {

  locs: Locations;
  locOrder: string[];

  constructor(private router: Router, private locationService: LocationService) {
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
    });
    this.locOrder = this.locationService.getLocationOrder();
  }

  ngOnInit() {
  }

  shop(loc: string, type: string) {
    this.router.navigate(['/shop', loc, type]);
  }

  gotoLoc(loc: string) {
    this.router.navigate(['/loc', loc]);
  }

}
