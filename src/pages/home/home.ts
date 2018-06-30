import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 
/* Load Provider */ 
import { ApiProvider } from '../../providers/api/api';

/* LocalStorage */
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

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
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProv: ApiProvider,
              private storage: LocalstorageProvider ) {
  }
   
  ionViewWillEnter() { 
    /* Read ID_User of localstorage */   
    this.storage.getUserID().then(value => {
      this.idUser = value;
    })
    
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

  logout() {
    this.storage.clearStorage();
    this.navCtrl.push('LoginPage');
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
