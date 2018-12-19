import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

import { Location, LocationService, LocationState } from "../location.service";

@Component({
  selector: "app-location-summary",
  templateUrl: "./location-summary.component.html",
  styleUrls: ["./location-summary.component.scss"]
})
export class LocationSummaryComponent implements OnInit {
  @Input() locId: string;
  @Input() selected: boolean;

  loc$: Observable<Location>;
  state$: Observable<LocationState>;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.loc$ = this.locationService.getLocation(this.locId);
    this.state$ = this.locationService.getLocationState(this.loc$);
  }
}
