import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* Loading Spinner */
import { LoadingController } from 'ionic-angular';

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

  constructor(private apiProv: ApiProvider, private loadingCtrl: LoadingController, private navCtrl: NavController) {
    //console.log('Hello StationComponent Component');
  }

  ngOnInit() {
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
    
      /* Get data in API */
      /* aqui con el observable accedemos a la funcion user$ en vez de gelAllStation y luego hacemos
      this.apiProv.loadUser().subscribe y ya solo se consulta esa funcion de la api 1 vez y se guarda en memoria */
      this.apiProv.getAllStation().subscribe(
        (data) => {
          this.stations = data;
          console.log(data);
          /* Hide loading spinner */
          loader.dismiss();
        });

    });
  }

  getMoreDetails(id: number){
    this.navCtrl.push('StationDetailsPage', { id: id });
  }

}
