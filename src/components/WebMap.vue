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
          const graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          const point = {
            type: 'point',
            longitude: 4.825831386169402,
            latitude: 45.75218614077687,
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

          graphicsLayer.add(pointGraphic);
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
