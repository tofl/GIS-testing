<template>
  <div></div>
</template>

<script>
import { loadModules } from 'esri-loader';
import axios from 'axios';
import qs from 'qs';
// import FormData from 'form-data';

export default {
  name: 'WebMap',

  data() {
    return {
      view: null,
      graphicsLayer: null,
      Graphic: null,
    };
  },

  mounted() {
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/VectorTileLayer',
        'esri/layers/FeatureLayer',
        'esri/widgets/Search',
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
      ],
      { css: true },
    )
      .then(
        ([
          Map,
          MapView,
          Basemap,
          VectorTileLayer,
          FeatureLayer,
          Search,
          Graphic,
          GraphicsLayer,
        ]) => {
          this.Graphic = Graphic;
          const basemap = new Basemap({
            baseLayers: [
              new VectorTileLayer({
                portalItem: {
                  id: '68ebe374c077491c97406a3b2e794471',
                },
              }),
            ],
          });

          const map = new Map({ basemap });

          this.view = new MapView({
            container: this.$el,
            map,
            center: [4.835659, 45.764043],
            zoom: 10,
          });

          const stations = new FeatureLayer({
            url: 'https://services1.arcgis.com/RfENbnrgvatBVii0/arcgis/rest/services/stations/FeatureServer',
            popupTemplate: {
              title: '{name}',
              content: '<b>Location:</b> {address}, {postcode}, {city}<br /><b>Capacity:</b> {capacity}kg/j',
            },
            renderer: {
              type: 'simple',
              symbol: {
                type: 'picture-marker',
                url: 'station-icon.png',
                width: '18px',
                height: '18px',
              },
            },
          });
          map.add(stations);

          const search = new Search({ view: this.view });
          this.view.ui.add(search, 'top-right');

          // Show the starting location

          // On click, calculate the route to the closest station
          console.log(this.view.graphics);
          this.view.on('click', (event) => {
            this.view.graphics.removeAll();
            this.graphicsLayer = null;

            this.graphicsLayer = new GraphicsLayer();
            map.add(this.graphicsLayer);

            const point = {
              type: 'point',
              longitude: event.mapPoint.longitude,
              latitude: event.mapPoint.latitude,
            };

            const simpleMarkerSymbol = {
              type: 'simple-marker',
              color: [168, 0, 6], // orange
              outline: {
                color: [255, 255, 255], // white
                width: 1,
              },
              size: 5,
            };

            const pointGraphic = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,
            });

            this.view.graphics.add(pointGraphic);
            this.calculateNearestRoute(event.mapPoint.latitude, event.mapPoint.longitude);
          });
        },
      );
  },

  methods: {
    calculateNearestRoute(latitude, longitude) {
      const body = qs.stringify({
        f: 'json',
        outFields: 'name,zone,address,postcode,city,capacity',
        outSr: 4326,
        where: '1=1',
      });

      const config = {
        method: 'post',
        url: 'https://services1.arcgis.com/RfENbnrgvatBVii0/arcgis/rest/services/stations/FeatureServer/stations_0/query',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: body,
      };

      axios(config)
        .then(({ data }) => {
          // Build the body of the nearestFacility query
          const facilities = {
            features: [],
          };
          data.features.forEach((feature) => {
            const obj = {
              geometry: {
                ...feature.geometry,
                spatialReference: {
                  wkid: 4326,
                },
              },
              attributes: {
                name: feature.attributes.name,
              },
            };
            facilities.features.push(obj);
          });

          // Incidents
          const incidents = {
            features: [
              {
                geometry: {
                  x: longitude,
                  y: latitude,
                  spatialReference: {
                    wkid: 4326,
                  },
                },
                attributes: {
                  name: 'Centre de Lyon',
                },
              },
            ],
          };

          // Send the request
          const form = new FormData();
          form.append('f', 'json');
          form.append('returnDirections', 'true');
          form.append('returnCFRoutes', 'true');
          form.append('incidents', JSON.stringify(incidents));
          form.append('facilities', JSON.stringify(facilities));

          axios({
            method: 'post',
            url: 'https://utility.arcgis.com/usrsvcs/appservices/qWHwb4vIJpx4kuri/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World/solveClosestFacility',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: form,
          })
            .then((response) => {
              // Add a line to the map, showing the directions:
              const simpleLineSymbol = {
                type: 'simple-line',
                color: [226, 119, 40], // orange
                width: 2,
              };

              const directions = response.data.routes.features[0].geometry.paths;

              const polyline = {
                type: 'polyline',
                paths: directions,
              };

              const polylineGraphic = new this.Graphic({
                geometry: polyline,
                symbol: simpleLineSymbol,
              });

              this.view.graphics.add(polylineGraphic);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
