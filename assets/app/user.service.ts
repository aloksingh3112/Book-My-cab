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




  emitUser(data){

    if(this.appService.driverArray.length>0){
         const index=this.appService.driverArray.findIndex(driver=>driver.user.driver[0].cartype==data.cartype);

         if(index==-1){
           return alert(`no ${data.cartype}  is available righ now`)
         }
         else{
            
          //  this.bookDriver(this.appService.driverArray[index].user.email);
          return alert(`${data.cartype}  is available righ now`)
         }
    }
    else{
      alert("no cab available ");
    }

  }


  bookDriver(data){

    const token=localStorage.getItem('token');
    // this.http.post('http://localhost:3000/user/boookride',)


  }

}