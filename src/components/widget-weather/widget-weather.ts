import { Component, Input } from '@angular/core';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

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
        console.log('forecast = ', data);
    });
  }
}
