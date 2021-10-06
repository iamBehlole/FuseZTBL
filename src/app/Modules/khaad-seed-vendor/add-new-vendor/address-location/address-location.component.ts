import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'


@Component({
  selector: 'kt-address-location',
  templateUrl: './address-location.component.html',
  styleUrls: ['./address-location.component.scss']
})
export class AddressLocationComponent implements OnInit {

  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  lat : number;
  lng: number;
  center : google.maps.LatLngLiteral
  googleMap: any;
  vendorLocationMarker: any;
  zoom: number = 2;
  PreviousLocation: Loc[] = [];
  images = [];
  

  markers = []


  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }


  @ViewChild('search', null)
  public searchElementRef: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AddressLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    
  ) { }

  ngOnInit() {
    debugger
    
    

    navigator.geolocation.getCurrentPosition((position)=>{
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })

    this.mapsAPILoader.load().then(() => {

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 15;
          this.addmarker(this.lat, this.lng)
        });
      });
    });

    if(this.data.lat != undefined && this.data.lng != undefined){
        this.PreviousLocation.push(this.data);
    }
  }

  

  ///////////////////Os Change Set Map
  onMapReady(map) {
    this.googleMap = map;
  }

  click(event : any){
    debugger
    //this.googleMap.setMap(null)
    this.addmarker(event.coords.lat, event.coords.lng)

  }

  //Pakistan Geolocation
  countryRestriction = {
    latLngBounds: {
      north: 37.084107,
      east: 77.823171,
      south: 23.6345,
      west: 60.872972
    },
    strictBounds: true
  };
  
  close(result: any): void {
    this.dialogRef.close(result);
  }

  addmarker(lat: any, lng: any): void {
    debugger
    if (this.vendorLocationMarker != null) {
      this.vendorLocationMarker.setMap(null)
    }
    var myLatLng = { lat: lat, lng: lng };
    this.vendorLocationMarker = new google.maps.Marker({
      position: myLatLng,
      title: "",
    });
    this.vendorLocationMarker.setMap(this.googleMap)
    console.log(this.vendorLocationMarker.position.lat())
    console.log(this.vendorLocationMarker.position.lng())
  }

  onSelect() {
    debugger
    var res = {
      lat: this.vendorLocationMarker.position.lat(), lng : this.vendorLocationMarker.position.lng()
    }
    this.data = res;
    console.log(this.data)
    this.close(this.data)
  }
}

interface Loc{
  lat: number;
  lng: number;
}