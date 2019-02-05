import { BehaviorSubject, Observable, combineLatest } from "rxjs";

export class ObservableData<T> {
  data: T;
  private _data: BehaviorSubject<T>;
  data$: Observable<T>;

  constructor(initialData: T) {
    this.data = initialData;
    this._data = <BehaviorSubject<T>>new BehaviorSubject(this.data);
    this.data$ = this._data.asObservable();
  }

  nextData(data: T) {
    this.data = data;
    this.next();
  }

  next() {
    this._data.next(this.data);
  }
}
