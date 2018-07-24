import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigVariablePage } from './config-variable';

@NgModule({
  declarations: [
    ConfigVariablePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigVariablePage),
  ],
})
export class ConfigVariablePageModule {}
