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

  async mounted() {
    this.getStations()
      .then(() => {
        this.loadMap();
      });
  },

  methods: {
    loadMap() {
      loadModules(
        [
          'esri/Map',
          'esri/views/MapView',
          'esri/Basemap',
          'esri/layers/VectorTileLayer',
          'esri/layers/FeatureLayer',
          'esri/widgets/Search',
          'esri/Graphic',
          'esri/renderers/UniqueValueRenderer',
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
            UniqueValueRenderer,
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

            const stationsSymbol = {
              type: 'picture-marker',
              url: 'station-icon.png',
              width: '18px',
              height: '18px',
            };

            const stations = new FeatureLayer({
              url: 'https://services1.arcgis.com/RfENbnrgvatBVii0/arcgis/rest/services/stations/FeatureServer',
              renderer: {
                type: 'simple',
                symbol: stationsSymbol,
              },
            });
            map.add(stations);

            const search = new Search({ view: this.view });
            this.view.ui.add(search, 'top-right');

            // On click, add station to compare
            this.view.on('click', (event) => {
              this.view.hitTest(event)
                .then(({ results: layers }) => {
                  let stationsLayerClicked = false;
                  layers.forEach(async (layer) => {
                    if (layer.graphic.layer.title !== 'Stations 0') return;
                    stationsLayerClicked = true;
                    // Check if one of the points is already in the array
                    if (
                      this.$store.state.comparedStations.map((station) => station.ObjectId)
                        .indexOf(layer.graphic.attributes.ObjectId) > -1
                    ) { return; }

                    const comparedStation = {
                      latitude: layer.graphic.geometry.latitude,
                      longitude: layer.graphic.geometry.longitude,
                      ...this.stations.features.filter((station) => station.attributes.ObjectId
                        === layer.graphic.attributes.ObjectId)[0].attributes,
                    };
                    this.$store.commit('addStation', comparedStation);

                    const uniqueValueInfos = [];
                    this.$store.state.comparedStations.forEach((station) => {
                      uniqueValueInfos.push({
                        value: station.ObjectId,
                        symbol: {
                          type: 'picture-marker',
                          url: 'station-selected.png',
                          width: '20px',
                          height: '20px',
                        },
                      });
                    });

                    const renderer = new UniqueValueRenderer({
                      field: 'ObjectId',
                      defaultSymbol: stationsSymbol,
                      uniqueValueInfos,
                    });
                    stations.renderer = renderer;
                  });

                  if (!stationsLayerClicked && this.$store.state.comparedStations.length > 0) {
                    this.$store.commit('resetComparedStations');
                    stations.renderer = {
                      type: 'simple',
                      symbol: stationsSymbol,
                    };
                  }
                });
            });
          },
        );
    },

    async getStations() {
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

      return new Promise((resolve, reject) => {
        axios(config)
          .then(({ data }) => {
            this.stations = data;
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
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
