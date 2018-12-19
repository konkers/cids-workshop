import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";

import { Found, Characters, CharacterService } from "../character.service";

@Component({
  selector: "app-character-tracker",
  templateUrl: "./character-tracker.component.html",
  styleUrls: ["./character-tracker.component.scss"]
})
export class CharacterTrackerComponent implements OnInit {
  @Output() select = new EventEmitter<string>();

  chars$: Observable<Characters>;
  charOrder$: Observable<string[]>;
  charsFound$: Observable<Found>;

  constructor(private characterService: CharacterService) {
    this.chars$ = this.characterService.getCharacters();
    this.charOrder$ = this.characterService.getCharacterOrder();
    this.charsFound$ = this.characterService.getCharactersFound();
  }

  ngOnInit() {}

  selectCharacter(char: string) {
    this.select.emit(char);
  }
}
