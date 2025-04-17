<template>
  <div>

    <div v-if="hasCredentials">
      <teem-table :title="title" :headers="headers" :items="display_items" :has-edit="true" :has-filter="true"
        :has-pagination="true" v-on:selected="selected">
      </teem-table>
    </div>

  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TableHeader from '~/types/TableHeader'
import TeemTable from '../Reusable/TeemTable.vue'

export default Vue.extend({
  components: { TeemTable },
  computed: {
    ...mapGetters({ credentials: 'teemops/credentials' }),
    hasCredentials(): any {
      if (this.credentials.length > 0) {
        return true
      } else {
        return false
      }
    },
    display_items(): any {
      const items = this.credentials.map((item) => {
        return {
          ...item,
          created_at: this.$formatDate(this.authData(item).createdDate)
        }
      })
      return items
    }
  },
  methods: {
    // formatDate(dateString) {
    //   const date = new Date(dateString)
    //   return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    // },
    authData(credential): any {
      console.log(credential.auth_data)
      return JSON.parse(credential.auth_data)
    }
  },
  data() {
    return {
      title: 'AWS Accounts',
      selected: null,
      headers: [
        {
          text: 'Name',
          value: 'account_name'
        },
        {
          text: 'AWS Account ID',
          value: 'aws_account_id'
        },
        {
          text: 'Type',
          value: 'access_type'
        },
        {
          text: 'Added',
          value: 'created_at'
        },
      ] as Array<TableHeader>,
    }
  },
})
</script>