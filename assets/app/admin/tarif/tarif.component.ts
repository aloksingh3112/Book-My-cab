import { AppService } from './../../app.service';
import { AdminService } from './../../admin.service';
import { NgForm, NgModel } from '@angular/forms';
import { Component, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Time } from '@angular/common';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
    selector:'app-tarif',
    templateUrl:'./tarif.component.html',
    styleUrls:['./tarif.component.css']

})
export class TarifComponent implements OnInit,OnDestroy{
   @ViewChild('close') close:ElementRef;
   @ViewChild('tarifModel') save:ElementRef;
   @ViewChild('f') form:NgForm;
    selects:string
    normal:number;
    peak:number;
    start:Time;
    end:Time;
    isEdit:boolean=false
    id;


   constructor(public adminService:AdminService,public appService:AppService){

   }

   ngOnInit(){
       this.adminService.getTarif()
         .subscribe(
             data=>{
                 if(data.islength==0){
                     console.log("data is ",data);
                 }
                 else if(data.islength==1){
                    
                     for(let tarif of data.user.admin[0].tarifplan){
                         this.adminService.tarifData.push(tarif);
                     };
                     console.log("data is ",this.adminService.tarifData);
                 }
             },
             err=>{
                 this.appService.logout();
                 console.log('error is ',err.status)
                }
         )
       
   }
   


    tarif(data:NgForm){
       
       
        
        if(!this.isEdit){
        this.adminService.addTarif(data.value)
           .subscribe(
               data=>{
                console.log("data in tarif",data);
               },
               err=>{
                  this.appService.logout();
               }
           );
        }
        else{
            data.value._id=this.id;
            let newData=data.value;
            console.log(data.value,"",this.adminService.tarifData);
           this.adminService.editTarif(data.value)
            .subscribe(
                res=>{
                    console.log(res);
                    console.log(newData);
                    const index=this.adminService.tarifData.findIndex((tarif)=>{
                        console.log("tarif id",tarif._id);
                        console.log("data id is ",newData._id)
                        console.log(parseInt(tarif._id)==parseInt(newData._id));
                        return tarif._id==newData._id}
                    )
                    
                   
                    
                    this.adminService.tarifData.splice(index,1,newData);
                },
                err=>{
                    this.appService.logout();
                  }
            );
          this.isEdit=false;
        }
        data.reset();   
        this.closeModal(data);
        
    }

    closeModal(data:NgForm){
        this.isEdit=false;
        
        this.close.nativeElement.click();
        data.reset();
   }
   closeM(){
       this.isEdit=false
       this.form.reset();
   }

    delete(tarif){
        swal({
            title: "Delete!",
            text: "Are you sure you want to delete this",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
          }).then((value)=>{
             
               if(value){
                this.adminService.deleteTarif(tarif)
                .subscribe(
                    data=>console.log(data),
                    err=>{
                        this.appService.logout();
                        console.log(err)
                       }
                )

               }
          })
       
   
    }


    ngOnDestroy(){
        console.log("tarif destroyed");
        this.adminService.tarifData=[];
    }

    edit(data){
       
       this.end=data.endpeaktime;
       this.peak=data.peakhourrate;
       this.normal=data.normalhourrate;
       this.selects=data.cartype;
       this.start=data.startpeaktime;
       this.save.nativeElement.click();
       this.id=data._id;
       this.isEdit=true;
       
     }

}