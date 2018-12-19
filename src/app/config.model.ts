export const CONFIG_VERSION = 1;

export class Flags {
  Nc: boolean;
  Nk: boolean;
}

export class Config {
  version: number;
  // Items of interest.
  selected_items: number[];

  flags: Flags;
}
