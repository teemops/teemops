<template>
  <div>

    <div v-if="hasCredentials">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">AWS Account ID</th>
              <th class="text-left">AWS Account Type</th>
              <th class="text-left">Added</th>
              <!-- <th class="text-left">AWS Account Alias</th>
              <th class="text-left">AWS Account Status</th>
              
              <th class="text-left">AWS Account Updated</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="credential in credentials" :key="credential.user_cloud_provider_id">
              <td>{{ credential.aws_account_id }}</td>
              <td>{{ credential.access_type }}</td>
              <td>{{ formatDate(authData(credential).createdDate) }}</td>
              <!-- <td>{{ credential.aws_account_alias }}</td>
              <td>{{ credential.aws_account_status }}</td>
              <td>{{ credential.created_at }}</td>
              <td>{{ credential.updated_at }}</td> -->
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({ credentials: 'teemops/credentials' }),
    hasCredentials(): any {
      if (this.credentials.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    authData(credential): any {
      console.log(credential.auth_data)
      return JSON.parse(credential.auth_data)
    }
  },
})
</script>