import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config, Flags, ConfigService } from '../config.service';

@Component({
  selector: 'app-flags',
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss']
})
export class FlagsComponent implements OnInit {
  private flags: Flags;


  constructor(private configService: ConfigService) {
    this.configService.getConfig().subscribe( c => {
      this.flags = c.flags;
    }
    );
  }

  ngOnInit() {
  }

change(flag: string, value: any) {
    if (!(flag in this.flags)) {
      console.log(`No flag ${flag} in flags object.`);
      return;
    }
    this.flags[flag] = value;
    this.configService.updateFlags(this.flags);
  }
}
