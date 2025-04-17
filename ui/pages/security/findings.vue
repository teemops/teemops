<template>
    <div>
        <v-container>
            <v-sheet elevation="1" class="pa-4">
                <v-row>
                    <v-col cols="12">
                        <v-card>
                            <v-card-title>
                                Findings
                                <v-spacer></v-spacer>

                            </v-card-title>


                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <security-findings></security-findings>
                    </v-col>
                </v-row>



            </v-sheet>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TeemTable from '@/components/Reusable/TeemTable.vue'
import TableHeader from '~/types/TableHeader'
import SecurityFindings from '@/components/Security/Findings/SecurityFindings.vue'

export default Vue.extend({
    layout: 'dashboard',
    components: {
        TeemTable,
        SecurityFindings
    },
})
</script>