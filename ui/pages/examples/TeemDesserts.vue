<template>
    <div>
        <h1>Sample data below</h1>
        <desserts></desserts>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import Desserts from '~/components/Reusable/Examples/Desserts.vue'

export default Vue.extend({
    components: {
        Desserts,
    },
    data() {
        return {}
    },
})
</script>

<style></style>