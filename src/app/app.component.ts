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

  private _characterEvents: BehaviorSubject<string>;
  characterEvents: Observable<string>;

  constructor(private router: Router, private stateService: StateService) {
    this._keyItemEvents = <BehaviorSubject<string>>new BehaviorSubject(undefined);
    this.keyItemEvents = this._keyItemEvents.asObservable();

    this._characterEvents = <BehaviorSubject<string>>new BehaviorSubject(undefined);
    this.characterEvents = this._characterEvents.asObservable();
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

  characterEvent(char: string) {
    console.log(char);
    this._characterEvents.next(char);
  }
}
