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
      /* Marker maps */
      var image = 'https://image.ibb.co/nM0XX7/marker_station.png';
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: image,
        streetViewControl: false,
        title: 'Hello World!'
      });

      /* Add class css */
      mapEle.classList.add('show-map');

      /* Show traffic layer, in maps of type Vehicle */
      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.map);

      /* Info windows when click in marker */
      var contentString = 
            '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
              '<div id="bodyContent">'+
                '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
                'sandstone rock formation in the southern part of the </p>'+
              '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });
    });
  }

}
