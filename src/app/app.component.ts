import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/* Load Provider */
import { ApiProvider } from '../providers/api/api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any, params: any}>;
  menu: any;

  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, private apiProv: ApiProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', params: '' }
    ];

    /* Get data in API */
    this.apiProv.getAllStation().subscribe(
      (data) => {
        this.menu = data;
        for(let value of this.menu) {
          this.pages.push(
            { title: value.name, component: 'StationDetailsPage', params: value.id });
        }
      });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.show();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, { id: page.params });
  }
}
