import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

import { Location, LocationService, LocationState } from "../location.service";
import { ObservableData } from "../observable-data";

@Component({
  selector: "app-location-summary",
  templateUrl: "./location-summary.component.html",
  styleUrls: ["./location-summary.component.scss"]
})
export class LocationSummaryComponent implements OnInit {
  private _locId: ObservableData<string> = new ObservableData<string>(
    undefined
  );
  @Input() set locId(id: string) {
    this._locId.nextData(id);
  }
  @Input() selected: boolean;

  loc$: Observable<Location>;
  state$: Observable<LocationState>;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.loc$ = this.locationService.getLocation(this._locId.data$);
    this.state$ = this.locationService.getLocationState(this.loc$);
  }
}
