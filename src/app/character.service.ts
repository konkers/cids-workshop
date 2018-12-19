import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Character } from "./character.model";
import { Index, IndexedData } from "./indexed-data";
import { Found, StateService } from "./state.service";

export { Character } from "./character.model";
export { Found, FoundLocation } from "./state.service";

export type Characters = Index<Character>;

@Injectable({
  providedIn: "root"
})
export class CharacterService {
  private chars: IndexedData<Character>;

  constructor(private http: HttpClient, private stateService: StateService) {
    this.chars = <IndexedData<Character>>(
      new IndexedData(this.http, "./assets/data/chars.json")
    );
  }

  getCharacters(): Observable<Characters> {
    return this.chars.data$;
  }

  getCharacterOrder(): Observable<string[]> {
    return this.chars.order$;
  }

  getCharactersFound(): Observable<Found> {
    return this.stateService.getState().pipe(map(state => state.chars));
  }
}
