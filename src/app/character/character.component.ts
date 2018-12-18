import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../character.service';
import { FoundLocation } from '../state.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  @Input() char: Character;
  @Input() state: FoundLocation;

  constructor() { }

  ngOnInit() {
  }

}
