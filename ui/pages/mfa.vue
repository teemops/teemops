<template>
    <div>
        <ManageMFA></ManageMFA>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ManageMFA from '~/components/Account/ManageMFA.vue'
export default Vue.extend({
    components: {
        ManageMFA,
    },
})
</script>ManageMFA