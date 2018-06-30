import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/* LocalStorage */
import { LocalstorageProvider } from '../providers/localstorage/localstorage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{ title: string, component: any, params: any }>;
  //menu: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: LocalstorageProvider) {
    /* Check if user active, if active sending HomePage without Login */
    this.storage.isUserActive().then(userActive => {
      if (userActive) {
        this.rootPage = 'HomePage';
      } 

      this.initializeApp();
    })
  }

  /* Initialize menu APP */
  initializeMenu() {
    /*this.pages = [
      { title: 'Home', component: 'HomePage', params: '' }
    ];*/
  }

  initializeApp() {    
    /* hide splash screen */
    this.splashScreen.hide();

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, { id: page.params });
  }
}
