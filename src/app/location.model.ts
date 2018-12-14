import {Deserializable} from './deserializable.model';

export class Location implements Deserializable {
    id: number;
    name: string;
    type: string;
    map: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
