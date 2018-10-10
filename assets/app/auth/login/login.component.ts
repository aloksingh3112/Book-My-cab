import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';



@Component({
   selector:'app-login',
   templateUrl:'./login.component.html',
   styleUrls:['./login.component.css']
})
export class LoginComponent{


    constructor(private appService:AppService,private router:Router){}
    errorMessage:string;

    login(form:NgForm){
    
        
        this.errorMessage=undefined;
       this.appService.login(form.value)
        .subscribe(
            data=>{
                 localStorage.setItem('token',data.token)
                if(data.user.role==1){
                     return this.router.navigateByUrl('/driver');
                }
                 this.router.navigateByUrl('/')
                
                //  console.log(data.token)
            },
            err=>{
                this.errorMessage=err.message;
                console.log(err)
            }
        )
    }

}