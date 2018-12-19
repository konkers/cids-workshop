import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";

export interface Indexable {
  id: string;
}

export interface Index<T> {
  [index: string]: T;
}

export class IndexedData<T extends Indexable> {
  private data: Index<T>;
  private _data: BehaviorSubject<Index<T>>;
  data$: Observable<Index<T>>;

  private order: string[];
  private _order: BehaviorSubject<string[]>;
  order$: Observable<string[]>;

  constructor(http: HttpClient, path: string) {
    this._data = <BehaviorSubject<Index<T>>>new BehaviorSubject(undefined);
    this.data$ = this._data.asObservable();

    this._order = <BehaviorSubject<string[]>>new BehaviorSubject(undefined);
    this.order$ = this._order.asObservable();

    http.get<T[]>(path).subscribe(d => {
      this.order = d.map(a => a.id);
      this._order.next(this.order);

      this.data = d.reduce((index, o) => {
        index[o.id] = o;
        return index;
      }, {});

      this._data.next(this.data);
    });
  }
}
