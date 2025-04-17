<template>
  <div>

    <v-container>
      <v-sheet elevation="1" class="pa-4">
        <v-row>
          <v-col cols="12">
            <recommendations-table></recommendations-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <security-insights-dashboard></security-insights-dashboard>
          </v-col>
        </v-row>

      </v-sheet>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//insights
import SecurityInsightsFindings from '@/components/Security/Insights/SecurityInsightsFindings.vue'
import SecurityInsightsDashboard from '@/components/Security/Insights/SecurityInsightsDashboard.vue'
import RecommendationsTable from '@/components/Security/Insights/RecommendationsTable.vue'

export default Vue.extend({
  components: {
    SecurityInsightsFindings,
    SecurityInsightsDashboard,
    RecommendationsTable,
  },
  layout: 'dashboard',
  data() {
    var dismiss = parseInt(localStorage.getItem('dismiss') || '0')
    var servers = [
      {
        status: 'running',
        name: 'default',
      },
      {
        status: 'stopped',
        name: 'dev',
      },
    ]
    return {
      dismiss: dismiss,
      servers: servers,
    }
  },
  // methods: {
  //   ...mapActions([''])
  // }
})
</script>
