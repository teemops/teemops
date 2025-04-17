<template>
  <div>
    <v-data-table v-if="!progress" v-model="selected" :headers="headers" :items="items" :single-select="singleSelect"
      :item-key="itemKey" :show-select="hasSelect" class="elevation-1" :group-by="groupBy">
      <!-- 
      <template v-slot:item="{ item }">
        <tr>


          <slot name="item">

          </slot>



        </tr>
      </template> -->
    </v-data-table>
    <v-progress-linear v-if="progress" color="deep-purple accent-4" indeterminate></v-progress-linear>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TableHeader from '~/types/TableHeader'

export default Vue.extend({
  model: {
    prop: 'selected',
    event: 'selected',
  },
  computed: {
    progress(): Boolean {
      if (this.items.length == 0) {
        return true
      } else {
        return false
      }
      return false
    },
  },
  props: {
    itemKey: { type: String, required: false, default: 'name' } as PropOptions<String>,
    title: { type: String, required: true } as PropOptions<String>,
    headers: { type: Array, required: true } as PropOptions<Array<TableHeader>>,
    items: { type: Array, required: true } as PropOptions<Array<any>>,
    selected: { type: Array, required: false } as PropOptions<Array<any>>,
    hasFilter: { type: Boolean, required: false, default: false } as PropOptions<Boolean>,
    hasPagination: { type: Boolean, required: false, default: false } as PropOptions<Boolean>,
    hasEdit: { type: Boolean, required: false, default: false } as PropOptions<Boolean>,
    hasSelect: { type: Boolean, required: false, default: false } as PropOptions<Boolean>,
    groupBy: { type: Array, required: false, default: null } as PropOptions<Array<any>>,
  },
  watch: {
    selected() {
      this.$emit('selected', this.selected)
    },
  },
  data() {
    return {
      singleSelect: true,
      defaultTitle: 'Loading',
    }
  },
})
</script>