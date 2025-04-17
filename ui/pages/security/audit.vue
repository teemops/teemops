<template>
    <div>
        <v-tabs v-model="tab" background-color="accent-4" center-active light>

            <v-tab key="new"><v-icon>mdi-noodles</v-icon>&nbsp;Instant</v-tab>
            <v-tab key="essentials"><v-icon>mdi-text-box-check-outline</v-icon>&nbsp;Essentials</v-tab>
            <v-tab key="flow"><v-icon>mdi-hand-cycle</v-icon>&nbsp;Flow</v-tab>

        </v-tabs>
        <v-tabs-items v-model="tab">


            <v-tab-item key="new">
                <v-container>
                    <v-sheet elevation="1" class="pa-4">
                        <v-row>
                            <v-col>
                                <v-card tile>
                                    <v-card-title>Start a New Audit</v-card-title>
                                    <div v-if="hasCredentials">
                                        <v-select v-model="selectedAWSAccount" :items="auditCreds"
                                            item-text="account_name" item-value="user_cloud_provider_id"
                                            label="AWS Account">
                                            <template v-slot:selection="{ item, index }">
                                                <v-chip v-if="index === 0">
                                                    <span>{{ item.account_name }}</span>
                                                </v-chip>
                                                <span v-if="index === 1" class="grey--text caption">(+{{
                                                    selectedAWSAccount.length - 1 }}
                                                    others)</span>
                                            </template>
                                        </v-select>
                                    </div>
                                    <div v-else>
                                        <v-btn color="primary" v-on:click="userMenu">Connect AWS Account (Audit
                                            Option)</v-btn>
                                    </div>

                                    <teem-list title="Select an Audit Type" :items="types" v-model="type"></teem-list>

                                    <v-divider></v-divider>

                                </v-card>
                                <v-card tile>
                                    <v-subheader>If the audit is automated it will start automatically in the
                                        background.</v-subheader>
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

            <v-tab-item key="essentials">
                <v-container>
                    <v-sheet elevation="1" class="pa-4">
                        <v-row>
                            <v-col>
                                <v-card tile>
                                    <v-card-title>Secure with essential controls (COMING SOON)</v-card-title>


                                    <v-divider></v-divider>
                                    <v-subheader>COMING SOON: Secure your AWS Account with default controls including
                                        AWS
                                        Config, Cloudtrail, Public Sharing Disabled and more.</v-subheader>
                                </v-card>
                                <v-card tile>
                                    <v-subheader>Selecting an essential item will install it to your AWS Account in all
                                        active regions.</v-subheader>
                                    <v-card-text>
                                        <v-btn :disabled="true" v-on:click="quickAudit" color="primary">
                                            <v-progress-circular indeterminate color="white" v-if="progress">
                                            </v-progress-circular>
                                            Install
                                        </v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col><v-spacer></v-spacer> </v-col>
                        </v-row>
                    </v-sheet>
                </v-container>
            </v-tab-item>

            <v-tab-item>
                <v-container>
                    <v-sheet elevation="1" class="pa-4">
                        <v-row>
                            <v-col>
                                <v-card tile>
                                    <v-card-title>Flow for continuous risk and compliance auditing (COMING
                                        SOON)</v-card-title>

                                    <v-divider></v-divider>
                                    <v-subheader><b>COMING SOON: Secure your AWS Account with continuous auditing,
                                            giving
                                            you
                                            actionable insights aligned with your compliance
                                            requirements.</b></v-subheader>
                                </v-card>
                                <v-card tile>
                                    <v-subheader>Setup continuous auditing in region of your choice. You can also select
                                        whether this region will be a collector for all regions.</v-subheader>
                                    <v-card-text>
                                        <v-btn :disabled="!showSubmit" v-on:click="quickAudit" color="primary">
                                            <v-progress-circular indeterminate color="white" v-if="progress">
                                            </v-progress-circular>
                                            Setup Flow
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

const AUDIT_TYPE_MAP = {
    'aws-audit': 2,
    's3-audit': 1,
    'iam-audit': 3,
    'custom-audit': 4,
}

export default Vue.extend({
    components: { TeemList, TeemTimePicker, SetupAudit },
    layout: 'dashboard',
    computed: {
        ...mapGetters({ token: 'auth/token' }),
        ...mapGetters({ credentials: 'teemops/credentials' }),
        auditCreds(): any {
            // return [
            //     {
            //         account_name: 'Dev ACME',
            //         user_cloud_provider_id: '123456789101',
            //     },
            //     {
            //         account_name: 'Prod ACME',
            //         user_cloud_provider_id: '123456789102',
            //     }
            // ]
            return this.credentials.filter((cred: any) => cred.access_type == "audit")
        },
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
        closeNotify: function () {
            this.updateMessage('')
        },
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
                value: 1,
                label: 'S3 Audit',
                name: 's3-audit',
                desc: 'Audit S3 Buckets for public access, encryption and more',
            },
            {
                value: 2,
                label: 'Simple Audit (CIS)',
                name: 'aws-audit',
                desc: 'Conduct a CIS Audit that includes IAM, S3, Account, EC2, RDS, CloudTrail, CloudWatch, VPC, and more',
            },
            {
                value: 3,
                label: 'IAM and DNS Audit',
                name: 'iam-audit',
                desc: 'Audit Access Keys, Users, Policies, DNS/Route53 and more',
            },
            {
                value: 4,
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
            tab: 'new',
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