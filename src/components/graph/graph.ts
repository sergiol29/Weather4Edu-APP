import { Component, Input, OnChanges } from '@angular/core';

/* Import HighCharts */
import * as HighCharts from 'highcharts';

/**
 * Generated class for the GraphComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-graph',
  templateUrl: 'graph.html'
})
export class GraphComponent implements OnChanges {

  myChart: HighCharts;

  /* Data of charts */
  _data: any;
  @Input()
  data: any;
  
  /* Name of charts */
  _range: string;
  @Input()
  range: string;

  /* Symbol of charts */
  _symbol: string;
  @Input()
  symbol: string;

  constructor() {
    //console.log('Hello GraphComponent Component');
  }

  ngOnChanges(changes: any) {
    if (changes && changes.data && changes.data.currentValue != undefined) {
        this._data = this.data;
    }

    if (changes && changes.symbol && changes.symbol.currentValue != undefined) {
        this._symbol = this.symbol;
    }

    if (changes && changes.range && changes.range.currentValue != undefined) {
        this._range = this.range;
    }

    if (this._data && this._symbol && this._range) {
        this.generateGraph();
    }
  }

  /* Create Graphis */
  generateGraph() {
    this.myChart = HighCharts.chart('container', {
      chart: {
          type: 'spline'
      },
      title: {
          text: "Representation data of last " +this._range+" days"
      },
      subtitle: {
            text: "Representation data of last " +this._range+" days"
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
              month: '%e. %b',
              year: '%b'
          },
          title: {
              text: 'Date'
          }
      },
      yAxis: {
          title: {
              text: 'Value'
          },
          min: 0
      },
      tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x:%e %b}: {point.y:.2f} '+this._symbol+''
      },
  
      plotOptions: {
          spline: {
              marker: {
                  enabled: true
              }
          }
      },
  
      series: this._data
    });
  }

}
