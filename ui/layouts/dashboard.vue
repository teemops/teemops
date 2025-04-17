<template>
  <v-app dark>
    <v-navigation-drawer app dark permanent>
      <template v-slot:prepend>
        <div class="pa-2 text-center">
          <br />
          <img src="~/assets/site-logo.png" height="40px" />
        </div>
      </template>
      <v-list>
        <div v-for="item in navitems" :key="id">
          <v-list-group v-if="item.subitems" v-model="item.active">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="subitem in item.subitems" :key="subitem.id" link :to="subitem.to">
              <v-list-item-icon>
                <v-icon>{{ subitem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ subitem.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else link :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>

      <template v-slot:append>
        <div class="pa-2 text-center">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar fixed app>

      <v-spacer /><a target="_blank" style="color: #fff; text-decoration: none"
        href="https://forms.office.com/r/Hg9DZeSfHD">
        <v-btn class="secondary">Get Support</v-btn></a>
      <v-spacer />
      <account-menu v-if="status != null" :status="status" v-on:logout="logoutAction"></account-menu>
    </v-app-bar>
    <v-main>
      <notify :message="message" v-if="message" v-on:close="closeNotify" />
      <nuxt />
    </v-main>
  </v-app>
</template>

<style lang="css">
h2 {
  margin-left: 15px;
  font-size: 1.1em;
  color: #3c3c3c;
}

h3 {
  margin-top: 10px;
  font-size: 1em;
  color: #3c3c3c;

}

.v-card .v-list .v-list-item .v-chip {
  margin-right: 5px;
  margin-bottom: 5px;
}

.v-chip a {
  color: #fff;
  text-decoration: none;
}

.v-card .v-list-item__content {
  padding: 5px 0 0 0;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AccountInfo from '~/components/Account/AccountInfo.vue'
import Breadcrumb from '~/components/Reusable/Breadcrumb.vue'
import AccountMenu from '../components/Account/AccountMenu.vue'
import Notify from '~/components/Notify.vue'

export default Vue.extend({
  name: 'dashboard',
  components: {
    AccountInfo,
    Breadcrumb,
    AccountMenu,
    Notify,
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
    console.log('This is dashboard.vue mounted')
    try {
      //check if user has loggedin and been here (e.g. in this browser before)
      if (this.beenHere) {
        //first check if we can access account details
        const check = await this.getUser()
        this.status = check
        if (check) {
          await this.topsCredentials({ token: this.token })
        } else {
          this.$router.push('/login')
        }
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
  },
  data() {
    return {
      title: 'Teemops Console',
      rightDrawer: true,
      right: true,
      status: null,
      breadcrumbs: [
        {
          text: 'Teem Ops',
          disabled: false,
          href: 'dashboard',
        },
        // {
        //   text: 'My Apps',
        //   disabled: false,
        //   href: 'apps/',
        // },
        // {
        //   text: 'Create App',
        //   disabled: true,
        //   href: 'breadcrumbs_link_2',
        // },
      ],
      navitems: [
        {
          id: 'dashboard',
          icon: 'mdi-home',
          text: 'Dashboard',
          to: '/dashboard'
        },
        {
          id: 'security',
          expanded: true,
          icon: 'mdi-server-security',
          text: 'Security',
          subitems: [
            {
              id: 'insights',
              icon: 'mdi-chart-timeline-variant-shimmer',
              text: 'Insights',
              to: '/security/insights',
            },
            {
              id: 'audit',
              icon: 'mdi-cloud-check',
              text: 'Audit',
              to: '/security/audit'
            },
            {
              id: 'findings',
              icon: 'mdi-binoculars',
              text: 'Findings',
              to: '/security/findings'
            },
          ],
        },
      ],
    }
  },
})
</script>
