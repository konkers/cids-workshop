export const CONFIG_VERSION = 3;

export class Flags {
  Nc: boolean;
  Nk: boolean;
  Kq: boolean;
  Km: boolean;
  Kt: boolean;
}

export class Options {
  always_remove_key: boolean;
}

export class Config {
  version: number;
  // Items of interest.
  selected_items: number[];

  flags: Flags;

  options: Options;
}
