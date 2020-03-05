import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "toDecimalPipe"
})
export class ToDecimalPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let retNumber = parseFloat(parseFloat(value.replace(/,/g, "")).toFixed(2));
    console.log(retNumber);
    return isNaN(retNumber) ? 0 : retNumber;
  }
}
