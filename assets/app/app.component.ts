import { AppService } from './app.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import * as io from 'socket.io-client';
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private router:Router,public appService:AppService){
        this.appService.userSocket=io.connect('http://localhost:3000/');
        this.appService.driverSocket=io.connect('http://localhost:3000/');

        
    
     
        const token =localStorage.getItem('token')
        if(!this.getToken(token)){
            this.appService.isLogin=false;
            this.appService.user='user';
            
          this.router.navigateByUrl('/login');
        }
        else
        {
            this.appService.isLogin=true;
            this.appService.user=this.getToken(token).user.firstname;
         
            if(this.getToken(token).user.role==2){
                 this.appService.isAdmin=true;
                 
                 this.router.navigateByUrl('/');
 
            }
            
            else if(this.getToken(token).user.role==0){
                this.appService.isUser=true;
                this.router.navigateByUrl('/bookcab');

            }
            else if(this.getToken(token).user.role==1){
                this.appService.isDriver=true;
                this.router.navigateByUrl('/driver');

            };
        }
    }

    getToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
      }

}