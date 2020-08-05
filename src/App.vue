<template>
  <div id="app">
    <div class="map">
      <WebMap />
    </div>
    <table v-if="$store.state.comparedStations.length > 0">
      <thead>
        <tr>
          <td><strong>Name</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            <strong>{{ station.name }}</strong>
          </td>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td><strong>ObjectId</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.objectId }}
          </td>
        </tr>

        <tr>
          <td><strong>Coordinates</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.latitude }}, {{ station.longitude }}
          </td>
        </tr>

        <tr>
          <td><strong>Zone</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.zone }}
          </td>
        </tr>

        <tr>
          <td><strong>Address</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.Address }}
          </td>
        </tr>

        <tr>
          <td><strong>Postcode</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.postcode }}
          </td>
        </tr>

        <tr>
          <td><strong>City</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.city }}
          </td>
        </tr>

        <tr>
          <td><strong>Capacity</strong></td>
          <td
            v-for="station in $store.state.comparedStations"
            :key="station.objectId"
          >
            {{ station.capacity }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WebMap from './components/WebMap.vue';

export default {
  name: 'App',
  components: { WebMap },

  methods: {},
};
</script>

<style lang="scss">
html,body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.map {
  display: flex;
  padding: 0;
  margin: 0;
  width: 90%;
  height: 100vh;
}

table, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
