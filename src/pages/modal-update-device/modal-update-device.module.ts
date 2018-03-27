import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalUpdateDevicePage } from './modal-update-device';

@NgModule({
  declarations: [
    ModalUpdateDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalUpdateDevicePage),
  ],
})
export class ModalUpdateDevicePageModule {}
