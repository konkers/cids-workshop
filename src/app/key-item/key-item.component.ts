import { Component, OnInit, Input } from '@angular/core';

import { KeyItem, FoundLocation } from '../key-item.service';

@Component({
  selector: 'app-key-item',
  templateUrl: './key-item.component.html',
  styleUrls: ['./key-item.component.scss']
})
export class KeyItemComponent implements OnInit {

  @Input() keyItem: KeyItem;
  @Input() state: FoundLocation;

  constructor() { }

  ngOnInit() {
  }

}
