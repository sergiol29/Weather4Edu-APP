import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationDetailsPage } from './station-details';

/* Load Component */
import { ComponentsModule } from './../../components/components.module';

@NgModule({
  declarations: [
    StationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(StationDetailsPage),
    ComponentsModule
  ],
})
export class StationDetailsPageModule {}
