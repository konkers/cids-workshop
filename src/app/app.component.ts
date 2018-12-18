import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tracker';

  private _keyItemEvents: BehaviorSubject<string>;
  keyItemEvents: Observable<string>;

  constructor(private router: Router, private stateService: StateService) {
    this._keyItemEvents = <BehaviorSubject<string>>new BehaviorSubject(undefined);
    this.keyItemEvents = this._keyItemEvents.asObservable();
  }

  goItems() {
    this.router.navigate(['/items']);
  }

  reset() {
    this.stateService.reset();
  }

  keyItemEvent(keyItem: string) {
    this._keyItemEvents.next(keyItem);
  }
}
