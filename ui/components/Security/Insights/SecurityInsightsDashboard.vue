<template>
    <div>
        <v-row>
            <v-col cols="6">

                <v-card>
                    <v-card-title>
                        Top Findings
                        <v-spacer></v-spacer>

                    </v-card-title>
                    <totals-chart></totals-chart>
                </v-card>
            </v-col>
            <v-col cols="6">

                <v-card>
                    <v-card-title>
                        Issue Summary
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <summary-chart></summary-chart>

                </v-card>
            </v-col>
        </v-row>

    </div>
</template>
<script lang="ts">
import Vue from 'vue'

import TeemTable from '@/components/Reusable/TeemTable.vue'
import TeemChart from '@/components/Reusable/TeemChart.vue'
import SecurityInsightsCompliance from '@/components/Security/Insights/SecurityInsightsCompliance.vue'
import TableHeader from '~/types/TableHeader'
import TotalsChart from './TotalsChart.vue'
import SummaryChart from './SummaryChart.vue'

export default Vue.extend({
    components: { TeemTable, TeemChart, SecurityInsightsCompliance, TotalsChart, SummaryChart },

})
</script>