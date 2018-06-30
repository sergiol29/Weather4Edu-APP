import { Component, Renderer} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup } from '@angular/forms';  

/**
 * Generated class for the ModalMapsGpsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-update-variable',
  templateUrl: 'modal-update-variable.html',
})
export class ModalUpdateVariablePage {
  
  idVariable: number;
  variable: any;

  form: FormGroup;
  nameVariable: any;
  symbolVariable: any;
  codeVariable: any;
  colorVariable: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private viewCtrl: ViewController, private renderer: Renderer, private fb: FormBuilder,
    private apiProv: ApiProvider, private loadingCtrl: LoadingController) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'custom-modal-update', true);
  }

  ionViewDidLoad() {
    this.idVariable = this.navParams.get('id');
    this.getDataAPI();
  }

  /* Created form */
  createForm() {
    /* If form is created, dont created again */
    if (this.form) return;
      
    /* Create form */
    this.form = this.fb.group({
      code: [this.codeVariable, [Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
      name: [this.nameVariable, [Validators.required, Validators.maxLength(24), Validators.minLength(4)]],
      symbol: [this.symbolVariable, [Validators.maxLength(4)]],
      color: [this.colorVariable, [Validators.maxLength(7), Validators.minLength(7)]],
    });
  } 


  /* Get Data Variable */
  getDataAPI() {
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
      /* Get data in API */
      this.apiProv.getDataVariables(this.idVariable).subscribe(
        (data) => {
          this.variable = data;
          this.codeVariable = this.variable.code;
          this.nameVariable = this.variable.name;
          this.symbolVariable = this.variable.symbol;
          this.colorVariable = this.variable.color;

          this.createForm();

          /* Hide loading spinner */
          loader.dismiss();
        });
    });
  }
  
  /* Cancel modal page */
  cancelModal(){
    this.viewCtrl.dismiss(); 
  }

  /* Accept modal page */
  onSubmit(){
    let data = this.form.value;
    
    /* Get data in API */
    this.apiProv.putUpdateVariable(this.idVariable, data).subscribe(
      (data) => {
        
       }
    );
    this.viewCtrl.dismiss();
  }
}
