import { Component, OnInit, Input } from '@angular/core';
import { Boss } from '../boss.service';
import { FoundLocation } from '../state.service';

@Component({
  selector: 'app-boss',
  templateUrl: './boss.component.html',
  styleUrls: ['./boss.component.scss']
})
export class BossComponent implements OnInit {
  @Input() boss: Boss;
  @Input() state: FoundLocation;

  constructor() { }

  ngOnInit() {
  }

}
