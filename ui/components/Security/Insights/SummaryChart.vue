<template>
    <div>
        <div id="chart">
            <apexchart @dataPointSelection="clickMe" type="pie" height="350" :options="graph.chartOptions"
                :series="graph.series">
            </apexchart>
            <v-progress-linear v-if="progress" color="deep-purple accent-4" indeterminate></v-progress-linear>
            <div v-if="selected != undefined">
                {{ selected }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
    async mounted() {
        await this.getData()
    },
    methods: {
        ...mapActions({ insights: 'teemops/topsless' }),
        clickMe(event, chartContext, config) {

            this.selected = config.dataPointIndex
            const seriesIndex = config.seriesIndex
        },

        getData: async function () {
            console.log('get insights data')
            this.progress = true
            try {
                var result = await this.insights({
                    path: 'insights/stats',
                    data: {
                        stats_type: 'issues'
                    },
                    token: this.token,
                })
                if (result.success == true) {
                    this.progress = false
                    this.graph.series = [result.result.passed, result.result.failed]

                }
            } catch (e) {
                console.log(e)
                this.progress = false
            }
            this.progress = false
        }
    },
    computed: {
        ...mapGetters({ token: 'auth/token' }),
    },
    data() {
        return {
            selected: null,
            progress: false,
            graph: {
                series: [0, 0],
                chartOptions: {
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: ['Passed', 'Failed'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
            }
        }
    },
})
</script>