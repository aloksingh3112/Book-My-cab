import { DriverRidesComponent } from './driver/rides/rides.component';
import { DriverComponent } from './driver/driver.component';
import { CabBookComponent } from './user/cabbook/book/cabbook.component';
import { AddCabComponent } from './admin/addcab/addcab.component';
import { TarifComponent } from './admin/tarif/tarif.component';
import { HttpModule } from '@angular/http';
import { CustomFormsModule } from 'ng2-validation';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { AppService } from "./app.service";
import { AppRouting } from "./approuting.module";
import { HomeComponent } from "./home/home.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";

import { MyRideComponent } from './user/myrides/myrides.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import {AgmDirectionModule} from 'agm-direction'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    TarifComponent,
    AddCabComponent,
   
    CabBookComponent,
    MyRideComponent,
    DriverComponent,
    DriverRidesComponent

  ],
  imports: [BrowserModule, AppRouting,FormsModule,CustomFormsModule,HttpModule,

  AgmCoreModule.forRoot(
    {
    apiKey:'',
     libraries:['places','geometry']
    }
    ),
    AgmDirectionModule
],


  
  
  providers: [AppService,GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule {}
