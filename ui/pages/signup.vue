<template>
  <div>
    <!-- <signup v-if="signupState == 'start'"></signup> -->
    <connect-account v-on:cancel="goHome" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Signup from '~/components/Account/Signup.vue'
import ConnectAccount from '~/components/Account/ConnectAccount.vue'

export default Vue.extend({
  layout: 'signup',
  components: {
    Signup,
    ConnectAccount,
  },
  async mounted() { },
  methods: {
    goHome: function () {
      this.$router.push('/')
    },
  },
  data() {
    var params = this.$route.params
    return {
      signupState: params.subid != undefined ? 'complete' : 'start',
      subscriptionId: params.subid != undefined ? params.subid : null,
    }
  },
})
</script>