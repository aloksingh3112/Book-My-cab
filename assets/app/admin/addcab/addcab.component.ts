import { AppService } from '../../app.service';
import { AdminService } from '../../admin.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
    selector:'app-addcab',
    templateUrl:'./addcab.component.html',
    styleUrls:['./addcab.component.css']
})
export class AddCabComponent implements OnInit,OnDestroy{
    errorMessage:string;
    successMessage:string
    isEdit:boolean=false;

      firstN:string;
      lastN:string;
      emaiL:string;
      contacT:number;
      addresS:string;
      carT:string;
      locenseN:string;
      carN:string;
      carM:string;
      driverId:string;
      driverDetailId:string;

    constructor(public adminService:AdminService,public appService:AppService){
       
    }

    ngOnInit(){
        this.adminService.getDriver()
         .subscribe(
             data=>console.log("data is ",data),
             err=>console.log("error is ",err)
         )
    }

  submit(form:NgForm){
    this.successMessage=undefined;
    this.errorMessage=undefined;

    if(this.isEdit){
       form.value.driverId=this.driverId;
       form.value.driverDetailId=this.driverDetailId; 
       this.adminService.editDriver(form.value)
          .subscribe(
            data=>{
              console.log("edit data is",data)
              form.reset();
            },
            err=>{
              console.log("edit data in error ",err);
              form.reset();
            }
          )
      
      this.isEdit=false;

    }  


  else{

    this.adminService.addDriver(form.value)
      .subscribe(
          data=>{
              this.successMessage=data.message
              form.reset();
            },
          err=>{
              this.errorMessage=err.message
              console.log(err)
            }
      )

}
  }

  delete(data){
    swal({
        title: "Delete!",
        text: "Are you sure you want to delete this",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then((value)=>{
          if(value){
           this.adminService.deleteDriver(data)
              .subscribe(
              data=>console.log(data),
              err=>console.log(err)
        )
      }
      })
  }


  edit(driver){
      console.log(driver);
     this.isEdit=true;
     this.firstN=driver.firstname;
     this.lastN=driver.lastname;
     this.emaiL=driver.email;
     this.contacT=driver.contact;
     this.addresS=driver.driver[0].address;
     this.carT=driver.driver[0].cartype;
     this.locenseN=driver.driver[0].licenceno;
     this.carN=driver.driver[0].carname;
     this.carM=driver.driver[0].carmodel;
     this.driverId=driver._id;
     this.driverDetailId=driver.driver[0]._id;

  }

  ngOnDestroy(){
      this.adminService.driverData=[];
  }

}