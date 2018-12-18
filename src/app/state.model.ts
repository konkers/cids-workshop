export const STATE_VERSION = 0;

export interface ItemLocations {
    [index: string]: boolean;
}

export interface FoundItems {
    [index: number]: ItemLocations;
}

export interface FoundLocation {
    location: string;
    slot: number;
}

export interface Found {
    [index: string]: FoundLocation;
}

export interface State {
    version: number;

    // Map of found item id to map of location id to found.
    found_items: FoundItems;

    key_items: Found;
    chars: Found;
    bosses: Found;
}
