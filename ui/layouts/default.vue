<template>
  <v-app dark>
    <v-app-bar fixed app>
      <nuxt-link to="/"><img src="~/assets/teemops-logo.png" height="40px" /></nuxt-link>

      <v-spacer />
      <b>Teemops</b>
      <v-spacer />
      <account-menu v-if="status != null" :status="status" v-on:logout="logoutAction"></account-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <notify :message="message" v-if="message" v-on:close="closeNotify" />
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :padless="true">
      <v-card flat tile width="100%" class="secondary lighten-1 text-center">
        <v-card-text class="white--text">
          <strong>Teemops &copy; Copyright</strong> Ben Fellows & Teem Services Limited
          {{ new Date().getFullYear() }}
          &nbsp;
          <a target="_blank" class="secondary" style="text-decoration: none"
            href="https://forms.office.com/r/Hg9DZeSfHD">
            <v-btn class="white">Feedback</v-btn>
          </a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AccountMenu from '../components/Account/AccountMenu.vue'
import Notify from '~/components/Notify.vue'

export default Vue.extend({
  components: {
    AccountMenu,
    Notify
  },
  computed: {
    ...mapGetters({ message: 'notify' }),
    ...mapGetters({ token: 'auth/token' }),
    ...mapGetters({ user: 'auth/user' }),
    ...mapGetters({ beenHere: 'auth/beenHere' }),
  },
  /**
   * When vue is mounted we need to check login state
   */
  async mounted() {
    console.log('This is default layout mounted')
    try {
      //check if user has loggedin and been here (e.g. in this browser before)
      if (this.beenHere) {
        //first check if we can access account details
        const check = await this.getUser()
        this.status = check
        if (check) {
          await this.topsCredentials()
        } else {
          this.$router.push('/login')
        }
      } else {
        this.status = false
      }
    } catch (e) {
      this.status = false
    } finally {
      this.checkComplete = true
    }
  },
  methods: {
    ...mapActions({ updateMessage: 'updateNotify' }),
    ...mapActions({ getUser: 'auth/getUser' }),
    ...mapActions({ topsCredentials: 'teemops/credentials' }),
    closeNotify: function () {
      this.updateMessage('')
    },
    async logoutAction() {
      console.log('Event Logout emitted')
      this.status = false
      this.$forceUpdate()
    },
    async loginAction() {
      console.log('Event Login emitted')
      try {
        //first check if we can access account details
        const check = await this.getUser()
        this.status = check
      } catch (e) {
        this.status = false
      }
      this.$forceUpdate()
    },
  },
  data() {
    return {
      title: 'SCG - Simple Cloud Generator',
      status: null,
      checkComplete: false,
    }
  },
})
</script>
