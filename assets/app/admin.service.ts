import { AppService } from './app.service';
import { Injectable } from "@angular/core";
import { root } from "rxjs/internal/util/root";
import {Http,Headers,Response} from '@angular/http'
import { Observable } from "rxjs";
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public http:Http,public appService:AppService){

  }
  tarifData:any[]=[];
  driverData:any[]=[]
  


  addTarif(data){

    const body=JSON.stringify(data);
    const token=localStorage.getItem('token')

    const headers=new Headers({
      'Content-Type':'application/json',
       'token':token
    })
     
     return this.http.post('http://localhost:3000/admin/tarifs',body,{headers:headers})
      .map((data:Response)=>{
        this.tarifData.push(data.json().tarif);
        console.log(this.tarifData)
         return data.json()
      }
      )
      .catch((err:Response)=>{
        if(err.status==401 || err.status==403){
          this.appService.logout();
        }
        return Observable.throw(err.json())
      })
    }


    getTarif(){
       const token=localStorage.getItem('token');
       const headers=new Headers({
         'Content-Type':'application/json',
         'token':token
       })

       return this.http.get('http://localhost:3000/admin/tarif',{headers:headers})
         .map((data:Response)=>{
             return data.json()
         })
         .catch((err:Response)=>{
         if(err.status==401 || err.status==403){
          this.appService.logout();
        }
         return Observable.throw(err)
       } )

    }



    deleteTarif(data){
     
      const token=localStorage.getItem('token');
      const headers=new Headers({
        'Content-Type':'application/json',
        'token':token
      });

      return this.http.delete(`http://localhost:3000/admin/tarif/${data._id}`,{headers:headers})
      .map((deta:Response)=>{
       this.tarifData.splice(this.tarifData.indexOf(data),1);
       return deta.json()
      })
      .catch((err:Response)=>{
        if(err.status==401 || err.status==403){
          this.appService.logout();
        }
        return Observable.throw(err.json())
      })
    }


    // edit tarif

    editTarif(data){
      const token=localStorage.getItem('token')
      const body =JSON.stringify(data);
      const headers =new Headers({
        "Content-Type":"application/json",
        token:token
      });

     return this.http.put(`http://localhost:3000/admin/tarif/${data.id}`,body,{headers:headers})
        .map((res:Response)=>res.json())
        .catch((err:Response)=>{
          if(err.status==401 || err.status==403){
            this.appService.logout();
          }
          return Observable.throw(err)
        }) 
    }




  //  ******** add driver ********

    addDriver(data){
      const token=localStorage.getItem('token');
      const body=JSON.stringify(data);
      const headers=new Headers({
        "Content-Type":"application/json",
        token:token
      })

      return this.http.post('http://localhost:3000/admin/driver',body,{headers:headers})
          .map((res:Response)=>{
          let driver = res.json().result.admin[0].driverDetails
          this.driverData=[...driver];
            
              return res.json()
          })
          .catch((err:Response)=>{
              if(err.status==401 || err.status==403){
                this.appService.logout();
              }

              return Observable.throw(err.json())}
            )
    }



  //  ********* getting driver detail **********

    getDriver(){

      const token =localStorage.getItem('token');
     const headers=new Headers({
       "Content-Type":"application/json",
        token:token
     })


     return this.http.get('http://localhost:3000/admin/driver',{headers:headers})
       .map((res:Response)=>{
        let driver = res.json().data.admin[0].driverDetails;
        this.driverData=[...driver];
          return res.json()
       })
       .catch((err:Response)=>{
        if(err.status==401 || err.status==403){
          this.appService.logout();
        }
         return Observable.throw(err.json())
       })

    }



    deleteDriver(driver){
      const token=localStorage.getItem('token');
      const headers=new Headers({
        "Content-Type":"application/json",
        token:token
      })

     return  this.http.delete(`http://localhost:3000/admin/driver/${driver._id}`,{headers:headers})
         .map((res:Response)=>{
           const index=this.driverData.findIndex((data)=>data._id==driver._id);
           this.driverData.splice(index,1);
           return res.json();
        })
        .catch((err:Response)=>{
          if(err.status==401 || err.status==403){
            this.appService.logout();
          }
          return Observable.throw(err.json())
        })

    }



    editDriver(data){
      const token=localStorage.getItem('token');
      const body=JSON.stringify(data);
      const headers=new Headers({
        "Content-Type":"application/json",
          token:token
      });

      return this.http.put(`http://localhost:3000/admin/driver/${data.driverId}`,body,{headers:headers})
       .map((res:Response)=>{
         const index=this.driverData.findIndex(driver=>driver._id==data.driverId);
         this.driverData.splice(index,1,res.json().res);

          return res.json() ;
       })
       .catch((err:Response)=>{
        if(err.status==401 || err.status==403){
          this.appService.logout();
        }
         return Observable.throw(err.json())
       })
    }


    

}
