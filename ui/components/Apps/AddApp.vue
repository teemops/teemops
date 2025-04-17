<template>
  <div>
    <v-row>
      <v-col>
        <v-tabs
          v-model="tab"
          background-color="primary accent-4"
          center-active
          dark
        >
          <v-tab v-for="item in tabs" :key="item">{{ item.title }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="item in tabs" :key="item">
            <v-divider></v-divider>

            <v-container fluid>
              <v-sheet>
                <v-divider></v-divider>
                <v-card tile> </v-card>
                <v-card class="pa-6">
                  <component v-bind:is="item.name" />
                </v-card>
              </v-sheet>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Platform from '~/components/Apps/Add/Platform.vue'
import AppEnvironment from '~/components/Apps/Add/AppEnvironment.vue'
import Scaling from '~/components/Apps/Add/Scaling.vue'
import Code from '~/components/Apps/Add/Code.vue'

export default Vue.extend({
  components: {
    Platform,
    AppEnvironment,
    Scaling,
    Code,
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {
          name: 'Platform',
          title: 'Choose Platform',
        },
        {
          name: 'AppEnvironment',
          title: 'App Environment',
        },
        {
          name: 'Scaling',
          title: 'Scaling',
        },
        {
          name: 'Code',
          title: 'Code',
        },
      ],
    }
  },
})
</script>