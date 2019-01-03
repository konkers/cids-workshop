import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

import { StateService } from "./state.service";
import { Locations, LocationState, LocationService } from "./location.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "tracker";

  private _keyItemEvents: BehaviorSubject<string>;
  keyItemEvents: Observable<string>;

  private _characterEvents: BehaviorSubject<string>;
  characterEvents: Observable<string>;

  private _bossEvents: BehaviorSubject<string>;
  bossEvents: Observable<string>;

  navTitle = "";
  locs: Locations;
  locRouteRe = RegExp("/loc/([^/]*)");
  pageNames = {
    "/items": "Items of Interest",
    "/flags": "Flags",
    "/help": "Help"
  };

  constructor(
    private router: Router,
    private locationService: LocationService,
    private stateService: StateService
  ) {
    this._keyItemEvents = <BehaviorSubject<string>>(
      new BehaviorSubject(undefined)
    );
    this.keyItemEvents = this._keyItemEvents.asObservable();

    this._characterEvents = <BehaviorSubject<string>>(
      new BehaviorSubject(undefined)
    );
    this.characterEvents = this._characterEvents.asObservable();

    this._bossEvents = <BehaviorSubject<string>>new BehaviorSubject(undefined);
    this.bossEvents = this._bossEvents.asObservable();
  }
  ngOnInit() {
    this.router.events.subscribe(res => {
      this.processRoute();
    });
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
      this.processRoute();
    });
  }

  private processLocationRoute(locId: string) {
    if (this.locs && locId in this.locs) {
      this.navTitle = this.locs[locId].name;
    }
  }
  private processRoute() {
    const url = this.router.url;
    const match = this.locRouteRe.exec(url);
    if (match) {
      this.processLocationRoute(match[1]);
      return;
    }

    if (url in this.pageNames) {
      this.navTitle = this.pageNames[url];
    } else {
      this.navTitle = "Cid's Workshop";
    }
  }

  goFlags() {
    this.router.navigate(["/flags"]);
  }

  goItems() {
    this.router.navigate(["/items"]);
  }

  goHelp() {
    this.router.navigate(["/help"]);
  }

  reset() {
    this.stateService.reset();
  }

  keyItemEvent(keyItem: string) {
    this._keyItemEvents.next(keyItem);
  }

  characterEvent(char: string) {
    this._characterEvents.next(char);
  }

  bossEvent(boss: string) {
    this._bossEvents.next(boss);
  }
}
