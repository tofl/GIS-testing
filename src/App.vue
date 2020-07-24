<template>
  <div id="app">
    <WebMap />
  </div>
</template>

<script>
import WebMap from './components/WebMap.vue';

export default {
  name: 'App',
  components: { WebMap },
};
</script>

<style lang="scss">
html,body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  display: flex;
  padding: 0;
  margin: 0;
  width: 800px;
  height: 100%;
}
</style>
