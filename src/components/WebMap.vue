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
    loadModules(['esri/WebMap', 'esri/views/MapView'], { css: true })
      .then(([WebMap, MapView]) => {
        const map = new WebMap({
          portalItem: {
            id: 'cc606b220ec0406885924a4297882f6a',
            portal: 'https://www.arcgis.com',
          },
        });

        this.view = new MapView({
          container: this.$el,
          map,
          center: [2.35, 48.85],
          zoom: 11,
        });

        this.view.popup.autoOpenEnabled = false; // Disable the default popup behavior

        this.view.on('click', (event) => { // Listen for the click event
          this.view.hitTest(event)
            .then((hitTestResults) => {
              if (hitTestResults.results) {
                this.view.popup.open({ // open a popup to show some of the results
                  location: event.mapPoint,
                  title: 'Hit Test Results',
                  content: `${hitTestResults.results.length} + Features Found`,
                });
              }
            });
        });
      });

    setTimeout(() => {
      this.view.goTo({ center: [5.72, 45.19] }, { duration: 5000 })
        .then(() => {
          this.view.zoom = 15;
        });
    }, 10000);
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
