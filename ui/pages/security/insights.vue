<template>
    <div>

        <security-insights></security-insights>

    </div>
</template>
  
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import SecurityInsights from '@/components/Security/SecurityInsights.vue'

const AUDIT_TYPE_MAP = {
    'aws-audit': 2,
    's3-audit': 1,
    'iam-audit': 3,
    'custom-audit': 4,
}

export default Vue.extend({
    components: { SecurityInsights },
    layout: 'dashboard',
})
</script>
  