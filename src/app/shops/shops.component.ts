import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ItemRecord } from '../item.model';
import { ItemService } from '../item.service';
import { Location } from '../location.model';
import { LocationService } from '../location.service';

export interface DialogData {
  townIds: number[];
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})

export class ShopsComponent implements OnInit {

  @Input() record: ItemRecord;
  locs: Location[];

  constructor(public dialog: MatDialog, private locationService: LocationService,
    private itemService: ItemService) {
    this.locationService.getLocations().subscribe(locs => {
      this.locs = locs;
    });
  }

  ngOnInit() {
  }

  edit(event: any) {
    console.log(event);
    const pos = { top: `${event.clientY}px`, left: `${event.clientX}px` };
    console.log(pos);
    const dialogRef = this.dialog.open(ShopsDialogComponent, {
      position: pos,
      hasBackdrop: true,
      width: '250px',
      data: { townIds: this.record.town_ids }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result !== undefined) {
        this.record.town_ids = result;
        this.itemService.updateRecord(this.record.item_id, this.record.town_ids);
      }
    });
  }
}

@Component({
  selector: 'app-shops-dialog',
  templateUrl: './shops-dialog.component.html',
})
export class ShopsDialogComponent {

  locs: Location[];
  selected: boolean[];
  locsControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<ShopsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private locationService: LocationService) {

    this.locationService.getLocations().subscribe(locs => {
      this.selected = new Array(locs.length).fill(false);
      for (const i of this.data.townIds) {
        this.selected[i] = true;
      }

      this.locs = locs;
      this.locsControl.setValue(this.data.townIds);
    });

    this.locsControl.valueChanges
      .subscribe(locs => {
        data.townIds = locs;
      });
  }

  selectedIds(): number[] {
    if (this.selected === undefined) {
      return [];
    }
    const set = [];
    this.selected.forEach((s, i) => {
      if (s) {
        set.push(this.locs[i].id);
      }
    });
    return set;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
