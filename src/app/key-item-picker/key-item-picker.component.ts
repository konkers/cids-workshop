import { Component, OnInit, Input, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import {
  Location,
  Locations,
  LocationService,
  LocationState,
  PoiState
} from "../location.service";

@Component({
  selector: "app-key-item-picker-dialog",
  templateUrl: "./key-item-picker-dialog.component.html"
})
export class KeyItemPickerDialogComponent {
  constructor(public dialogRef: MatDialogRef<KeyItemPickerDialogComponent>) {}

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
  @Input() location: string;
  @Input() type: string;
  @Input() slot: number;

  state$: Observable<LocationState>;
  loc$: Observable<Location>;
  img$: Observable<string>;

  constructor(
    public dialog: MatDialog,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.loc$ = this.locationService.getLocation(this.location);
    this.state$ = this.locationService.getLocationState(this.loc$);
    this.img$ = this.state$.pipe(map(state => this.imgForState(state)));
  }

  private imgForState(state: LocationState): string {
    const poi: PoiState = state.poi[this.slot];
    if (poi && poi.bossKeyItem) {
      return "../assets/key-items/" + poi.bossKeyItem + ".png";
    } else if (poi && poi.foundItem) {
      return "../assets/key-items/chest.png";
    } else {
      return "../assets/empty/key.png";
    }
  }

  pick() {
    const dialogRef = this.dialog.open(KeyItemPickerDialogComponent, {
      // position: pos,
      hasBackdrop: true,
      width: "150px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.locationService.processBossKeyItem(this.location, this.slot, result);
    });
  }
}
