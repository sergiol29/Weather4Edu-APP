import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
   
/* Load Provider */                     
import { ApiProvider } from '../../providers/api/api'; 
      
/* Loading Spinner */            
import { LoadingController } from 'ionic-angular';

/* Modal */ 
import { ModalController } from 'ionic-angular';

/* Import Lib MomentJS */  
import * as moment from 'moment';

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
  /* Get data send by component in HomePage */
  @Input()      
  idUser: number;

  stations: any;

  constructor(private apiProv: ApiProvider, private loadingCtrl: LoadingController, 
              private navCtrl: NavController, private modalCtrl: ModalController) {

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
      /* Get subscription */
      this.apiProv.getAllStation(this.idUser).subscribe( 
        (data) => {
          this.stations = data; 
          
          /* Hide loading spinner */ 
          loader.dismiss();
      }); 
 
    });     
  }

  getMoreDetails(id_station: number) {
    this.navCtrl.push('StationDetailsPage', { id: id_station });
  }

  getValuesMaxes(id_station: number) {    
    this.navCtrl.push('ValuesMaxesPage', { id: id_station });
  }

  getValuesMins(id_station: number) {
    this.navCtrl.push('ValuesMinsPage', { id: id_station });
  }

  getConfigVariables(id_station: number) {
    this.navCtrl.push('ConfigVariablePage', { id: id_station });
  }

  openModalEditDevice(idStation: number, nameStation: any) {
    /* Open Modal Page */
    let modal = this.modalCtrl.create('ModalUpdateDevicePage',{id: idStation, name: nameStation},{showBackdrop:true, enableBackdropDismiss:true});
 
    /* When close modal refresh data */
    modal.onDidDismiss(data => { 
      this.getDataAPI();
    });
  
    modal.present();
  }

  getFilterLastedData(value: any) {
    let valuesDontShow = ['BAT'];
     
    /* value is include in array */
    if( valuesDontShow.indexOf(value) > -1 ) { 
      return false;
    } else {
      return true; 
    }
  }

  getValueBatery(last_frame: any):number {
    let value: number = 0;
    last_frame.forEach(element => { 
      if( element.code == "BAT") { value = element.value };  
    });
    
    return value;
  }

  formatDate(timestamp: any) {
    return moment.unix(timestamp).format("dddd, MMMM D YYYY - H:mm");
  }
}
