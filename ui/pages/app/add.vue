<template>
  <div>
    <v-toolbar color="blue-grey lighten-3" flat>
      <v-toolbar-title class="grey--text text--darken-4">
        Create App
      </v-toolbar-title>
    </v-toolbar>
    <add-app></add-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AddApp from '~/components/Apps/AddApp.vue'

export default Vue.extend({
  components: { AddApp },
  layout: 'dashboard',
  data() {
    return {
      test: 'test',
    }
  },
})
</script>