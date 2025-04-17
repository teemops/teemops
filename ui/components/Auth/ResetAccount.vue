<template>
  <div>
    <v-form ref="form" v-model="formValid" v-on:submit.prevent="">
      <v-card>
        <v-card-title class="headline">Reset password</v-card-title>
        <v-card-text>
          <p>Please enter your email address for a reset code.</p>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Enter email address" type="email" :rules="emailValidation" v-model="email"
                :disabled="showVerify || showPass"></v-text-field>
              <v-text-field v-if="showVerify" label="Enter code" :rules="verifyValidation"
                v-model="verifyCode"></v-text-field>
              <v-text-field type="password" label="Enter password" :rules="passValidation" v-model="password"
                v-if="showPass"></v-text-field>
              <v-text-field v-if="showPass" type="password" label="Enter password" :rules="cpassValidation"
                v-model="cpassword"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <a v-on:click="cancelReset">Cancel</a>
          <v-spacer />

          <v-btn color="primary" :disabled="disableReset || !formValid" v-on:click="resetEmail">
            <v-progress-circular indeterminate color="white" v-if="waiting == true"></v-progress-circular>
            {{ buttonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Notify from '~/components/Notify.vue'

const NO_SPACES_REGEX = /^([A-z])*[^\s]\1*$/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const NUMBER_REGEX = /^([0-9])*[^\s]\1*$/

export default Vue.extend({
  components: {
    Notify,
  },
  data() {
    return {
      formStep: 1,
      buttonText: 'Send Code',
      authenticated: false,
      message: '',
      waiting: false,
      test: false,
      formValid: false,
      accountExists: false,
      email: '',
      password: '',
      cpassword: '',
      verify: false,
      verifyCode: null,
      emailValidation: [
        (v: any) => !!v || 'This field is required',
        (v: any) => EMAIL_REGEX.test(v) || 'Must be a valid email address',
      ],
      passValidation: [
        (v: any) => !!v || 'This field is required',
        (v: any) =>
          !NO_SPACES_REGEX.test(v) || 'No spaces are allowed in password',
        (v: any) =>
          (v.length >= 8 && v.length <= 50) ||
          'Password must be from 8-50 characters',
      ],
      cpassValidation: [
        (v: any, password: any = this.password) =>
          v === password || 'Confirmation Password needs to match',
      ],
      verifyValidation: [
        (v: any) => !!v || 'Must be a valid 6 digit code',
        (v: any) =>
          (NUMBER_REGEX.test(v) && v.length == 6) ||
          'Must be a valid 6 digit code',
      ],
    }
  },
  methods: {
    ...mapActions({ reset: 'auth/reset' }),
    ...mapActions({ completeReset: 'auth/completeReset' }),
    ...mapActions({ updateMessage: 'updateNotify' }),
    ...mapActions({ cancelReset: 'auth/clear' }),
    cancel: function () {
      this.$parent.$emit('cancel')
    },
    clearUser: function () {
      this.email = ''
      this.password = ''
      this.cpassword = ''
      this.verifyCode = null
      this.verify = false
    },
    resetEmail: function () {
      switch (this.formStep) {
        case 1:
          this.sendResetCode()
          break
        case 2:
          this.verifyResetCode()
          break
      }
    },
    sendResetCode: function () {
      const result = this.reset(this.email)
      if (result) {
        this.verify = true
        this.buttonText = 'Reset Password'
        this.formStep = 2
      } else {
        this.updateMessage('Failed to send reset code, please try again.')
        this.verify = false
      }
    },
    verifyResetCode: function () {
      const result = this.completeReset({
        email: this.email,
        code: this.verifyCode,
        newPassword: this.password,
      })
      if (result) {
        this.updateMessage('Password reset successfully')
        this.clearUser()
        this.$router.push('/login')
      } else {
        this.updateMessage('Failed to reset password, please try again.')
      }
    },
    resetPass: function (stage) {

      switch (stage) {
        case 1:
          this.resetEmail()
          break
        case 2:
          this.completeReset()
          break
      }

    },
  },
  computed: {
    ...mapGetters({ token: 'auth/token' }),
    showPass(): any {
      return this.verifyCode != null && this.verifyCode.length == 6
    },

    disableReset(): any {
      switch (this.formStep) {
        case 1:
          return this.email == null || this.email.length == 0
        case 2:
          if (
            this.password != null &&
            this.password.length >= 8 &&
            this.password.length <= 100 &&
            this.password === this.cpassword
          ) {
            return false
          } else {
            return true
          }
      }

    },
    showVerify(): any {
      return this.verify
    },
  },
})
</script>