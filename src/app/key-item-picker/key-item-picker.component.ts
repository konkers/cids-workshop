import { Component, OnInit, Input, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { ObservableData } from "../observable-data";

import {
  Location,
  Locations,
  LocationService,
  LocationState,
  PoiState,
  TrappedChestState
} from "../location.service";

@Component({
  selector: "app-key-item-picker-dialog",
  templateUrl: "./key-item-picker-dialog.component.html"
})
export class KeyItemPickerDialogComponent {
  constructor(public dialogRef: MatDialogRef<KeyItemPickerDialogComponent>) {}
  G;
  keyItemEvent(keyItem: string) {
    this.dialogRef.close(keyItem);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-key-item-picker",
  templateUrl: "./key-item-picker.component.html",
  styleUrls: ["./key-item-picker.component.scss"]
})
export class KeyItemPickerComponent implements OnInit {
  @Input() locId$: Observable<string>;
  @Input() type: string;
  @Input() slot: number;

  locId: string;
  state$: Observable<LocationState>;
  loc$: Observable<Location>;
  img$: Observable<string>;

  constructor(
    public dialog: MatDialog,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.loc$ = this.locationService.getLocation(this.locId$);
    this.state$ = this.locationService.getLocationState(this.loc$);
    this.img$ = this.state$.pipe(map(state => this.imgForState(state)));
    this.locId$.subscribe(id => {
      this.locId = id;
    });
  }

  private imgForBossState(state: LocationState): string {
    const poi: PoiState = state.poi[this.slot];
    if (poi && poi.bossKeyItem) {
      return "../assets/key-items/" + poi.bossKeyItem + ".png";
    } else if (poi && poi.foundItem) {
      return "../assets/key-items/chest.png";
    } else {
      return "../assets/empty/key.png";
    }
  }
  private imgForTrappedState(state: LocationState): string {
    const trapped: TrappedChestState = state.trapped_chests[this.slot];
    if (trapped && trapped.keyItem) {
      return "../assets/key-items/" + trapped.keyItem + ".png";
    } else if (trapped && trapped.foundItem) {
      return "../assets/key-items/chest.png";
    } else {
      return "../assets/empty/key.png";
    }
  }
  private imgForState(state: LocationState): string {
    switch (this.type) {
      case "boss":
        return this.imgForBossState(state);
      case "trapped":
        return this.imgForTrappedState(state);
    }
  }

  pick() {
    const dialogRef = this.dialog.open(KeyItemPickerDialogComponent, {
      // position: pos,
      hasBackdrop: true,
      width: "150px"
    });

    dialogRef.afterClosed().subscribe(result => {
      switch (this.type) {
        case "boss":
          this.locationService.processBossKeyItem(
            this.locId,
            this.slot,
            result
          );
          break;
        case "trapped":
          this.locationService.processTrappedKeyItem(
            this.locId,
            this.slot,
            result
          );

          break;
      }
    });
  }
}
