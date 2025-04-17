<template>
    <div>
        <teem-table :title="title" :itemKey="key" :headers="headers" :items="display_items" :has-filter="true"
            :has-pagination="true" v-model="selected" :hasSelect="false" :groupBy="groupBy">
        </teem-table>

    </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TeemTable from '@/components/Reusable/TeemTable.vue'
import TableHeader from '~/types/TableHeader'

export default Vue.extend({
    components: { TeemTable },
    props: {
        id: { type: Number, required: false } as PropOptions<Number>,
    },
    async mounted() {
        this.display_items = []
        await this.getInsights()
    },
    computed: {
        ...mapGetters({ token: 'auth/token' }),
    },
    //watch for the selected item and then force an update of the findings security compliance component
    watch: {
        id() {
            if (this.progress == false) {
                this.display_items = []
                this.getInsights()
            }
        }
    },
    methods: {
        ...mapActions({ audit: 'teemops/topsless' }),
        getInsights: async function () {
            console.log('quick audit')
            this.progress = true
            try {
                const params = {
                    scan_id: this.id
                };
                var result = await this.audit({
                    path: 'audit/findings',
                    data: params,
                    token: this.token,
                })
                if (result.success == true) {
                    this.progress = false
                    this.key = 'id'
                    this.headers = [


                        {
                            text: 'Resource',
                            value: 'resource'
                        },
                        {
                            text: 'Passed',
                            value: 'passed'
                        },
                        {
                            text: 'Rule',
                            value: 'rule_name'
                        },
                        {
                            text: 'Severity',
                            value: 'severity'
                        }
                    ]
                    this.display_items = result.result.map((item: any) => {
                        item.timestamp = this.$formatDate(item.timestamp)
                        return {
                            ...item,
                            rule_name: item.rule_detail.name != undefined ? item.rule_detail.name : item.rule_detail,
                        }

                    })
                } else {
                    this.progress = false
                }
            } catch (e) {
                console.log(e)
                this.progress = false
            }
            this.progress = false
        },
    },
    data() {
        return {
            key: null,
            progress: false,
            title: 'Compliance',
            selected: [] as Array<any>,
            display_items: [] as Array<any>,
            headers: [
            ] as Array<TableHeader>,
            groupBy: [
                {
                    key: 'service',
                    order: 'asc',
                },
            ],
        }
    },
})
</script>