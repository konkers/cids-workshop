import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tracker';

  constructor(private router: Router, private stateService: StateService) {
  }

  goItems() {
    this.router.navigate(['/items']);
  }

  reset() {
    this.stateService.reset();
  }

}
