import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-flag",
  templateUrl: "./flag.component.html",
  styleUrls: ["./flag.component.scss"]
})
export class FlagComponent implements OnInit {
  @Output() change = new EventEmitter<boolean>();
  @Input() enabled: boolean;
  @Input() flag: string;
  @Input() desc: string;

  constructor() {}

  ngOnInit() {}

  doChange(value: boolean) {
    this.change.emit(value);
  }
}
