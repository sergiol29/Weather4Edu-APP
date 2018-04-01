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

  @Input()
  typeDevice: string;

  constructor() {
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
      zoom: 16
    });
    
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      /* Marker maps according type device */
      if( this.typeDevice === 'gps' ) {
        var image = 'https://image.ibb.co/ipWY77/marker_vehicle.png';
      } else {
        var image = 'https://image.ibb.co/nM0XX7/marker_station.png';
      }

      /* Create Marker map */
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: image,
        streetViewControl: false,
      });

      /* Add class css */ 
      mapEle.classList.add('show-map');

      /* If device is type GPS */
      if( this.typeDevice === 'gps' ) {
        var contentString = "";
        /* Show traffic layer */
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(this.map);

        /* Info windows when click in marker */
        var infowindow = new google.maps.InfoWindow;
  
        marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });

        /* Inverse Geocoder for get street with latitude and longitude */
        var geocoder = new google.maps.Geocoder;

        geocoder.geocode({'location': myLatLng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              infowindow.setContent(results[0].formatted_address);
            } 
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      }

    }); /* End addListenerOnce */
  }

}
