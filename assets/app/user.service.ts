import { ElementRef } from '@angular/core';
import { AppService } from './app.service';
import { Http ,Headers,Response} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as jwt_decode from 'jwt-decode';
import 'rxjs/Rx';


@Injectable({
    providedIn:'root'
})
export class UserService{

  driverDestination:string;
  driverPickup:string;
  driverName:string;
  driverContact:number;
  totalfare:number;

  userPickuplocation;
  userDestination;
  totalFare;   
   username;
  useremail;

  constructor(public http:Http,public appService:AppService){

  }

  


  getTarif(cartype){
        const token=localStorage.getItem('token');

       const headers=new Headers({
           "Content-Type":'application/json',
           token:token
       })
      return this.http.get(`http://localhost:3000/user/tarif/${cartype}`,{headers:headers})
       .map((data:Response)=>data.json())
       .catch((err:Response)=>{
        if(err.status==401 || err.status==403){
            this.appService.logout();
          }
          return Observable.throw(err.json());
       })
  }


  getSocket(){
      
    this.appService.getEvent();
    
      
  }

  emitSocket(lat,lon){
    console.log("ggsipu");
    const token=localStorage.getItem('token');
    const data =jwt_decode(token);
    console.log(data,lat,lon);
     this.appService.latitude=lat;
     this.appService.longitude=lon;
     this.appService.emitEvent(data)

  }




  emitUser(data,button:ElementRef){

    if(this.appService.driverArray.length>0){
         const index=this.appService.driverArray.findIndex(driver=>driver.user.driver[0].cartype==data.cartype);

         if(index==-1){
           return alert(`no ${data.cartype}  is available righ now`)
         }
         else{
           const token=localStorage.getItem('token');
           const user=jwt_decode(token);
           this.driverDestination=data.destination;
           this.driverPickup=data.pickuplocation;
           this.totalfare=data.totalfare;
           this.driverName=this.appService.driverArray[index].user.firstname+" "+this.appService.driverArray[index].user.lastname;
           this.driverContact=this.appService.driverArray[index].user.contact;

          let combineData={
             user:user,
             ride:data,
             email:this.appService.driverArray[index].user.email
          }
           this.appService.emitUser(combineData);
            button.nativeElement.click();

            
            }
    }
    else{
      alert("no cab available ");
    }

  }


  

}