import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 
/* Load Provider */ 
import { ApiProvider } from '../../providers/api/api';

/**   
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage() 
@Component({   
  selector: 'page-home',
  templateUrl: 'home.html', 
})
export class HomePage {      

  map: any;
  showsearch: boolean = false;
  idUser: number;
 
  /* Options Search */ 
  optionSearch = {
    showButton: true,
    debounce: 400,
    animated: true
  } 
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProv: ApiProvider ) {
  }
   
  ionViewDidLoad() { 
    //this.idUser = this.navParams.get('id');
    this.idUser = 1;
    //this.apiProv.userActive = this.navParams.get('id');
    console.log(this.apiProv.userActive);
    
    //this.initializeItemsSearch();
  }

  initializeItemsSearch() {
    /* Get data in API with observable */
    this.apiProv.filteredStations$.subscribe(
      (data) => {
        //let menu = data;
    });
  }

  doRefresh(refresher) {
    this.navCtrl.setRoot(this.navCtrl.getActive().component, { id: this.idUser });

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  /*getItems(ev) {
    this.apiProv.doFilterStation(ev.target.value);
  }

  setShowSearch(value: boolean) {
    this.showsearch = value;
  }

  showSearch() {
    this.setShowSearch(true);
  }

  cancelSearch() {
    this.setShowSearch(false);
  }*/
}
