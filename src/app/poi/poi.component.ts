import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Location, LocationPoi, LocationService } from '../location.service';
import { State, StateService, LocationState, PoiState } from '../state.service';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnInit {

  @Input() locId: string;
  @Input() poiIndex: number;
  @Input() state$: Observable<PoiState>;

  loc: Location;
  poi: LocationPoi;
  enabled: boolean;
  locationState$: Observable<LocationState>;

  constructor(private locationService: LocationService, private stateService: StateService) { }

  ngOnInit() {
    this.locationService.getLocation(this.locId).subscribe(loc => {
      this.loc = loc;
      this.poi = loc.poi[this.poiIndex];
    });
  }


  img(): string {
    switch (this.poi.type) {
      case 'item-shop':
        return '../assets/icon/potion.png';
      case 'weapon-shop':
        return '../assets/icon/sword.png';
      case 'armor-shop':
        return '../assets/icon/shield.png';
      case 'char':
        return '../assets/empty/char.png';
      case 'key':
        return '../assets/empty/key.png';
      case 'boss':
        return '../assets/icon/potion.png';
      default:
        return '';
    }
  }

}
