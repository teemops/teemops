<template>
  <div>
    <v-menu
      :label="label"
      ref="menu"
      v-model="timeMenuShow"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="currentTime"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          label="Select Time"
          v-model="currentTime"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="timeMenuShow"
        v-model="currentTime"
        full-width
        @click:minute="$refs.menu.save(currentTime)"
      ></v-time-picker>
    </v-menu>
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
    label: { type: String, required: true } as PropOptions<String>,
    currentTime: {
      type: Date,
      required: false,
      default: null,
    } as PropOptions<Date>,
  },
  watch: {
    currentTime() {
      this.$emit('selected', this.currentTime)
    },
  },
  data() {
    return {
      timeMenuShow: false,
    }
  },
})
</script>