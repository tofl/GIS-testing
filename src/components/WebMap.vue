<template>
  <div></div>
</template>

<script>
import { loadModules } from 'esri-loader';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'WebMap',

  data() {
    return {
      view: null,
      graphicsLayer: null,
      Graphic: null,
      stations: null,
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

          // On click, add station to compare
          this.view.on('click', (event) => {
            this.view.hitTest(event)
              .then(({ results: layers }) => {
                layers.forEach(async (layer) => {
                  if (layer.graphic.layer.title !== 'Stations 0') return;
                  // Check if one of the points is already in the array
                  if (
                    this.$store.state.comparedStations.map((station) => station.objectId)
                      .indexOf(layer.graphic.attributes.ObjectId) > -1
                  ) { return; }

                  if (!this.stations) {
                    const body = qs.stringify({
                      f: 'json',
                      outFields: 'ObjectId,name,zone,address,postcode,city,capacity',
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

                    await axios(config)
                      .then(({ data }) => {
                        this.stations = data;
                      });
                  }

                  const comparedStation = {
                    objectId: layer.graphic.attributes.ObjectId,
                    latitude: layer.graphic.geometry.latitude,
                    longitude: layer.graphic.geometry.longitude,
                    ...this.stations.features.filter((station) => station.attributes.ObjectId
                      === layer.graphic.attributes.ObjectId)[0].attributes,
                  };
                  this.$store.commit('addStation', comparedStation);
                  console.log(this.$store.state.comparedStations);
                });
              });
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
