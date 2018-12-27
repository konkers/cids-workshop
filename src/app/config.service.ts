import { Injectable, Inject } from "@angular/core";
import { SESSION_STORAGE, StorageService } from "angular-webstorage-service";
import { BehaviorSubject, Observable } from "rxjs";

import { Config, Flags, CONFIG_VERSION } from "./config.model";

export { Config, Flags } from "./config.model";

const STORAGE_KEY = "workshop.config";

@Injectable({ providedIn: "root" })
export class ConfigService {
  config$: Observable<Config>;
  private configData: Config;
  private _config: BehaviorSubject<Config>;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.configData = this.storage.get(STORAGE_KEY) || this.defaultConfig();
    if (this.configData.version !== CONFIG_VERSION) {
      this.configData = this.defaultConfig();
    }
    this._config = <BehaviorSubject<Config>>(
      new BehaviorSubject(this.configData)
    );
    this.config$ = this._config.asObservable();
  }

  private updateConfig() {
    const defaultConfig = this.defaultConfig();
    if (this.configData.version === 1) {
      this.configData.options = defaultConfig.options;
    } else if (this.configData.version === 2) {
      this.configData.flags.Kq = defaultConfig.flags.Kq;
      this.configData.flags.Km = defaultConfig.flags.Km;
      this.configData.flags.Kt = defaultConfig.flags.Kt;
    }
    this.configData.version = CONFIG_VERSION;
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

  updateFlags(flags: Flags) {
    this.configData.flags = flags;
    this.store();
  }

  defaultConfig(): Config {
    return {
      version: CONFIG_VERSION,
      selected_items: [],
      flags: { Nc: false, Nk: false, Kq: false, Km: false, Kt: false },
      options: {
        always_remove_key: true
      }
    };
  }
}
