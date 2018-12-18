import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Location, LocationPoi, LocationState, LocationService } from '../location.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnInit {

  @Input() locId: string;
  @Input() poiIndex: number;
  @Input() state$: Observable<LocationState>;

  loc: Location;
  poi: LocationPoi;
  enabled = false;
  keyItem: string;

  constructor(private locationService: LocationService, private stateService: StateService) { }

  ngOnInit() {
    this.locationService.getLocation(this.locId).subscribe(loc => {
      this.loc = loc;
      this.poi = loc.poi[this.poiIndex];
    });

    this.state$.subscribe(s => {
      this.enabled = s.poi[this.poiIndex].enabled;
      this.keyItem = s.poi[this.poiIndex].keyItem;
    });
  }

  private keyItemImg(): string {
    if (this.keyItem === undefined) {
      return '../assets/empty/key.png';
    } else {
      return '../assets/key-items/' + this.keyItem + '.png';
    }
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
        return this.keyItemImg();
      case 'boss':
        return '../assets/empty/boss.png';
      default:
        return '';
    }
  }

}
