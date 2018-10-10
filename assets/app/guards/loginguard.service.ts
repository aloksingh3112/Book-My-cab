import { AppService } from './../app.service';
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import * as jwt_decode from 'jwt-decode'


@Injectable({
    providedIn:'root'
})
export class AdminGuard implements CanActivate{
    constructor(public appService:AppService,private router:Router){}

   canActivate(){
       
     
      const token=localStorage.getItem('token')

      if(this.getToken(token)){
          console.log('heelo this is login guard')
          return true
    
        }
       else{
        this.router.navigateByUrl('/login');
        return false

       } 






   }


   getToken(token:String):any{
       try{
          return jwt_decode(token)
       }

       catch(error){
          return null
       }
   }



}