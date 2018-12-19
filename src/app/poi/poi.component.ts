import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

import {
  Location,
  LocationPoi,
  LocationState,
  LocationService
} from "../location.service";
import { StateService } from "../state.service";

@Component({
  selector: "app-poi",
  templateUrl: "./poi.component.html",
  styleUrls: ["./poi.component.scss"]
})
export class PoiComponent implements OnInit {
  @Input() locId: string;
  @Input() poiIndex: number;
  @Input() state$: Observable<LocationState>;

  loc: Location;
  poi: LocationPoi;
  enabled = false;
  keyItem: string;
  character: string;
  boss: string;

  constructor(
    private locationService: LocationService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.locationService.getLocation(this.locId).subscribe(loc => {
      this.loc = loc;
      this.poi = loc.poi[this.poiIndex];
    });

    this.state$.subscribe(s => {
      this.enabled = s.poi[this.poiIndex].enabled;
      this.keyItem = s.poi[this.poiIndex].keyItem;
      this.character = s.poi[this.poiIndex].character;
      this.boss = s.poi[this.poiIndex].boss;
    });
  }

  private keyItemImg(): string {
    if (this.keyItem === undefined) {
      return "../assets/empty/key.png";
    } else {
      return "../assets/key-items/" + this.keyItem + ".png";
    }
  }

  private charImg(): string {
    if (this.character === undefined) {
      return "../assets/empty/char.png";
    } else {
      return "../assets/characters/" + this.character + ".png";
    }
  }

  private bossImg(): string {
    if (this.boss === undefined) {
      return "../assets/empty/boss.png";
    } else {
      return "../assets/bosses/" + this.boss + ".png";
    }
  }

  img(): string {
    switch (this.poi.type) {
      case "item-shop":
        return "../assets/icon/potion.png";
      case "weapon-shop":
        return "../assets/icon/sword.png";
      case "armor-shop":
        return "../assets/icon/shield.png";
      case "char":
        return this.charImg();
      case "key":
        return this.keyItemImg();
      case "boss":
        return this.bossImg();
      default:
        return "";
    }
  }
}
