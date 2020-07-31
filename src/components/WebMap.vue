<template>
  <div></div>
</template>

<script>
import { loadModules } from 'esri-loader';

export default {
  name: 'WebMap',

  data() {
    return {
      view: null,
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
        'esri/tasks/RouteTask',
        'esri/tasks/support/RouteParameters',
        'esri/tasks/support/FeatureSet',
        'esri/Graphic',
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
          RouteTask,
          RouteParameters,
          FeatureSet,
          Graphic,
        ]) => {
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
            zoom: 8,
          });

          const stations = new FeatureLayer({
            url: 'https://services1.arcgis.com/RfENbnrgvatBVii0/arcgis/rest/services/stations/FeatureServer',
            popupTemplate: {
              title: '{name}',
              content: '<b>Location:</b> {address}, {postcode}, {city}<br /><b>Capacity:</b> {capacity}kg/j',
            },
          });
          map.add(stations);

          const search = new Search({ view: this.view });
          this.view.ui.add(search, 'top-right');

          // Routing
          const routeTask = new RouteTask({
            url: 'https://utility.arcgis.com/usrsvcs/appservices/dXeBnGTog3xiTAxJ/rest/services/World/Route/NAServer/Route_World/solve',
          });

          const getRoute = () => {
            const routeParams = new RouteParameters({
              stops: new FeatureSet({
                features: this.view.graphics.toArray(), // Pass the array of graphics
              }),
              returnDirections: true,
            });

            // Get the route
            routeTask.solve(routeParams).then((data) => {
              // Display the route
              data.routeResults.forEach((result) => {
                const res = result;
                res.route.symbol = {
                  type: 'simple-line',
                  color: [5, 150, 255],
                  width: 3,
                };
                this.view.graphics.add(res.route);
              });
            });
          };

          const addGraphic = (type, point) => {
            const graphic = new Graphic({
              symbol: {
                type: 'simple-marker',
                color: type === 'start' ? 'white' : 'black',
                size: '8px',
              },
              geometry: point,
            });
            this.view.graphics.add(graphic);
          };

          this.view.on('click', (event) => {
            if (this.view.graphics.length === 0) {
              addGraphic('start', event.mapPoint);
            } else if (this.view.graphics.length === 1) {
              addGraphic('finish', event.mapPoint);
              getRoute();
            } else {
              this.view.graphics.removeAll();
              addGraphic('start', event.mapPoint);
            }
          });
        },
      );
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
