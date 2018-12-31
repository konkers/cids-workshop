export const STATE_VERSION = 3;

export interface ItemLocations {
  [index: string]: boolean;
}

export interface FoundItems {
  [index: number]: ItemLocations;
}

export interface FoundLocation {
  location: string;
  type?: string;
  slot: number;
}

export interface Found {
  [index: string]: FoundLocation;
}

export interface LocationFoundInfo {
  [index: number]: boolean;
}

export interface PoiState {
  char?: string;
}

export interface PoiStates {
  [index: number]: PoiState;
}

export interface LocationInfo {
  poi_states: PoiStates;

  // Set to true if a key item or boss slot yielded an
  // item instead of a key item.
  poi_found_item: LocationFoundInfo;

  // Set to true if a trapped chest slot yielded an
  // item instead of a key item.
  chest_found_item: LocationFoundInfo;
}

export interface LocationsInfo {
  [index: string]: LocationInfo;
}

export interface TrappedChestsLocation {
  [index: number]: boolean;
}

export interface TrappedChests {
  [index: string]: TrappedChestsLocation;
}

export interface State {
  version: number;

  // Map of found item id to map of location id to found.
  found_items: FoundItems;

  key_items: Found;
  bosses: Found;

  location_info: LocationsInfo;

  trapped_chests: TrappedChests;
}
