<template>
  <v-app dark>
    <v-app-bar fixed app>
      <nuxt-link to="/"><img src="~/assets/teemops-logo.png" height="40px" /></nuxt-link>

      <v-spacer />
      <b>Teemops</b>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
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
            href="https://forms.office.com/r/WGFL5is14v">
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

export default Vue.extend({
  components: {
    AccountMenu,
  },
  computed: {
    ...mapGetters({ token: 'auth/token' }),
    ...mapGetters({ user: 'auth/user' }),
    ...mapGetters({ beenHere: 'auth/beenHere' }),
  },
  /**
   * When vue is mounted we need to check login state
   */
  async mounted() {
    console.log('This is simple.vue mounted')
    try {
      //check if user has loggedin and been here (e.g. in this browser before)
      if (this.beenHere) {
        //first check if we can access account details
        const check = await this.getUser()
        this.status = check
      }
    } catch (e) {
      this.status = false
    } finally {
      this.checkComplete = true
    }
  },
  methods: {
    ...mapActions({ getUser: 'auth/getUser' }),
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
