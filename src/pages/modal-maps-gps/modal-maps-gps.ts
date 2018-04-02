import { Component, Renderer} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* Loading Spinner */
import { LoadingController } from 'ionic-angular';

/* Import Lib MomentJS */
import * as moment from 'moment';

/* Import Geolocation for Google Maps */
import { Geolocation } from '@ionic-native/geolocation';
declare var google;

/**
 * Generated class for the ModalMapsGpsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-maps-gps',
  templateUrl: 'modal-maps-gps.html',
})
export class ModalMapsGpsPage {

  map: any;
  idDevice: number;
  dataDevice: any;  
  latLngDevice = []; 

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private apiProv: ApiProvider, private loadingCtrl: LoadingController, 
              private renderer: Renderer, private viewCtrl: ViewController) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'custom-modal-maps', true);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModalMapsGpsPage');
    this.idDevice = this.navParams.get('id');
    console.log('station = ', this.idDevice);
    this.getDataAPI();
  }

  /* Variable to is opcional */
  getDataAPI() {
    /* Now timestamp */
    let to = moment().unix(); 

    /* From now moment less 24 hours */
    let from = moment().subtract(24, 'hours').unix();

    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
      /* Get data in API */
      this.apiProv.getShowStation(this.idDevice, from, to).subscribe(
        (data) => {
          this.dataDevice = data;
          console.log(data);
          this.getLatLngDevice();
          this.loadMap(); 
          /* Hide loading spinner */
          loader.dismiss();
        });
    });
  }

  getLatLngDevice() {
    for(var i = 0; i < this.dataDevice.data[0].values.length; i++) {
      this.latLngDevice.push( {lat: +this.dataDevice.data[0].values[i].value, lng: +this.dataDevice.data[1].values[i].value} );
    }
  }

  loadMap() {    
    let contMap = 1;
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
  
    // create LatLng object
    let myLatLng = this.latLngDevice[0];
  
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 11,
      streetViewControl: false
    });
     
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      /* Marker maps according type device */
      var image = 'https://image.ibb.co/ipWY77/marker_vehicle.png';

      /* Add class css */ 
      mapEle.classList.add('show-map');

      /* Show traffic layer */
      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.map);

      /* Info windows when click in marker */
      var infowindow = new google.maps.InfoWindow;

      for(let values of this.latLngDevice ) {
        /* Create Marker map */
        let marker = new google.maps.Marker({
          position: values,
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: image,
          label: contMap.toString(),
          streetViewControl: false,
        });

        contMap++;

        marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });

        /* Inverse Geocoder for get street with latitude and longitude */
        var geocoder = new google.maps.Geocoder;

        geocoder.geocode({'location': values}, function(results, status) {
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
