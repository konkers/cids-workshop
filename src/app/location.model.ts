
export interface LocationPoi {
    type: string;
    reqs?: string[];
}

export interface Location {
    id: string;
    name: string;
    type: string;
    map: string;
    poi?: LocationPoi[];
}
