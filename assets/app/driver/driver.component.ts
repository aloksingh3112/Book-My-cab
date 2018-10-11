import { AppService } from './../app.service';
import { UserService } from './../user.service';
import { Component ,OnInit, OnChanges, DoCheck} from "@angular/core";




@Component({
    selector:'app-driver',
    templateUrl:'./driver.component.html',
    styleUrls:['./driver.component.css']
})
export class DriverComponent implements OnInit,DoCheck{
    
    lat:number;
    long:number ;
    zoom=4;

    constructor(private userService:UserService,public appService:AppService){

    }

    ngOnInit(){
  
        this.setCurrentPosition();
        this.appService.getUser();
      
    }



    private setCurrentPosition() {
        console.log("gg")
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            this.lat = position.coords.latitude;
            this.long = position.coords.longitude;
            this.zoom = 12;
            this.userService.emitSocket(position.coords.latitude,position.coords.longitude);
          });
        }
      }
}