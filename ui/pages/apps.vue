<template>
  <div>
    <v-container>
      <v-sheet elevation="1" class="pa-4">
        <v-row justify="center" align="top">
          <v-col cols="12" sm="3" md="4">
            <v-card>
              <v-card-title class="headline">Apps</v-card-title>
              <v-card-text> Manage your Teemops Apps</v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"> Add</v-btn>
              </v-card-actions>
            </v-card>
            <v-card>
              <v-card-title class="headline"
                >View Existing Backups</v-card-title
              >
              <v-card-text> Add a new backup task </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"> Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'dashboard',
  data() {
    return {
      test: 'test',
    }
  },
})
</script>