import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddVariablePage } from './add-variable';

@NgModule({
  declarations: [
    AddVariablePage,
  ],
  imports: [
    IonicPageModule.forChild(AddVariablePage),
  ],
})
export class AddVariablePageModule {}
