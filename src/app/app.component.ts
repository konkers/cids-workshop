import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tracker';

  constructor(private router: Router) {
  }

  goItems(loc: string, type: string) {
    this.router.navigate(['/items']);
  }

}
