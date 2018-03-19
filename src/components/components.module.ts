import { NgModule } from '@angular/core';
import { StationComponent } from './station/station';

/* Import Icon Ionic, etc */
import { IonicModule } from 'ionic-angular';
import { HeaderMenuComponent } from './header-menu/header-menu';

/* Import Pipe */
import { PipesModule } from './../pipes/pipes.module';

@NgModule({
	declarations: [StationComponent,
    HeaderMenuComponent],
	imports: [IonicModule, PipesModule],
	exports: [StationComponent,
    HeaderMenuComponent]
})
export class ComponentsModule {}
