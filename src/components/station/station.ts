import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/* Load Provider */                    
import { ApiProvider } from '../../providers/api/api';
 
/* Loading Spinner */        
import { LoadingController } from 'ionic-angular';

/* Modal */ 
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the StationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */ 
@Component({
  selector: 'app-station',
  templateUrl: 'station.html'
})
export class StationComponent {

  stations: any;

  /* Options Slider */
  options = {
    loop: true,
    effect: 'cube',
    speed: 100000,
    centeredSlides: true,
    paginationType: 'progress',
    parallax: true,
    slidesPerView: 2.5,
    spaceBetween: 10
  }

  constructor(private apiProv: ApiProvider, private loadingCtrl: LoadingController, 
              private navCtrl: NavController, private modalCtrl: ModalController) {
    //console.log('Hello StationComponent Component');
  }

  ngOnInit() {
    this.getDataAPI();
  }
  
  getDataAPI() {
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
       
      /* Get data in API with observable*/
      this.apiProv.filteredStations$.subscribe(
        (data) => {
          this.stations = data;
      });
      
      /* Get subscription */
      this.apiProv.getAllStation().subscribe( () => {
        /* Hide loading spinner */
        loader.dismiss();
      });

    });
  }

  getMoreDetails(id: number) {
    this.navCtrl.push('StationDetailsPage', { id: id });
  }

  openModalEditDevice(idDevice: number, nameDevice: any) {
    /* Open Modal Page */
    let modal = this.modalCtrl.create('ModalUpdateDevicePage',{id: idDevice, name: nameDevice},{showBackdrop:true, enableBackdropDismiss:true});
 
    /* When close modal refresh data */
    modal.onDidDismiss(data => { 
      this.getDataAPI();
    });

    modal.present();
  } 

  getColorFab(type_device:any, status?:any) {
    let color = "";
    if( type_device === 'gps' && status === 'PARADO' ){
      color = 'danger';
    } else if ( type_device === 'gps' && status === 'DESPLAZAMIENTO') {
      color = 'success';
    } else {
      color = 'primary';
    }

    return color;
  }

}
