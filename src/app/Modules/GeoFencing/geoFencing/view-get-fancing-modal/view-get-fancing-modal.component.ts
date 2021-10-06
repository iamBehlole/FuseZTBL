import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-get-fancing-modal',
  templateUrl: './view-get-fancing-modal.component.html',
  styleUrls: ['./view-get-fancing-modal.component.scss']
})
export class ViewGetFancingModalComponent implements OnInit {

  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  lat : number;
  lng: number;
  center :google.maps.LatLngLiteral
  googleMap: any;
  vendorLocationMarker: any;
  zoom: number = 2;
  PreviousLocation: Loc[] = [];
  images = [];

  //Pakistan Geolocation
  // countryRestriction = {
  //   latLngBounds: {
  //     north: 37.084107,
  //     east: 77.823171,
  //     south: 23.6345,
  //     west: 60.872972
  //   },
  //   strictBounds: true
  // };

  markers: marker[] = [
	  {
		  lat: 51.673858,
		  lng: 7.815982,
		  label: 'A',
		  draggable: false
	  },
	  {
		  lat: 51.373858,
		  lng: 7.215982,
		  label: 'B',
		  draggable: false
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
		  label: 'C',
		  draggable: false
	  }
  ]

  start_end_mark = [];

  latlng = [
    [
      23.0285312,
      72.5262336
    ],
    [
      19.0760,
      72.8777
    ],
    [
      25.2048,
      55.2708
    ]
  ];


  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }


  @ViewChild('search', null)
  public searchElementRef: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ViewGetFancingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,


  ) {

     // this i write because to display a marks on first place and last place
     this.start_end_mark.push(this.latlng[0]);
     this.start_end_mark.push(this.latlng[this.latlng.length - 1]);
   }

  ngOnInit() {
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
  close(result: any): void {
    this.dialogRef.close(result);
  }






}

interface Loc{
  lat: number;
  lng: number;
}
// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
