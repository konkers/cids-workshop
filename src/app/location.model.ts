export interface LocationPoi {
  type: string;
  reqs?: string[];
  flags?: string[];
}

export interface Location {
  id: string;
  name: string;
  type: string;
  map: string;
  poi?: LocationPoi[];
  trapped_chests?: string[];
}
