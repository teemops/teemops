<template>
  <v-container>

    <v-form ref="form" v-model="formValid" v-on:submit.prevent="">
      <v-row class="justify-center">
        <v-col cols="4">
          <v-card>
            <v-card-title class="headline"> Setup MFA Device </v-card-title>
            <v-card-text>
              <p><v-icon color="info" icon="mdi-information" size="x-large"></v-icon>
                Setup MFA to provide an additional layer of verifying your identity when you login.</p>
              <v-row>
                <v-col cols="1">

                  <v-badge color="info" content="1" inline></v-badge>

                </v-col>
                <v-col cols="10">
                  Install either Google Authenticator or Authy on your mobile device.
                </v-col>
              </v-row>
              <div v-if="mfa">
                <v-row>
                  <v-col cols="1">
                    <v-badge color="info" content="2" inline></v-badge>
                  </v-col>
                  <v-col cols="10">
                    <p>Use your virtual MFA app or your devices camera to scan the QR code.</p>
                    <qrcode-vue size="245" :background="colors.offwhite" :foreground="colors.niceblue"
                      :value="this.mfaSettings.secret"></qrcode-vue>

                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1">
                    <v-badge color="info" content="3" inline></v-badge>
                  </v-col>
                  <v-col cols="10">
                    <p><a v-on:click="showHideSecret">Show secret key</a> if you can't scan the above QR code.</p>
                    <p v-if="show">
                      <v-text-field readonly v-model="this.mfaSettings.secret" type="text" append-icon="mdi-content-copy"
                        @click:append="copyToClipboard">

                      </v-text-field>
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1">
                    <v-badge color="info" content="4" inline></v-badge>
                  </v-col>
                  <v-col cols="6">
                    <p>Enter the six digit code from your authenticator app.</p>
                    <v-otp-input :disabled="verified" v-model="verifyCode" :length="6" :type="'number'" class="sm"
                      v-on:finish="verifyMFA"></v-otp-input>
                    <v-progress-circular indeterminate color="primary" v-if="waiting == true"></v-progress-circular>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
            <v-card-actions>
              <a v-on:click="cancel">Cancel</a>
              <v-spacer />
              <v-btn color="primary" v-on:click="complete" :disabled="!verified">
                <v-progress-circular indeterminate color="white" v-if="waiting == true"></v-progress-circular>
                Complete Setup
              </v-btn>


            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import QrcodeVue from 'qrcode.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  components: {
    QrcodeVue,
  },
  mounted: async function () {
    console.log('mounted')
    await this.addMFA()
  },
  methods: {
    ...mapActions({ generateMFA: 'auth/generateMFA' }),
    ...mapActions({ verify: 'auth/verifyMFA' }),
    ...mapActions({ notify: 'updateNotify' }),
    cancel: function () {
      this.$router.push('/user')
    },
    complete: function () {
      this.$router.push('/user')
    },
    showHideSecret: function () {
      this.show = !this.show
    },
    copyToClipboard: async function () {
      if (!!navigator.clipboard) {
        await navigator.clipboard.writeText(this.mfaSettings.secret);
        this.notify('Copied to clipboard')
        this.showHideSecret()
      } else {
        this.notify('Unable to copy to clipboard. You can manually copy.')
      }
    },
    addMFA: async function () {
      try {
        //connects to mfa-auth service and generates a new MFA token
        const getMFASecret = await this.generateMFA()

        if (getMFASecret.success) {
          this.mfaSettings.secret = getMFASecret.base32
          this.mfa = true
        } else {
          this.mfa = false
          throw getMFASecret.message
        }

      } catch (e) {
        if (e == 'OTP already verified.') {
          this.notify('MFA is already setup. If you need to disable it please contact support under My Account.')
        } else {
          this.notify(e)
        }

      }
    },
    verifyMFA: async function () {
      try {
        this.waiting = true
        //connects to mfa-auth service and verifies a new MFA token
        const getMFASecret = await this.verify({ otp: this.verifyCode })
        if (getMFASecret.success == true) {
          this.verified = true
          this.waiting = false
          this.notify('MFA was successfully verified.')
        } else {
          throw 'OTP was not verified. Please try again.'
        }
      } catch (e) {
        this.verifyCode = ''
        this.waiting = false
        this.notify(e)
      }
    },
  },
  data() {
    return {
      colors: {
        lightblue: '#00bfff',
        offwhite: '#f5f5f5',
        niceblue: '#0077b3',
      },
      formValid: true,
      step: 1,
      steps: [
        'Scan QR Code',
        'Verify Code',
        'Complete',
      ],
      mfaSettings: {},
      verifyCode: '',
      mfa: false,
      show: false,
      waiting: false,
      verified: false
    }
  },
})
</script>
<style lang="sass" scoped>
$otp-input-content-height: 12px
</style>