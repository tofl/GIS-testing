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
          center: [-118, 34],
          zoom: 13,
        });
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
