import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { Locations, LocationState, LocationService } from "../location.service";

@Component({
  selector: "app-location-tracker",
  templateUrl: "./location-tracker.component.html",
  styleUrls: ["./location-tracker.component.scss"]
})
export class LocationTrackerComponent implements OnInit {
  @Input() keyItemEvents: Observable<string>;
  @Input() characterEvents: Observable<string>;
  @Input() bossEvents: Observable<string>;

  locs: Locations;
  locOrder: string[];
  locRouteRe = RegExp("/loc/([^/]*)");
  selectedLoc: string;
  locState: LocationState;

  constructor(
    private router: Router,
    private locationService: LocationService
  ) {
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
    });
    this.locationService.getLocationOrder().subscribe(order => {
      this.locOrder = order;
    });
  }

  ngOnInit() {
    this.router.events.subscribe(res => {
      const match = this.locRouteRe.exec(this.router.url);
      if (match) {
        this.selectedLoc = match[1];
      }
    });
    this.keyItemEvents.subscribe(ki => {
      this.handleKeyItem(ki);
    });
    this.characterEvents.subscribe(c => {
      this.handleCharacter(c);
    });
    this.bossEvents.subscribe(b => {
      this.handleBoss(b);
    });
  }

  handleKeyItem(keyItem: string) {
    this.locationService.processKeyItem(this.selectedLoc, keyItem);
  }

  handleCharacter(char: string) {
    this.locationService.processChar(this.selectedLoc, char);
  }

  handleBoss(boss: string) {
    this.locationService.processBoss(this.selectedLoc, boss);
  }

  shop(loc: string, type: string) {
    this.router.navigate(["/shop", loc, type]);
  }

  gotoLoc(loc: string) {
    this.router.navigate(["/loc", loc]);
  }
}
