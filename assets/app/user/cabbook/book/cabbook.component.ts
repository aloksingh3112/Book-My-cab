import { AppService } from './../../../app.service';
import { UserService } from "./../../../user.service";
import { Observable } from "rxjs";
import { Http } from "@angular/http";

import { NgForm } from "@angular/forms";
import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef
} from "@angular/core";

import { MapsAPILoader } from "@agm/core";

@Component({
  selector: "app-cabbook",
  templateUrl: "./cabbook.component.html",
  styleUrls: ["./cabbook.component.css"]
})
export class CabBookComponent implements OnInit {
  lat: number;
  lon: number;
  travelMode: string = "DRIVING";
  zoom: number;
  totalfare:number
  distance:number;
  isEstimate:boolean=false;
  driverLat:number;
  driverLon:number;
  @ViewChild('modalbutton') button:ElementRef


  @ViewChild("pickup")
  pickup: ElementRef;
  @ViewChild("destination")
  destination: ElementRef;

  renderOption = {
    supressMarkers: true
  };

  markerOption = {
    origin: {
      icon: "https://i.imgur.com/7teZKif.png"
    },
    destination: {
      icon: "https://i.imgur.com/7teZKif.png"
    }
  };

  origin1: Object = { lat: undefined, lng: undefined };
  destination1: Object = { lat: undefined, lng: undefined };

  constructor(
    private mapApiLoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: Http,
    public userService: UserService,
    public appService:AppService
  ) {}

  ngOnInit() {
    this.setCurrentPosition();
    this.userService.getSocket();
    this.appService.getLogoutEvent();
    console.log("array is ",this.appService.driverArray);
   

    this.mapApiLoader.load().then(() => {
      console.log("map api called");

      let autocomplete = new google.maps.places.Autocomplete(
        this.pickup.nativeElement,
        {
          types: ["address"]
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.origin1 = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          this.zoom = 12;
        });
      });

      let autocomplete1 = new google.maps.places.Autocomplete(
        this.destination.nativeElement,
        {
          types: ["address"]
        }
      );

      autocomplete1.addListener("place_changed", () => {
        console.log("ggsipu");
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete1.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.destination1 = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          this.zoom = 12;
        });
      });
    });
  }



  getEstimate(data) {
    const ori = new google.maps.LatLng(this.origin1.lat, this.origin1.lng);
    const dest = new google.maps.LatLng(
      this.destination1.lat,
      this.destination1.lng
    );
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      ori,
      dest
    );
    const dist = Math.ceil(distance / 1000);

    this.userService.getTarif(data.cartype)
       .subscribe(
         data=>{
           this.totalfare=data.cartype.normalhourrate+(dist*data.cartype.peakhourrate);
           console.log(this.totalfare)
           this.distance=dist;
           this.isEstimate=true;
         },
         err=>{

         }
       )
  }




  bookCab(form: NgForm) {

    console.log(form.value);
    console.log(this.appService.driverArray);
    form.value.distance=this.distance;
    form.value.totalfare=this.totalfare;
    this.userService.emitUser(form.value,this.button);

  }




  cancel(data:NgForm){
    //  data.reset();
     this.isEstimate=false;
    //  this.origin1 = { lat: undefined, lng: undefined };
    //  this.destination1 = { lat: undefined, lng: undefined };


  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.zoom = 10;
      });
    }
  }
}
