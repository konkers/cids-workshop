import {Injectable, Inject} from '@angular/core';
import {SESSION_STORAGE, StorageService} from 'angular-webstorage-service';
import {BehaviorSubject, Observable} from 'rxjs';

import {Config, CONFIG_VERSION} from './config.model';

const STORAGE_KEY = 'workshop.config';

@Injectable({providedIn: 'root'})
export class ConfigService {
  config$: Observable<Config>;
  private configData: Config;
  private _config: BehaviorSubject<Config>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.configData = this.storage.get(STORAGE_KEY) || {
      version: CONFIG_VERSION,
      selected_items: [],
    };
    this._config =
        <BehaviorSubject<Config>>new BehaviorSubject(this.configData);
    this.config$ = this._config.asObservable();
  }

  getConfig() {
    return this.config$;
  }

  private store() {
    this._config.next(this.configData);
    this.storage.set(STORAGE_KEY, this.configData);
  }

  updateSelectedItems(selectedItems: number[]) {
    this.configData.selected_items = selectedItems;
    this.store();
  }
}
