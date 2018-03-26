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

  elementsSearch = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProv: ApiProvider ) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomePage');
    this.initializeItemsSearch();
  }

  initializeItemsSearch() {
    console.log("iniatilize");
    this.elementsSearch = [];

    /* Get data in API with observable */
    this.apiProv.filteredStations$.subscribe(
      (data) => {
        let menu = data;
    });
  }

  getItems(ev) {
    this.apiProv.doFilterStation(ev.target.value);
    /*// Reset items back to all of the items
    this.initializeItemsSearch();
    console.log(this.elementsSearch);
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.elementsSearch = this.elementsSearch.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }*/
  }
}
