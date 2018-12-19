import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import {
  Location,
  Locations,
  LocationService,
  LocationState
} from "../location.service";
import { ItemComponent } from "../item/item.component";

@Component({
  selector: "app-location-detail",
  templateUrl: "./location-detail.component.html",
  styleUrls: ["./location-detail.component.scss"]
})
export class LocationDetailComponent implements OnInit {
  locs: Locations;
  loc: Location;
  locId: string;
  state$: Observable<LocationState>;
  loc$: Observable<Location>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService
  ) {
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
      this.updateLoc();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(m => {
      this.locId = m.get("loc");
      this.updateLoc();
    });
  }

  private updateLoc() {
    if (this.locs === undefined) {
      return;
    }
    if (this.locId in this.locs) {
      this.loc = this.locs[this.locId];
      this.loc$ = this.locationService.getLocation(this.locId);
      this.state$ = this.locationService.getLocationState(this.loc$);
    }
  }

  hasShops(): boolean {
    return (
      this.hasPoi("item-shop") ||
      this.hasPoi("weapon-shop") ||
      this.hasPoi("armor-shop")
    );
  }

  hasTrappedChests(): boolean {
    return this.loc && "trapped_chests" in this.loc;
  }

  doTrappedChest(chest: number, found: boolean) {
    this.locationService.recordTrappedChest(this.locId, chest, found);
  }

  gotoItemList() {
    this.router.navigate(["/items"]);
  }

  hasPoi(poi: string): boolean {
    if (this.loc === undefined || this.loc.poi === undefined) {
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
