import { AppService } from './../../app.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';


@Component({
    selector:'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignupComponent{

       successMessage:string;
       errorMessage:string
    
   constructor(private appService:AppService){}
    onSignup(form:NgForm){
        this.successMessage=undefined;
        this.errorMessage=undefined;
      this.appService.signup(form.value)
        .subscribe(
            data=>{
                this.successMessage=data.message
                console.log(data);
                form.reset();
            },
            err=>{
                this.errorMessage=err.message
                console.log(err);
                
            }
        )
        
    }
}