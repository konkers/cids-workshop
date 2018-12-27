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
  @Input() size?: string;

  loc: Location;
  poi: LocationPoi;
  enabled = false;
  keyItem: string;
  character: string;
  boss: string;
  foundItem: boolean;

  constructor(
    private locationService: LocationService,
    private stateService: StateService
  ) {
    if (this.size === undefined) {
      this.size = "small";
    }
  }

  ngOnInit() {
    this.locationService.getLocation(this.locId).subscribe(loc => {
      this.loc = loc;
      this.poi = loc.poi[this.poiIndex];
    });

    this.state$.subscribe(s => {
      if (this.locId === "feymarch" && this.poiIndex === 4) {
        console.log(s);
      }
      this.enabled = s.poi[this.poiIndex].enabled;
      this.keyItem = s.poi[this.poiIndex].keyItem;
      this.character = s.poi[this.poiIndex].character;
      this.boss = s.poi[this.poiIndex].boss;
      this.foundItem = s.poi[this.poiIndex].foundItem;
    });
  }

  private keyItemImg(): string {
    if (this.keyItem) {
      return "../assets/key-items/" + this.keyItem + ".png";
    } else if (this.foundItem) {
      return "../assets/key-items/chest.png";
    } else {
      return "../assets/empty/key.png";
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
    if (this.boss) {
      return "../assets/bosses/" + this.boss + ".png";
    } else {
      return "../assets/empty/boss.png";
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
