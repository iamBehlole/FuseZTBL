import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CircleService } from '../../../../../core/auth/_services/circle.service';
import { finalize } from 'rxjs/operators';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { Circle } from '../../../../../../app/core/auth/_models/circle.model';
import { Zone } from '../../../../../core/auth/_models/zone.model';
import { Branch } from '../../../../../core/auth/_models/branch.model';
declare const google: any;



@Component({
  selector: 'kt-circle-view-map',
  templateUrl: './circle-view-map.component.html'
})
export class CircleViewMapComponent implements OnInit {

  loadingAfterSubmit = false;
  viewLoading = false;
  submitted = false;
  loading: boolean;
  ///////////////////
  lat = 30.375321;
  lng = 69.345116;
  zoom: number;
  viewColor = "#ecbd00";
  selectedArea = 0;
  fenceMarkers: any = [];
  circlesSinglePoint: any;
  selectedShape: any;
  isLoadingFence: boolean;
  //fenceLoacations: any;
  googleMap: any;
  selectedMarker: any = null;
  previousInfoWindow: any;
  gridHeight: string;

  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }
  ///////////////////

  public Zone = new Zone();
  public Branch = new Branch();
  public zoneInitial = '';
  public branchInitial = '';
  showViewAllBtn: boolean;


  Zones: any = [];
  Branches: any = [];


  constructor(
    private _circleService: CircleService,
    private layoutUtilsService: LayoutUtilsService,
    private _cdf: ChangeDetectorRef
  ) {}




  countryRestriction = {
    latLngBounds: {
      north: 37.084107,
      east: 77.823171,
      south: 23.6345,
      west: 60.872972
    },
    strictBounds: true
  };



  ngOnInit() {
    this.zoom = 0;
    this.GetZones();
  }


  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 250 + 'px';
  }
  loadAll() {
    this.zoneInitial ='';
    this.branchInitial = '';
    this.loadCirclesSinglePoints(null)
  }
  loadCirclesSinglePoints(branch) {
    this.loading = true;
    if (branch != null) {
      branch = branch.value
      if (this.previousInfoWindow != null) {
        this.previousInfoWindow.close();
        this.previousInfoWindow = null
      }
    }
    this._circleService.getAllCirclesSinglePoints(branch)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {

          this.deleteSelectedShape()
          this.circlesSinglePoint = baseResponse.circleSinglePoints;
          this.fenceMarkers = []
          this.circlesSinglePoint.forEach((o, i) => {
            debugger;
            if (o.Long != 0 && o.Lat != 0) {
              // for view only
              this.fenceMarkers.push({
                lat: o.Lat,
                lng: o.Long,
                CircleId: o.CircleId,
                BranchId: o.BranchId,
              });
            }
          });
          if (branch != null && this.fenceMarkers.length > 0) {
            this.showViewAllBtn = true
            this.lat = this.fenceMarkers[0].lat;
            this.lng = this.fenceMarkers[0].lng;
          }
          this._cdf.detectChanges()

        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
      });
  }


  GetZones() {

    this._circleService.getZones()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success)
          this.Zones = baseResponse.Zones;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

  }

  GetBranches(ZoneId) {

    this.Branches = [];
    debugger;
    this.Zone.ZoneId = ZoneId.value;
    this._circleService.getBranchesByZone(this.Zone)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success)
          this.Branches = baseResponse.Branches;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

  }

  getTitle(): string {
    return 'View Circle Fense';
  }


  ///////////////////Os Change Set Map
  onMapReady(map) {
    this.googleMap = map;
    this.setCurrentLocation()
    this.loadCirclesSinglePoints(null);
  }


  clickedMarker(index: number, infowindow) {
    this.viewCircleFense(index);
    if (this.previousInfoWindow != null) {
      this.previousInfoWindow.close();
    }

    this.previousInfoWindow = infowindow;
  }

  removeClickedMarker(index: number) {
    debugger
    if (this.selectedMarker == null) {
      this.selectedMarker = this.fenceMarkers[index]
      this.fenceMarkers.splice(index, 1)
    } else {
      var tempMarker = this.fenceMarkers[index];
      this.fenceMarkers.splice(index, 1)
      this.fenceMarkers.push({
        lat: this.selectedMarker.lat,
        lng: this.selectedMarker.lng,
        CircleId: this.selectedMarker.CircleId,
        BranchId: this.selectedMarker.BranchId,
      })
      this.selectedMarker = tempMarker
    }

  }

  viewCircleFense = (index: number) => {
    if (this.isLoadingFence) {
      return
    }
    this.isLoadingFence = true;
    var circle = new Circle();
    circle.Id = this.fenceMarkers[index].CircleId
   
    //this.removeClickedMarker(index)
    
    this._circleService.CirclePoligonGet(circle)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger
        if (baseResponse.Success) {

          var OldFancPoints = baseResponse.GeoFancPoints;

          const polygonCoordinate = [];
          OldFancPoints.forEach((o, i) => {
            if (o.Long != 0 && o.Lat != 0) {
              // for view only
              polygonCoordinate.push({
                lat: o.Lat,
                lng: o.Long,
              });
            }
          });
          if (polygonCoordinate.length > 0) {
            this.deleteSelectedShape()
            this.selectedShape = new google.maps.Polygon({
              paths: polygonCoordinate,
              strokeColor: this.viewColor,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: this.viewColor,
              fillOpacity: 0.35,
            });

            this.selectedShape.setMap(this.googleMap);

            if (this.zoom < 12) {
              this.lat = polygonCoordinate[1].lat;
              this.lng = polygonCoordinate[1].lng;
              this.zoom = 12;
            }

          } else {
            this.layoutUtilsService.alertElement("", "No fense created against this circle", baseResponse.Code);
          }
          this.isLoadingFence = false
        }
        else {
          this.isLoadingFence = false
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }

      });

  }


  private setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
        //this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  deleteSelectedShape() {

    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
    }
  }

}//End of class

