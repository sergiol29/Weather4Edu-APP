import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/* Import Lib MomentJS */
import * as moment from 'moment';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage { 
  from: string = moment().subtract(1, 'days').format();
  to: string = moment().format();

  constructor(private renderer: Renderer, public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'custom-modal', true);
  }  
 
  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModalPage');
  }

  /* Cancel modal page */
  cancelModal(){
    this.viewCtrl.dismiss();
  }

  /* Accept modal page */
  acceptModal() {
    let data = { 'from': this.from , 'to': this.to };
    this.viewCtrl.dismiss(data);
  }

}
