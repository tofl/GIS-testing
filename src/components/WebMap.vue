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
      ['esri/Map', 'esri/views/MapView', 'esri/Basemap', 'esri/layers/VectorTileLayer', 'esri/layers/FeatureLayer'],
      { css: true },
    )
      .then(([Map, MapView, Basemap, VectorTileLayer, FeatureLayer]) => {
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
          zoom: 6,
        });

        const stations = new FeatureLayer({
          url: 'https://services1.arcgis.com/RfENbnrgvatBVii0/arcgis/rest/services/stations/FeatureServer',
          popupTemplate: {
            title: '{name}',
            content: '<b>Location:</b> {address}, {postcode}, {city}<br /><b>Capacity:</b> {capacity}kg/j',
          },
        });

        map.add(stations);
      });
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
