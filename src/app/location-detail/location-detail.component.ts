import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import {
  Location,
  Locations,
  LocationBossStats,
  LocationService,
  LocationState,
  PoiState
} from "../location.service";
import { Config, ConfigService } from "../config.service";

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
  config$: Observable<Config>;

  hasBossKeyItems$: Observable<boolean>;
  bossPoi$: Observable<number[]>;
  keyItemImgs$: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private configService: ConfigService
  ) {
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
      this.updateLoc();
    });
    this.config$ = this.configService.getConfig();
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

      this.hasBossKeyItems$ = this.state$.pipe(
        map(state => {
          let enabled = false;
          for (const poi of Object.values(state.poi)) {
            enabled = enabled || poi.hasKeyItem;
          }
          return enabled;
        })
      );

      this.keyItemImgs$ = this.state$.pipe(
        map(state => this.keyItemImgsForState(state))
      );
      this.bossPoi$ = combineLatest(this.loc$, this.state$).pipe(
        map(results => this.processBossPoi(results[0], results[1]))
      );
    }
  }

  private keyItemImgsForState(state: LocationState): string[] {
    const imgs = [];

    for (const p of Object.keys(state.poi)) {
      const poi: PoiState = state.poi[p];
      if (poi.bossKeyItem) {
        imgs[p] = "../assets/key-items/" + poi.bossKeyItem + ".png";
      } else {
        imgs[p] = "../assets/empty/key.png";
      }
    }
    return imgs;
  }

  private processBossPoi(loc: Location, state: LocationState): number[] {
    if (!loc || !state) {
      return [];
    }
    const poisDisplayed: number[] = [];
    for (let i = 0; i < loc.poi.length; i++) {
      if (state.poi[i].visible && loc.poi[i].type === "boss") {
        poisDisplayed.push(i);
      }
    }
    return poisDisplayed;
  }

  statToolTip(
    stats: LocationBossStats,
    stat: string,
    mult: string,
    rate: string
  ): string {
    return `${stats[stat]} x${stats[mult]} ${stats[rate]}%`;
  }

  normalizedStat(
    stats: LocationBossStats,
    stat: string,
    mult: string,
    rate: string
  ): number {
    return (stats[stat] * stats[mult] * stats[rate]) / 100;
  }

  hasShops(): boolean {
    return (
      this.hasPoi("item-shop") ||
      this.hasPoi("weapon-shop") ||
      this.hasPoi("armor-shop")
    );
  }

  hasBosses(): boolean {
    return this.hasPoi("boss");
  }

  hasTrappedChests(): boolean {
    return this.loc && "trapped_chests" in this.loc;
  }

  doTrappedChest(chest: number, found: boolean) {
    console.log(found);
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
