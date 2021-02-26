import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot({backButtonText: 'atrás', mode: 'ios'}),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    CallNumber,
    FCM,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
