import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Location, LocationService } from '../location.service';
import { LocationState, StateService } from '../state.service';

@Component({
  selector: 'app-location-summary',
  templateUrl: './location-summary.component.html',
  styleUrls: ['./location-summary.component.scss']
})
export class LocationSummaryComponent implements OnInit {

  @Input() locId: string;

  loc$: Observable<Location>;
  state$: Observable<LocationState>;

  constructor(private locationService: LocationService, private stateService: StateService) {
  }

  ngOnInit() {
    this.loc$ = this.locationService.getLocation(this.locId);
    this.state$ = this.stateService.getLocationState(this.loc$);
  }

}
