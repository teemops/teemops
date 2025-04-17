<template>
  <div>
    <v-container>
      <v-sheet elevation="1" class="pa-4">
        <v-row justify="center" align="top">
          <v-col cols="12" sm="3" md="4">
            <v-card>
              <v-card-title class="headline">Add new Backup</v-card-title>
              <v-card-text> Add a new backup task </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"> Add</v-btn>
              </v-card-actions>
            </v-card>
            <v-card>
              <v-card-title class="headline"
                >View Existing Backups</v-card-title
              >
              <v-card-text> Add a new backup task </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"> Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
    <v-tabs background-color="primary accent-4" center-active dark>
      <v-tab>Type</v-tab>
    </v-tabs>
    <v-container>
      <v-sheet elevation="1" class="pa-4">
        <v-toolbar color="white" flat>
          <v-toolbar-title class="grey--text text--darken-4">
            Backups
          </v-toolbar-title>
        </v-toolbar>
        <v-row>
          <v-col>
            <v-card tile>
              <v-card-title>Create a New Backup</v-card-title>
              <teem-list
                title="Select a Backup Type"
                :items="types"
                v-model="type"
              ></teem-list>

              <v-divider></v-divider>
              <teem-list
                title="Schedule"
                :items="scheduleTypes"
                v-model="currentSchedule.type"
              ></teem-list>

              <v-select
                multiple
                v-if="currentSchedule.type == 'weekly'"
                :items="weekDays"
                filled
                label="Select day of week"
              ></v-select>
              <teem-time-picker
                v-model="currentSchedule.time"
                label="Select Time"
              ></teem-time-picker>
            </v-card>
            <v-card tile>
              <v-subheader>Select Retention</v-subheader>
              <v-card-text>
                <p>
                  This will determine how long or how many copies you want to
                  keep.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col><v-spacer></v-spacer> </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TeemList from '~/components/Reusable/TeemList.vue'
import TeemTimePicker from '~/components/Reusable/TeemTimePicker.vue'
import ListItem from '~/types/ListItem'

export default Vue.extend({
  components: { TeemList, TeemTimePicker },
  layout: 'dashboard',

  data() {
    var dismiss = parseInt(localStorage.getItem('dismiss') || '0')
    var types = [
      {
        label: 'AWS Backup',
        name: 'aws-backup',
        desc: 'AWS Backup service is an AWS native service',
      },
      {
        label: 'S3 Backup',
        name: 's3-backup',
        desc: 'S3 Backups are configured by a lifecycle rule',
      },
      {
        label: 'Data Lifecycle (EBS & AMIs)',
        name: 'dlm-backup',
        desc: 'Amazon DLM is a service that manages EBS Snapshots',
      },
      {
        label: '3rd Party Backup',
        name: 'third-backup',
        desc: 'You can configure a 3rd party backup product such as Veam',
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
      type: 'dlm-backup',
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
