<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="auto"> </v-col>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols="auto">
                <reset-account></reset-account>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ResetAccount from '~/components/Auth/ResetAccount.vue'

export default Vue.extend({
    layout: 'simple',
    name: 'public',

    components: {
        ResetAccount,
    },
    data() {
        return {
            test: 'test'
        }
    },
})
</script>