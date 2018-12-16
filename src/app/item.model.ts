import {Deserializable} from './deserializable.model';

export class Item implements Deserializable {
    id: number;
    name: string;
    price: number;
    icon: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class ItemRecord {
    item_id: number;
    town_ids: string[];
}
