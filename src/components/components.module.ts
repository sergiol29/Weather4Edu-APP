import { NgModule } from '@angular/core';
import { StationComponent } from './station/station';

/* Import Icon Ionic, etc */
import { IonicModule } from 'ionic-angular';
import { HeaderMenuComponent } from './header-menu/header-menu';

/* Import Pipe */
import { PipesModule } from './../pipes/pipes.module';
import { GraphComponent } from './graph/graph';
import { TableDataComponent } from './table-data/table-data';
import { MapsStationComponent } from './maps-station/maps-station';
import { GraphBarsComponent } from './graph-bars/graph-bars';

@NgModule({
	declarations: [StationComponent,
    HeaderMenuComponent,
    GraphComponent,
    TableDataComponent,
    MapsStationComponent,
    GraphBarsComponent,
    ],
	imports: [IonicModule, PipesModule],
	exports: [StationComponent,
    HeaderMenuComponent,
    GraphComponent,
    TableDataComponent,
    MapsStationComponent,
    GraphBarsComponent,
    ]
})
export class ComponentsModule {}
