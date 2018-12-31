import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Character } from "./character.model";
import { Index, IndexedData } from "./indexed-data";
import { CharactersFoundState, StateService } from "./state.service";

export { Character } from "./character.model";
export { Found, FoundLocation, CharactersFoundState } from "./state.service";

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

  getCharactersFound(): Observable<CharactersFoundState> {
    return this.stateService.getCharactersFound();
  }
}
