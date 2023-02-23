import { Component, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Loader, } from '@googlemaps/js-api-loader';
import { readCoords } from './utils/coords-parsers.util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  message = '';

  deliveryArea = readCoords();
  map!: google.maps.Map;
  polygon!: google.maps.Polygon;
  storeMarker!: google.maps.Marker;
  deliveryMarker!: google.maps.Marker;

  loader!: Loader;

  constructor(private cdr: ChangeDetectorRef) {
    this.loader = new Loader({
      apiKey: "PUT-YOUR-API-KEY-HERE",
      libraries: ["places"],
    });
  }

  ngAfterViewInit(): void {

    this.loader.load().then(() => {
      // google.maps is now available as a namespaces - @types/google.maps
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: this.deliveryArea.center,
        zoom: 16,
      });

      this.setStoreMarker()
      
      this.polygon = new google.maps.Polygon({
        paths: this.deliveryArea.area,
        geodesic: true,
        strokeColor: "#252850",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        fillColor: "#4169E1",
        fillOpacity: 0.35,
        map: this.map,
        zIndex: 1,

      });


      // new google.maps.KmlLayer({
      //   url: 'https://drive.google.com/uc?id=1BdCMdkUI9PpxZZYVp67znUY1vSVH3mhq',
      //   map: this.map,
      //   zIndex: 2,
      //   preserveViewport: false
      // });

      this.addGoogleAutocomplete();
    });


  }

  setStoreMarker(): void {
    this.storeMarker = new google.maps.Marker({
      position: this.deliveryArea.center,
      icon: {
        url: 'https://www.iconpacks.net/icons/2/free-store-icon-2017-thumb.png',
        scaledSize: new google.maps.Size(50, 50)
      },
    });

    this.storeMarker.setPosition(this.deliveryArea.center);
    this.storeMarker.setMap(this.map);
  }

  addGoogleAutocomplete(): void {
    let autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete') as HTMLInputElement, {
      componentRestrictions: { country: "pe" }
    });

    this.deliveryMarker = new google.maps.Marker();

    autocomplete.addListener("place_changed", () => {

      this.deliveryMarker.setMap(null)

      const place = autocomplete.getPlace();

      if (!place.geometry?.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      this.deliveryMarker.setPosition(place.geometry.location);
      this.deliveryMarker.setMap(this.map);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(place.geometry.location);

      this.map.fitBounds(bounds);
      this.map.setZoom(15)

      if (google.maps.geometry.poly.containsLocation(place.geometry.location, this.polygon)) {
        this.message = "Estas dentro del area de entrega " + place.formatted_address;
      } else {
        this.message = "Estas fuera del area de entrega " + place.formatted_address;
      }

      this.cdr.detectChanges();

    });
  }

}
