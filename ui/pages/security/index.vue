<template>
  <div>
    <v-tabs v-model="tab" background-color="accent-4" center-active light>
      <v-tab key="insights">Insights</v-tab>
      <!-- <v-tab key="start">Setup</v-tab>
       -->
      <v-tab key="new">Quick Audit</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <!-- <v-tab-item key="start">
        <setup-audit></setup-audit>
      </v-tab-item> -->

      <v-tab-item key="insights">
        <security-insights></security-insights>

      </v-tab-item>
      <v-tab-item key="new">
        <v-container>
          <v-sheet elevation="1" class="pa-4">
            <v-row>
              <v-col>
                <v-card tile>
                  <v-card-title>Start a New Audit</v-card-title>
                  <div v-if="hasCredentials">
                    <v-select v-model="selectedAWSAccount" :items="credentials" item-text="account_name"
                      item-value="user_cloud_provider_id" label="AWS Account">
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.account_name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">(+{{ selectedAWSAccount.length - 1 }}
                          others)</span>
                      </template>
                    </v-select>
                  </div>
                  <div v-else>
                    <v-btn color="primary" v-on:click="userMenu">Connect AWS Account</v-btn>
                  </div>

                  <teem-list title="Select an Audit Type" :items="types" v-model="type"></teem-list>

                  <v-divider></v-divider>

                </v-card>
                <v-card tile>
                  <v-subheader>If the audit is automated it will start automatically in the background.</v-subheader>
                  <v-card-text>
                    <v-btn :disabled="!showSubmit" v-on:click="quickAudit" color="primary">
                      <v-progress-circular indeterminate color="white" v-if="progress">
                      </v-progress-circular>
                      Start Scan
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col><v-spacer></v-spacer> </v-col>
            </v-row>
          </v-sheet>
        </v-container>
      </v-tab-item>
    </v-tabs-items>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TeemList from '~/components/Reusable/TeemList.vue'
import TeemTimePicker from '~/components/Reusable/TeemTimePicker.vue'
import ListItem from '~/types/ListItem'
import SetupAudit from '~/components/Security/SetupAudit.vue'
import SecurityInsights from '~/components/Security/SecurityInsights.vue'

const AUDIT_TYPE_MAP = {
  'aws-audit': 2,
  's3-audit': 1,
  'iam-audit': 3,
  'custom-audit': 4,
}

export default Vue.extend({
  components: { TeemList, TeemTimePicker, SetupAudit, SecurityInsights },
  layout: 'dashboard',
  computed: {
    ...mapGetters({ token: 'auth/token' }),
    ...mapGetters({ credentials: 'teemops/credentials' }),
    hasCredentials(): any {
      if (this.credentials.length > 0) {
        return true
      } else {
        return false
      }
    },
    showSubmit(): Boolean {
      if (this.type != undefined && this.selectedAWSAccount != undefined) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    ...mapActions({ updateMessage: 'updateNotify' }),
    ...mapActions({ audit: 'teemops/topsless' }),
    userMenu: async function () {
      this.$router.push('/user')
    },
    quickAudit: async function () {
      console.log('quick audit')
      this.progress = true
      try {
        const params = {
          user_cloud_provider_id: this.selectedAWSAccount,
          audit_type: AUDIT_TYPE_MAP[this.type],
        };
        var result = await this.audit({
          path: 'audit/start',
          data: params,
          token: this.token,
        })
        if (result.success == true) {
          this.progress = false
          this.updateMessage('Audit has started, results will show up in Insights tab once completed.')
          //switch insights tab
          this.tab = 'insights'
        }
      } catch (e) {
        console.log(e)
        this.progress = false
      }
      this.progress = false
    },
  },
  data() {
    var dismiss = parseInt(localStorage.getItem('dismiss') || '0')
    var types = [
      {
        label: 'S3 Audit',
        name: 's3-audit',
        desc: 'Audit S3 Buckets for public access, encryption and more',
      },
      {
        label: 'Simple Audit (CIS)',
        name: 'aws-audit',
        desc: 'Conduct a CIS Audit that includes IAM, S3, Account, EC2, RDS, CloudTrail, CloudWatch, VPC, and more',
      },
      {
        label: 'IAM Audit',
        name: 'iam-audit',
        desc: 'Audit Access Keys, Policies and more',
      },
      {
        label: 'Custom Audit',
        name: 'custom-audit',
        desc: 'Order a Custom Audit for Compliance',
      },
    ]
    var scheduleTypes = [
      {
        label: 'Daily',
        name: 'daily',
      },
      {
        label: 'Weekly',
        name: 'weekly',
      },
      {
        label: 'Monthly',
        name: 'monthly',
      },
    ]
    return {
      progress: false,
      tab: 'insights',
      selectedAWSAccount: null,
      awsAccounts:
        [
          {
            id: '123456789101',
            name: 'Dev ACME',
          },
          {
            id: '123456789102',
            name: 'Prod ACME',
          },

        ],
      weekDays: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      dismiss: dismiss,
      types: types,
      scheduleTypes: scheduleTypes,
      type: null,
      schedule: null,
      currentSchedule: {
        name: '',
        type: 'daily',
        time: null,
      },
    }
  },
  // methods: {
  //   ...mapActions([''])
  // }
})
</script>
