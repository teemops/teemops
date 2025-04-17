<template>
  <div>
    <div v-if="isAuditProduct">
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-card>
            <v-card-title class="headline">Secure your AWS Account</v-card-title>
            <v-card-text>
              <p>
                Signup and Connect your AWS Account so you can audit your AWS account and get insights and
                recommendations
                to improve
                your AWS security posture.
              </p>
              <p><b>Follow the steps below to complete:</b>
              <ol>
                <li>Signup with your email. </li>
                <li>Launch the CloudFormation template in your AWS Account. (Automatically opens a new window after
                  signup)</li>
                <li>Check back here after a few minutes once you've logged in and launched the AWS template.</li>
              </ol>
              </p>
              <p>If you already have an account you can <a v-on:click="login"><b>login here</b></a>.</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" v-on:click="register">Signup</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-card v-if="!dismiss">
            <v-card-title class="headline"> Welcome to the SCG </v-card-title>
            <v-card-text>
              <p>
                With the Simple Cloud Generator you can generate a
                CloudFormation template, cli command and CDK code that can then be deployed into your AWS
                account.
              </p>
              <p><b>Follow the steps below to complete:</b>
              <ol>
                <li>Select a resource you want to launch</li>
                <li>Choose the region</li>
                <li>Enter any required fields or optional ones</li>
                <li>Launch into your AWS Account by clicking on the link or copying the cli command into your terminal*
                </li>
                <li>Download the source code for the template (optional)</li>
              </ol>
              </p>
              <p>
                You'll need to create a subnet, security group and EC2 key pair before launching.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" v-on:click="dismissLocal"> Dismiss </v-btn>
            </v-card-actions>
          </v-card>

        </v-col>
      </v-row>
      <v-row v-if="!isAuditProduct" justify="center" align="center">
        <v-col cols="auto">
          <generator id="main-generator"></generator>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Generator from '~/components/Generator.vue'

export default Vue.extend({
  name: 'home',
  layout: 'simple',
  components: {
    Generator,
  },
  mounted() {
    console.log('This is index.vue mounted')
  },
  computed: {
    isAuditProduct: function () {

      return process.env.is_product_audit
    },
  },
  methods: {
    register: async function () {
      this.$router.push('/signup')
    },
    login: async function () {
      this.$router.push('/login')
    },
    /**
     * persist dismiss value
     */
    dismissLocal: async function () {
      this.dismiss = 1
      localStorage.setItem('dismiss', '1')
    },
  },
  data() {
    var dismiss = parseInt(localStorage.getItem('dismiss') || '0')
    return {
      dismiss: dismiss,
    }
  },
  // methods: {
  //   ...mapActions([''])
  // }
})
</script>
