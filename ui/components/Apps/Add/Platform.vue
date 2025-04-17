<template>
  <div>
    <v-row>
      <v-col>
        <v-header>Select Platform</v-header>
        <v-radio-group v-model="radios">
          <template v-slot:label>
            <div>Your favourite <strong>search engine</strong></div>
          </template>
          <v-radio value="Google">
            <template v-slot:label>
              <div>
                Of course it's <strong class="success--text">Google</strong>
              </div>
            </template>
          </v-radio>
          <v-radio value="Duckduckgo">
            <template v-slot:label>
              <div>
                Definitely <strong class="primary--text">Duckduckgo</strong>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      fields: {
        test: 'sdsd' as String,
      },
    }
  },
})
</script>