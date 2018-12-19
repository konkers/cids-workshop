import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Found, Bosses, BossService } from '../boss.service';

@Component({
  selector: 'app-boss-tracker',
  templateUrl: './boss-tracker.component.html',
  styleUrls: ['./boss-tracker.component.scss']
})
export class BossTrackerComponent implements OnInit {
  @Output() select = new EventEmitter<string>();

  bosses$: Observable<Bosses>;
  bossOrder$: Observable<string[]>;
  bossesFound$: Observable<Found>;

  constructor(private bossService: BossService) {
    this.bosses$ = this.bossService.getBosses();
    this.bossOrder$ = this.bossService.getBossOrder();
    this.bossesFound$ = this.bossService.getBossesFound();
  }

  ngOnInit() {
  }

  selectBoss(boss: string) {
    this.select.emit(boss);
  }
}
