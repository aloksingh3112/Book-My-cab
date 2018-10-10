import { CabBookComponent } from './user/cabbook/book/cabbook.component';

import { AddCabComponent } from './admin/addcab/addcab.component';
import { TarifComponent } from './admin/tarif/tarif.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { LoginComponent } from './auth/login/login.component';
import { MyRideComponent } from './user/myrides/myrides.component';
import { DriverComponent } from './driver/driver.component';
import { DriverRidesComponent } from './driver/rides/rides.component';


const routes:Routes=[
    { 
        path:'',
        component:HomeComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'tarif',
        component:TarifComponent
    },
    {
        path:'addcab',
        component:AddCabComponent
    },
    
    {
        path:'bookcab',
        component:CabBookComponent
    },
    {
        path:'myride',
        component:MyRideComponent
    },
    {
        path:'driver',
        component:DriverComponent
    },
    {
        path:'driverride',
        component:DriverRidesComponent
    }
   
]




@NgModule({
  
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]


})

export class AppRouting{}