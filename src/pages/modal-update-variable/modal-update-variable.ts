import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';  

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
  viewHumanVariable: any;
  type_viewhuman: string; 

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private viewCtrl: ViewController, private fb: FormBuilder,
    private apiProv: ApiProvider, private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController) {
 
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
      name: [this.nameVariable, [Validators.maxLength(24), Validators.minLength(4)]],
      symbol: [this.symbolVariable, [Validators.maxLength(4)]],
      color: [this.colorVariable, [Validators.maxLength(7), Validators.minLength(7)]],
      view_human: [this.viewHumanVariable],
      new_view_human: [],
      switch_case: this.fb.array( [], Validators.compose([]) )
    });
 
    /* Wait 1 seg for not get error the element null not created */
    setTimeout(function() {
      document.getElementById('view_human').querySelector<HTMLInputElement>('textarea').style.height = document.getElementById('view_human').querySelector<HTMLInputElement>('textarea').scrollHeight + 'px';
    }, 500);
  } 

  createGroupSwitch(): FormGroup {
    return this.fb.group({
      value_max: '',
      value_min: '',
      return: ''
    });
  }

  get groupSwitch(): FormArray {
    return this.form.get('switch_case') as FormArray;
  }

  resetGroupSwitch() {
    let len = this.groupSwitch.length - 1;

    for (var i = len; i >= 0; --i) {  
      this.groupSwitch.removeAt(i);
    }
  }

  addItemSwithCase(numberItem: number): void {
    for (var i = 0; i < numberItem; ++i) {
      this.groupSwitch.push( this.createGroupSwitch() );
    }
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
          this.viewHumanVariable = this.variable.view_human;

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
    
    /* If exist new view and new view is not null */
    if( ( data['view_human'] != data['new_view_human'] ) && data['new_view_human'] ) { 
      /* Check if correct View in form */
      this.apiProv.getCheckViewHuman(this.variable.last_value, data['new_view_human']).subscribe(
        (check) => {
          let result = check; 

          if( result['correct'] ) {
            data['view_human'] = data['new_view_human'];
          }
          
          this.sendUpdateVariable(data);
        }
      );
    } else {
      this.sendUpdateVariable(data);
    }      
  }

  sendUpdateVariable(data:any){
    /* Send data in API */
    this.apiProv.putUpdateVariable(this.idVariable, data).subscribe(
      (data) => {
    
        }
      );

      this.viewCtrl.dismiss();
  }

  onSubmitTestViewHuman() {
    let view_human = this.form.get('new_view_human').value;
    
    /* If new view human is null, change to value because generate error if null */
    if( !view_human ) { view_human = '*'; }

    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    }); 

    /* Show loading spinner */
    loader.present().then(() => {
      /* Get data in API */
      this.apiProv.getCheckViewHuman(this.variable.last_value, view_human).subscribe(
        (data) => {
          let result = data;            

          /* Show alert with result */
          let alert = this.alertCtrl.create({
            title: result['result'],
            subTitle: result['message'],
            buttons: ['Ok']
          });
          alert.present();

          /* Hide loading spinner */
          loader.dismiss();    
        });
    });
  }

  /* Control change select type view human */
  onChangeTypeViewHuman(type_view: any) {
    if( type_view === 'case' ) {
      this.type_viewhuman = 'case';
      this.alertSwitchCase();
    } else if( type_view === 'operation' ) {
      this.type_viewhuman = 'operation';
      this.resetGroupSwitch();
    } else {
      this.type_viewhuman = '';
    }

    this.form.get('new_view_human').reset();
  }

  alertSwitchCase() {
    let alert = this.alertCtrl.create();

    alert.setTitle('Enter number of case');
    alert.addInput({ type: 'radio', label: '2', value: '2', checked: true });
    alert.addInput({ type: 'radio', label: '3', value: '3' }); 
    alert.addInput({ type: 'radio', label: '4', value: '4' });
    alert.addInput({ type: 'radio', label: '5', value: '5' });
    alert.addButton('Cancel');

    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.createSwitch(data);
      }
    });
    
    alert.present();    
  }

  createSwitch(numberSelect: any) {    
    switch(numberSelect) { 
      case '2': { 
        this.addItemSwithCase(2);
        break; 
      } 
      case '3': { 
        this.addItemSwithCase(3);
        break; 
      }
      case '4': { 
        this.addItemSwithCase(4);
        break; 
      }
      case '5': { 
        this.addItemSwithCase(5);
        break; 
      } 
    }

    this.onChangeGroupSwitch();
  }

  onChangeGroupSwitch() {
    let len = this.groupSwitch.length;  
    let result = "";
    
    for (var i = 0; i < this.groupSwitch.length; ++i) {
      if( i == 0 ) {
        result += `if value >= ${this.form.get('switch_case').value[i].value_min} and value <= ${this.form.get('switch_case').value[i].value_max} \n \t '${this.form.get('switch_case').value[i].return}' \n`;
      } else if( i != len - 1) {
        result += `elsif value >= ${this.form.get('switch_case').value[i].value_min} and value <= ${this.form.get('switch_case').value[i].value_max} \n \t '${this.form.get('switch_case').value[i].return}' \n`;
      } else {
        result += `else \n \t '${this.form.get('switch_case').value[i].return}' \n`;
      }
    }
 
    result += "end";
    
    /* Change value of textarea */
    this.form.get('new_view_human').setValue(result);

    /* Update height of textarea, automatic depend value at textearea */
    //this.element.nativeElement.querySelector("#new_view_human").style.height = this.element.nativeElement.querySelector("#new_view_human").scrollHeight + 'px';
    document.getElementById('new_view_human').querySelector<HTMLInputElement>('textarea').style.height = document.getElementById('new_view_human').querySelector<HTMLInputElement>('textarea').scrollHeight + 'px';
  }
}
