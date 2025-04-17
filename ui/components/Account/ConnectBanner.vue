<template>
  <div>

    <v-banner single-line @click:icon="alert">
      <v-icon slot="icon" color="warning" size="36">
        mdi-lightning-bolt-circle
      </v-icon>
      <p>
        Create an account with your email address. Once registered
        you will create a connection to your AWS account.
      </p>
      <p>
        The Connection creates a CloudFormation template with restricted IAM
        Account Access. The template can be audited here:
        <a target="_blank"
          href="https://github.com/teemops/teemops/blob/master/cloudformation/iam.role.child.account.cfn.yaml">here on
          Github</a>
      </p>
    </v-banner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>