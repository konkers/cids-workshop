import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Boss } from './boss.model';
import { Index, IndexedData } from './indexed-data';
import { Found, StateService } from './state.service';

export { Boss } from './boss.model';
export { Found, FoundLocation } from './state.service';

export type Bosses = Index<Boss>;

@Injectable({
  providedIn: 'root'
})
export class BossService {
  private bosses: IndexedData<Boss>;

  constructor(private http: HttpClient, private stateService: StateService) {
    this.bosses = <IndexedData<Boss>>new IndexedData(this.http, './assets/data/bosses.json');
  }

  getBosses(): Observable<Bosses> {
    return this.bosses.data$;
  }

  getBossOrder(): Observable<string[]> {
    return this.bosses.order$;
  }

  getBossesFound(): Observable<Found> {
    return this.stateService.getState().pipe(
      map(state => state.bosses
      ));
  }
}
