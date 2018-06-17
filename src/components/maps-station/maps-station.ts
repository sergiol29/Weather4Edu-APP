import { Component, Input } from '@angular/core';

/* Import Geolocation for Google Maps */
/*import { Geolocation } from '@ionic-native/geolocation';*/
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

  constructor() {

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
      zoom: 16,
      streetViewControl: false
    });
    
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      /* Marker maps */
      //var image: any;
      //image = 'https://image.ibb.co/nM0XX7/marker_station.png';

      /* Create Marker map */
      /*let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: image
      });*/

      /* Add class css */ 
      mapEle.classList.add('show-map');

    }); /* End addListenerOnce */
  }

}
