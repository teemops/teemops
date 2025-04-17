<template>
  <div>
    <v-list dense>
      <v-subheader>{{ title }}</v-subheader>
      <!-- <v-radio-group> -->
      <v-list-item-group v-model="selected">
        <template v-for="(item, i) in items">
          <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>

          <v-list-item
            v-else
            :key="i"
            :value="item.name"
            :input-value="active"
            active-class="deep-orange--text text--accent-4"
          >
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-icon>{{
                  active ? `mdi-check-circle` : `mdi-checkbox-blank-circle`
                }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.label"></v-list-item-title>
                <v-list-item-subtitle v-text="item.desc"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
      <!-- </v-radio-group> -->
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ListItem from '~/types/ListItem'

export default Vue.extend({
  model: {
    prop: 'selected',
    event: 'selected',
  },
  props: {
    title: { type: String, required: true } as PropOptions<String>,
    items: { type: Array, required: true } as PropOptions<Array<ListItem>>,
    selected: { type: String, required: true } as PropOptions<String>,
  },
  watch: {
    selected() {
      this.$emit('selected', this.selected)
    },
  },
  data() {
    return {
      defaultTitle: 'Loading',
    }
  },
})
</script>