export const CONFIG_VERSION = 2;

export class Flags {
  Nc: boolean;
  Nk: boolean;
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
