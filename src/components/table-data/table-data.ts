import { Component, OnChanges, Input } from '@angular/core';

/**
 * Generated class for the TableDataComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-table-data',
  templateUrl: 'table-data.html'
})
export class TableDataComponent implements OnChanges {

  /* Data of charts */
  _data: any;
  @Input()
  data: any;
  
  /* Name of charts */
  _name: string;
  @Input()
  name: string;

  /* Symbol of charts */
  _symbol: string;
  @Input()
  symbol: string;

  constructor() {
    console.log('Hello TableDataComponent Component');
  }

  ngOnChanges(changes: any) {
    if (changes && changes.data && changes.data.currentValue != undefined) {
      this._data = this.data;
    }

    if (changes && changes.symbol && changes.symbol.currentValue != undefined) {
        this._symbol = this.symbol;
    }

    if (changes && changes.name && changes.name.currentValue != undefined) {
        this._name = this.name;
    }
  }
}
