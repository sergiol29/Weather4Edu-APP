import { Component, Input, OnChanges } from '@angular/core';

/* Import HighCharts */
import * as HighCharts from 'highcharts';

/**
 * Generated class for the GraphBarsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-graph-bars',
  templateUrl: 'graph-bars.html'
})
export class GraphBarsComponent implements OnChanges {

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
    console.log('Hello GraphBarsComponent Component');
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

  generateGraph() {
    this.myChart = HighCharts.chart('container', {
      chart: {
          type: 'bar'
      },
      title: {
          text: "Representation data of last " +this._range+" days"
      },
      subtitle: {
          text: "Representation data of last " +this._range+" days"
      },
      xAxis: {
          categories: ['Vehicle'],
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: '% State Vehicle',
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: ' %'
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: ((HighCharts.theme && HighCharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
      },
      credits: {
          enabled: false
      },
      series: this.data
  });
  }

}
