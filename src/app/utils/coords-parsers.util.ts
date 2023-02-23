
const coords: any = {
  "type": "FeatureCollection",
  "name": "Capa sin título",
  "crs": {
    "type": "name",
    "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
  },
  "features": [
    {
      "type": "Feature",
      "properties": { "Name": "Center", "description": null },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.0188708, -12.1308219]
      }
    },
    {
      "type": "Feature",
      "properties": { "Name": "Delivery Area", "description": null },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-77.0180608, -12.1304443],
            [-77.0194931, -12.1304601],
            [-77.01908, -12.1312887],
            [-77.0180501, -12.1312782],
            [-77.0180608, -12.1304443]
          ]
        ]
      }
    }
  ]
}

interface PolygonCoords {
  area: Array<{ lat: number, lng: number }>;
  center: { lat: number, lng: number };
}

export function readCoords(): PolygonCoords {
  const freeData = coords;
  const polygonFeature = freeData.features[1];
  const centerFeature = freeData.features[0];

  let center = centerFeature.geometry.coordinates.reduce((lng: any, lat: any) => {
    return {
      lat,
      lng,
    };
  });


  let deliveryArea = polygonFeature.geometry.coordinates[0].map((a: any) => {
    return {
      lat: a[1],
      lng: a[0],
    };
  });


  return {
    area: deliveryArea,
    center
  }
}
