import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "kilo"
})
export class KiloPipe implements PipeTransform {
  transform(value: number): string {
    if (value > 1000) {
      value /= 1000.0;
      return String(value.toFixed(1)) + "K";
    } else {
      return String(value);
    }
  }
}
