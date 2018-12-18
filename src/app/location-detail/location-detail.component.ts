import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location, Locations, LocationService } from '../location.service';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {
  locs: Locations;
  loc: Location;
  locId: string;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private locationService: LocationService) {
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
      this.updateLoc();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(m => {
      this.locId = m.get('loc');
      this.updateLoc();
    });
  }

  private updateLoc() {
    if (this.locs === undefined) {
      return;
    }
    if (this.locId in this.locs) {
      this.loc = this.locs[this.locId];
    }
  }

  hasShops(): boolean {
    return this.hasPoi('item-shop') ||
      this.hasPoi('weapon-shop') ||
      this.hasPoi('armor-shop');
  }

  hasPoi(poi: string): boolean {
    if (this.loc === undefined) {
      return false;
    }
    for (const p of this.loc.poi) {
      if (p.type === poi) {
        return true;
      }
    }
    return false;
  }
}
