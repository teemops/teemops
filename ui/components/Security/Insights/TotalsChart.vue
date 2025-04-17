<template>
    <div>
        <div id="chart">
            <apexchart type="bar" height="350" :options="graph.chartOptions" :series="graph.series"></apexchart>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
const CHART_COLORS = {
    seriesPastel: ['#FFB6C1', '#87CEFA', '#98FB98', '#FFDAB9', '#ADD8E6', '#F08080', '#E0FFFF', '#FFA07A', '#B0E0E6', '#FFC0CB'],
    seriesPastelDark: ['#FF9AA2', '#ADD8E6', '#90EE90', '#FFB6C1', '#87CEFA', '#FFA07A', '#B0C4DE', '#FFDAB9', '#AFEEEE', '#F0E68C'],
    seriesDark: ['#ADD8E6', '#90EE90', '#FFFFE0', '#E6E6FA', '#FFC0CB', '#87CEFA', '#98FB98', '#FAFAD2', '#D8BFD8', '#FFB6C1'],
    severity: ['#FF0000', '#FF7600', '#49C95F'],
}


export default Vue.extend({
    components: {

    },
    async mounted() {
        await this.listTotals()
    },
    props: {
        id: { type: Number, required: false } as PropOptions<Number>,
        data: { type: Array, required: false } as PropOptions<Array<any>>,
    },
    methods: {
        ...mapActions({ insights: 'teemops/topsless' }),
        listTotals: async function () {
            console.log('List Totals')
            this.progress = true
            try {
                var result = await this.insights({
                    path: 'insights/stats',
                    data: {
                        stats_type: 'severity'
                    },
                    token: this.token,
                })
                if (result.success == true) {
                    this.progress = false
                    const series = result.result.map((item: any) => {
                        return {
                            name: this.$getResourceType(item.service),
                            data: [item.high, item.medium, item.low]
                        }
                    })
                    this.graph.series = series

                    // this.display_items = result.result.map((item: any) => {
                    //     item.timestamp = this.$formatDate(item.timestamp)
                    //     item.audit_type = this.$getAuditType(item.audit_type)
                    //     return item
                    // })

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
            progress: false,
            graph: {
                series: [{
                    name: 'S3 Buckets',
                    data: [0, 0, 0]
                }, {
                    name: 'EC2 Instances and Volumes',
                    data: [0, 0, 0]
                }, {
                    name: 'IAM Users and Groups',
                    data: [0, 0, 0]
                }],
                chartOptions: {
                    // grid: {
                    //     // row: {
                    //     //     colors: ['#fff', '#fff', '#fff']
                    //     // },
                    //     column: {
                    //         colors: ['#FF8F86', '#FFAA5C', '#49C95F']
                    //     },
                    //     fill: {
                    //         opacity: 0.2
                    //     }
                    // },
                    // colors: [CHART_COLORS.seriesDark, CHART_COLORS.seriesPastelDark, CHART_COLORS.severity],
                    //colors: CHART_COLORS.seriesDark,
                    // colors: [function ({ value, seriesIndex, w }) {
                    //     console.log(value, seriesIndex, w)
                    //     //use rgb red shades
                    //     if (seriesIndex == 0) {
                    //         return '#C60500'
                    //     } else if (seriesIndex == 1) {
                    //         return '#FF0700'
                    //     } else {
                    //         return '#FF3E39'
                    //     }



                    // }, function ({ value, seriesIndex, w }) {
                    //     console.log(value, 'column 2')
                    //     return '#FF0700'

                    // }, function ({ value, seriesIndex, w }) {
                    //     console.log(value, 'column 3')
                    //     return '#00CC00'

                    // }],
                    chart: {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                        toolbar: {
                            show: true
                        },
                        zoom: {
                            enabled: true
                        }
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom',
                                offsetX: -10,
                                offsetY: 0
                            }
                        }
                    }],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            borderRadius: 10,
                            dataLabels: {
                                total: {
                                    enabled: true,
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: 900
                                    }
                                }
                            }
                        },
                    },
                    xaxis: {
                        type: 'string',
                        categories: ['High', 'Medium', 'Low'
                        ],
                        labels: {
                            style: {
                                colors: CHART_COLORS.severity,
                                fontSize: '15px',
                                fontWeight: 900
                            }
                        }

                    },
                    legend: {
                        position: 'right',
                        offsetY: 40
                    },
                    fill: {
                        opacity: 1
                        // type: 'gradient',
                        // gradient: {
                        //     shade: 'light',
                        //     type: "vertical",
                        //     shadeIntensity: 0.5,
                        //     gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
                        //     inverseColors: true,
                        //     opacityFrom: 1,
                        //     opacityTo: 1,
                        //     stops: [0, 50, 100],
                        //     colorStops: []
                        // }
                    }
                }
            }
        }
    },
})
</script>