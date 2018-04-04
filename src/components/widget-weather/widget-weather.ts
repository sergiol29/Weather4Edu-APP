import { Component, Input } from '@angular/core';

/* Load Provider */ 
import { ApiProvider } from '../../providers/api/api';

/* Import Lib MomentJS */ 
import * as moment from 'moment';
    
/**
 * Generated class for the WidgetWeatherComponent component.
 * 
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({   
  selector: 'widget-weather',  
  templateUrl: 'widget-weather.html'
})
export class WidgetWeatherComponent {

  keycity: number;
  forecast: any; 
  moreInfoWeather: boolean = false;

  @Input()
  latitude: number; 

  @Input()   
  longitude: number; 
    
  constructor(private apiProv: ApiProvider) {
    //console.log('Hello WidgetWeatherComponent Component');
     
  } 
 
  ngAfterViewInit(){ 
    this.getKeyCityAPI();
  }


  getKeyCityAPI() {
    /* Get data in API */
    this.apiProv.getKeyCity(this.latitude, this.longitude).subscribe(
      (data) => {
        this.keycity = data['Key'];
        this.getWeatherCity();
    });    
  } 

  getWeatherCity(){    
    /* Get data in API */
    this.apiProv.getWeatherForecasts5days(this.keycity).subscribe(
      (data) => {
        this.forecast = data; 
    });
  }     
   
  formatEpochDate(date: number) {
    //console.log(moment.unix(date).format("DD/MM/YYYY"));
    return moment.unix(date).format("ddd[,] MMM DD");
  }

  showMoreWeather() {
    this.moreInfoWeather = !this.moreInfoWeather;
  }
}
