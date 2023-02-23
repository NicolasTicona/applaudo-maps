import { Component, AfterViewInit } from '@angular/core';
import { Loader, } from '@googlemaps/js-api-loader';
import { readCoords } from './utils/coords-parsers.util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'applaudo-maps';
  deliveryArea = readCoords();
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  polygon!: google.maps.Polygon;

  loader!: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: "AIzaSyAPiF-FYdsqaGk-B5JgRYwbHB-POuYWXX8",
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

      this.setCenterMarker()

      this.polygon = new google.maps.Polygon({
        paths: this.deliveryArea.area,
        geodesic: true,
        strokeColor: "#252850",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        fillColor: "#4169E1",
        fillOpacity: 0.35,
        map: this.map
      });
      

      this.addGoogleAutocomplete();
    });
  }

  setCenterMarker(): void {
    this.marker = new google.maps.Marker({
      position: this.deliveryArea.center,
    });
    
    this.marker.setPosition(this.deliveryArea.center);
    this.marker.setMap(this.map);
  }
  
  addGoogleAutocomplete(): void {
    let autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete') as HTMLInputElement,{
      componentRestrictions: { country: "pe" }
    });

    autocomplete.addListener("place_changed", () => {
    
      this.marker.setMap(null);

      const place = autocomplete.getPlace();

      if (!place.geometry?.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      this.marker.setPosition(place.geometry.location);
      this.marker.setMap(this.map);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(place.geometry.location);

      this.map.fitBounds(bounds);
      this.map.setZoom(15)

      if(google.maps.geometry.poly.containsLocation(place.geometry.location, this.polygon)){
        alert("Estas dentro del area de entrega")
      } else {
        alert("Estas fuera del area de entrega")
      }

    });
  }

}
