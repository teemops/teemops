<template>
    <div>
        <v-row>
            <v-col cols="6">

                <v-card>
                    <v-card-title>
                        Recommendations
                        <v-spacer></v-spacer>

                    </v-card-title>

                    <teem-table v-if="hasItems" :title="title" :itemKey="key" :headers="headers" :items="display_items"
                        :has-edit="true" :has-filter="true" :has-pagination="true" v-model="selected" hasSelect="true">

                        <!-- <template v-slot:header>
                            This is a header
                        </template> -->

                    </teem-table>
                    <v-card-text v-if="!hasItems">
                        <v-alert type="info">No Recommendations are available. Start an audit to see
                            recommendations.</v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6">
                <!-- <v-btn color="primary" @click="getInsights" :disabled="selected.length == 0">View Findings</v-btn> -->
                <v-card v-if="selected.length == 0">
                    <v-card-title>
                        Recommended Actions
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-card-subtitle>Select a Recommendation on the left to view
                        Details</v-card-subtitle>


                </v-card>
                <div>
                    <v-card v-if="selected.length > 0">
                        <v-card-title>
                            Recommendation: {{ selected[0].recommendation }}
                        </v-card-title>
                        <h2>{{ selected[0].description }}</h2>
                        <v-card-subtitle>
                            Impact: {{ selected[0].impact }}
                        </v-card-subtitle>
                        <v-card-text>
                            <p>Risk: {{ selected[0].risk }}</p>


                            <p>Steps</p>
                            <ul>
                                <li v-for="(item, index) in selected[0].steps" :key="index">
                                    {{ item }}
                                </li>
                            </ul>
                            <h3>Resources Affected</h3>
                            <v-list lines="one">
                                <v-list-item v-for="(item, index) in selected[0].findings" :key="index">
                                    <v-list-item-content>
                                        <v-list-item-title>


                                            {{ item.description }}
                                        </v-list-item-title>
                                        <p>AWS Resource ID: {{ item.resource }}</p>
                                        <p>
                                            <v-chip>
                                                <nuxt-link title="View Resolution"
                                                    :to="`/security/resolutions/${item.rule}`">
                                                    Resolve</nuxt-link>
                                            </v-chip>
                                            <v-chip><nuxt-link title="View specific finding for this resource"
                                                    :to="`/security/findings/${item.guid}`">View Finding
                                                    Details</nuxt-link>
                                            </v-chip>
                                        </p>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>

                            <v-btn color="secondary" @click="getInsights">View More Details</v-btn>
                        </v-card-actions>
                    </v-card>
                </div>
            </v-col>
        </v-row>

    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TeemTable from '@/components/Reusable/TeemTable.vue'
import SecurityInsightsCompliance from '@/components/Security/Insights/SecurityInsightsCompliance.vue'
import TableHeader from '~/types/TableHeader'

export default Vue.extend({
    components: { TeemTable, SecurityInsightsCompliance },
    async mounted() {

        await this.listRecommend()
    },
    computed: {
        ...mapGetters({ token: 'auth/token' }),
        hasItems(): boolean {
            return this.display_items.length > 0
        },
        getSelectedId(): any {
            if (this.selected.length > 0) {
                return this.selected[0].id
            } else {
                return null
            }
        },
        getFindings(): any {
            if (this.selected.length > 0) {
                return this.selected[0].findings.map((item: any) => {
                    return {
                        description: item.description,
                        resource: item.resource,
                        severity: item.severity
                    }
                })
            } else {
                return null
            }
        },
    },
    methods: {
        ...mapActions({ audit: 'teemops/topsless' }),
        ...mapActions({ getless: 'teemops/getless' }),
        listRecommend: async function () {
            console.log('quick audit')
            this.progress = true
            try {
                var result = await this.getless({
                    path: 'recommendations/get',
                    token: this.token,
                })
                if (result.success == true) {
                    this.progress = false
                    this.key = 'name'
                    this.headers = [

                        {
                            text: 'Recommendation',
                            value: 'recommendation'
                        },
                        {
                            text: 'Impact',
                            value: 'impact'
                        },
                        {
                            text: 'Relative Risk',
                            value: 'risk'
                        }
                    ]
                    this.display_items = result.result.map((item: any) => {
                        item.timestamp = this.$formatDate(item.timestamp)
                        item.audit_type = this.$getAuditType(item.audit_type)
                        return item
                    })

                }
            } catch (e) {
                console.log(e)
                this.progress = false
            }
            this.progress = false
        }
    },
    data() {
        return {
            key: null,
            progress: false,
            title: 'Recommendations and Actions',
            selected: [] as Array<any>,
            display_items: [] as Array<any>,
            headers: [
                {
                    text: 'Recommendation',
                    value: 'recommendation'
                },
                {
                    text: 'Action',
                    value: 'action'
                },
            ] as Array<TableHeader>,
        }
    },
})
</script>