import { Observable } from 'rxjs/Rx';
import { Http,Headers,Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import * as jwt_decode from 'jwt-decode';



@Injectable()
export class AppService{

    isAdmin:boolean;
    isUser:boolean;
    isDriver:boolean;
    isLogin:boolean;
    user:string='User';
    userSocket:SocketIOClient.Socket;
    driverSocket:SocketIOClient.Socket;
    latitude;
    longitude;
    driverLat:number;
    driverLon:number;
    driverArray:[]=[];

    driverButtonData='Current Booking '
    isBooked:boolean=false;

    userPickuplocation:string;
    userDestination:string;
    username:string;
    useremail:string;
    totalFare:number;
    // userArray=[];

   
    
  


    constructor(private http:Http,private router:Router){}
//signup user

    signup(data){
          const body=JSON.stringify(data);
          const headers=new Headers({'Content-Type':'application/json'})
          return this.http.post('http://localhost:3000/auth/signup',body,{headers:headers})
           .map((data:Response)=>{
               console.log(data.json());
               this.user=data.json().user.firstname;
               return data.json()
           }
        )
           .catch((err:Response)=>Observable.throw(err.json()))
    }

   //login user 

     login(data){
         const body =JSON.stringify(data);
         const headers=new Headers({'Content-Type':'application/json'})
        return  this.http.post('http://localhost:3000/auth/login',body,{headers:headers})
         .map((data:Response)=>{
             this.isLogin=true
             if(data.json().user.role===2){
                 this.isAdmin=true
             }
             else if(data.json().user.role===0){
                this.isUser=true;
             }
             else if(data.json().user.role===1)
             {
                 this.isDriver=true;
             }
             return data.json();
            }
        )
         .catch((err:Response)=>Observable.throw(err.json()))

     }


     logout(){
          const token=localStorage.getItem('token');
          const user=jwt_decode(token);
        
         if(user.user.role==1){
        
            this.emitLogoutEvent(user.user.email);
            

         } 

        
        localStorage.removeItem('token') ;
        this.isLogin=false;
        this.isAdmin=false;
        this.isUser=false;
        this.isDriver=false;
    
        this.router.navigateByUrl('/')
     }
        
    
    emitEvent(data){
        console.log(this.longitude,this.latitude)
        console.log("array",this.driverArray);
        this.driverSocket.emit('chat',{
            message:data,
            lat:this.latitude,
            lon:this.longitude
        })
    } 

    getEvent(){
        this.userSocket.on('chat',(data)=>{
         
            const index=this.driverArray.findIndex((user)=>user.user.email==data.user.email);

            console.log("index is ",index);
            if(index==-1){
            this.driverArray.push(data);
            
            }

            console.log('array is',this.driverArray);
            
             
        })
    }



    emitLogoutEvent(user){
        this.driverSocket.emit('logout',user)

    }

    getLogoutEvent(){
        this.userSocket.on('logout',(data)=>{
            const index=this.driverArray.findIndex(data=>data.user.email==data);
            this.driverArray.splice(index,1);
        })
    }


    emitUser(data){
   
      this.userSocket.emit('booking',data)


    }

    getUser(){
        this.driverSocket.on('booking',(data)=>{
            const token=localStorage.getItem('token');
            const driver=jwt_decode(token);

            if(driver.user.email==data.email){
             this.userPickuplocation= data.ride.pickuplocation;
             this.userDestination=data.ride.destination;
             this.totalFare=data.ride.totalfare;
             this.username=data.user.user.firstname+' '+data.user.user.lastname;
             this.useremail=data.user.user.email;
             this.totalFare=data.ride.totalfare;
             this.driverButtonData="you got a Booking";
             this.isBooked=true;
             
             
              console.log("data is ",this.userPickuplocation);


            }
            
        })
    }

   

   


}