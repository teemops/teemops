<template>
    <div>
        <v-row>
            <v-col cols="6">

                <v-card>
                    <v-card-title>
                        Recent Scan Summary
                        <v-spacer></v-spacer>

                    </v-card-title>

                    <teem-table :title="title" :itemKey="key" :headers="headers" :items="display_items" :has-edit="true"
                        :has-filter="true" :has-pagination="true" v-model="selected" hasSelect="true">
                    </teem-table>
                </v-card>
            </v-col>
            <v-col cols="6">
                <!-- <v-btn color="primary" @click="getInsights" :disabled="selected.length == 0">View Findings</v-btn> -->
                <v-card>
                    <v-card-title>
                        Findings
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-card-subtitle v-if="selected.length == 0">Select a Scan on the left to view
                        Findings</v-card-subtitle>
                    <security-insights-compliance v-if="selected.length != 0"
                        :id="getSelectedId"></security-insights-compliance>

                </v-card>
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
        console.log(this.$store.state.auth.token)
        await this.listScans()
    },
    computed: {
        ...mapGetters({ token: 'auth/token' }),
        getSelectedId(): any {
            if (this.selected.length > 0) {
                return this.selected[0].id
            } else {
                return null
            }
        }
    },
    methods: {
        ...mapActions({ audit: 'teemops/topsless' }),
        ...mapActions({ getless: 'teemops/getless' }),
        listScans: async function () {
            console.log('quick audit')
            this.progress = true
            try {
                var result = await this.getless({
                    path: 'audit/list',
                    token: this.token,
                })
                if (result.success == true) {
                    this.progress = false
                    this.key = 'id'
                    this.headers = [

                        {
                            text: 'Account',
                            value: 'aws_account_name'
                        },
                        {
                            text: 'Audit Type',
                            value: 'audit_type'
                        },
                        {
                            text: 'Scanned',
                            value: 'timestamp'
                        },
                        {
                            text: 'Findings',
                            value: 'findings'
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
            title: 'Security Insights',
            selected: [] as Array<any>,
            display_items: [] as Array<any>,
            headers: [
                {
                    text: 'Name',
                    value: 'account_name'
                },
                {
                    text: 'AWS Account ID',
                    value: 'aws_account_id'
                },
                {
                    text: 'Type',
                    value: 'access_type'
                },
                {
                    text: 'Added',
                    value: 'created_at'
                },
            ] as Array<TableHeader>,
        }
    },
})
</script>