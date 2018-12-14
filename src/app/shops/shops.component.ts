import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ItemService, FoundItems, ItemLocations } from '../item.service';
import { Locations, LocationService } from '../location.service';

export interface DialogData {
  found: ItemLocations;
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})

export class ShopsComponent implements OnInit {

  @Input() itemId: number;
  found: ItemLocations;
  locs: Locations;

  constructor(public dialog: MatDialog, private locationService: LocationService,
    private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getFoundItems().subscribe(f => {
      this.found = f[this.itemId] || {};
    });
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
    });
  }

  edit(event: any) {
    // const pos = { top: `${event.clientY}px`, left: `${event.clientX}px` };
    const dialogRef = this.dialog.open(ShopsDialogComponent, {
      // position: pos,
      hasBackdrop: true,
      width: '250px',
      data: { found: this.found }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.itemService.updateFoundItems(this.itemId, result);
      }
    });
  }
}

@Component({
  selector: 'app-shops-dialog',
  templateUrl: './shops-dialog.component.html',
})
export class ShopsDialogComponent {

  locs: Locations;
  selected: ItemLocations;
  locOrder: string[];

  constructor(
    public dialogRef: MatDialogRef<ShopsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private locationService: LocationService) {

    this.locOrder = this.locationService.getLocationOrder();
    this.locationService.getLocations().subscribe(locs => {
      this.selected = this.data.found;

      this.locs = locs;
    });
  }

  selectedIds(): ItemLocations {
    if (this.selected === undefined) {
      return {};
    }
    const selected: ItemLocations = {};
    for (let id in this.selected) {
      if (this.selected[id]) {
        selected[id] = true;
      }
    }
    return selected;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
