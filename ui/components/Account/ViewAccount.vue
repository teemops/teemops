<template>
  <div>

    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="headline">Security</v-card-title>
              <v-card-text>

                <v-row>
                  <v-col cols="10">
                    <v-btn color="primary" v-on:click="addAWSAccount">
                      <v-progress-circular indeterminate color="white"
                        v-if="waiting == true"></v-progress-circular>Change
                      Password
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>


                  <v-col cols="10">

                    <v-btn color="primary" v-on:click="navMFA">
                      <v-progress-circular indeterminate color="white"
                        v-if="waiting == true"></v-progress-circular>Setup
                      MFA
                      Device
                    </v-btn>

                  </v-col>
                </v-row>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="headline">AWS Accounts</v-card-title>
              <v-card-text> Connect AWS Accounts here
                <p></p>
                <v-btn color="primary" v-on:click="addAWSAccount">
                  <v-progress-circular indeterminate color="white" v-if="waiting == true"></v-progress-circular>Add Ops
                  Account
                </v-btn>
                <!-- <v-text-field readonly v-model="this.mfaSettings.secret" type="text" append-icon="mdi-content-copy"
                  @click:append="copyToClipboard">

                </v-text-field> -->
                <v-btn color="primary" v-on:click="addAWSAuditAccount">
                  <v-progress-circular indeterminate color="white" v-if="waiting == true"></v-progress-circular>Add
                  Audit
                  Account
                </v-btn>
                <list-accounts></list-accounts>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title class="headline">Support</v-card-title>
          <v-card-text>
            <p>Get additional support and help.</p>
            <p></p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ListAccounts from '~/components/AWS/ListAccounts.vue'
import Notify from '~/components/Notify.vue'
import ManageMFA from '~/components/Account/ManageMFA.vue'

const CFN_TEMPLATE =
  `https://console.aws.amazon.com/cloudformation/home?#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.amazonaws.com%2Fstorage.auditaws.com%2Fiam.role.child.account.cfn.yaml&stackName=teemops-dontdelete&param_ParentAWSAccountId=${process.env.aws_parent_account}`
const CFN_AUDIT_TEMPLATE =
  `https://console.aws.amazon.com/cloudformation/home?#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.amazonaws.com%2Fstorage.auditaws.com%2Fiam.role.audit.account.cfn.yaml&stackName=tops-vendor-audit&param_ParentAWSAccountId=${process.env.aws_parent_account}&param_AuditAWSAccountId=${process.env.aws_parent_account}`


export default Vue.extend({
  components: {
    Notify,
    ListAccounts,
    ManageMFA,
  },
  methods: {
    ...mapActions({ generate: 'auth/generate' }),
    copyToClipboard: async function () {
      if (!!navigator.clipboard) {
        await navigator.clipboard.writeText('somerandomtext');
        this.notify('Copied to clipboard')
      } else {
        this.notify('Unable to copy to clipboard. You can manually copy.')
      }
    },
    addAWSAccount: async function () {
      try {
        //connects to topsless and gets unique code and STS token to pass into cloudformation parameters
        const launchCodes = await this.generate()
        this.cfnData = launchCodes
        const cfnUrl = `${CFN_TEMPLATE}&param_ExternalId=${this.cfnData.externalId}&param_UniqueId=${this.cfnData.uniqueId}`
        window.open(cfnUrl, '_blank')
      } catch (e) {
        console.log(e)
      }
    },
    addAWSAuditAccount: async function () {
      try {
        //connects to topsless and gets unique code and STS token to pass into cloudformation parameters
        const launchCodes = await this.generate()
        this.cfnData = launchCodes
        const cfnUrl = `${CFN_AUDIT_TEMPLATE}&param_ExternalId=${this.cfnData.externalId}&param_UniqueId=${this.cfnData.uniqueId}`
        window.open(cfnUrl, '_blank')
      } catch (e) {
        console.log(e)
      }
    },
    navMFA: function () {
      this.$router.push('/mfa')
    },

  },
  data() {
    return {
      cfnData: {} as any,
      waiting: false,
      mfa: false,
      mfaSettings: {
        secret: {} as any,
        token: '',
      },
    }
  },
})
</script>