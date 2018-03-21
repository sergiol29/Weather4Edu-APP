import { Component, Input } from '@angular/core';

/* Import Geolocation for Google Maps */
import { Geolocation } from '@ionic-native/geolocation';
declare var google;

/**
 * Generated class for the MapsStationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-maps-station',
  templateUrl: 'maps-station.html'
})
export class MapsStationComponent {
  map: any;

  @Input()
  latitude: number;

  @Input()
  longitude: number;

  @Input()
  idmap: string;

  constructor(private geolocation: Geolocation) {
    //console.log('Hello MapsStationComponent Component');
  }

  ngAfterViewInit(){
    this.loadMap();
  }

  loadMap() {
    let latitude = +this.latitude;
    let longitude = +this.longitude;
    
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map-'+this.idmap);
  
    // create LatLng object
    let myLatLng = {lat: latitude, lng: longitude};
  
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'Hello World!'
      });
      mapEle.classList.add('show-map');
    });
  }

}
