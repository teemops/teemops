<template>
  <div>
    <v-card loading="true" v-if="show == 'loading'" width="800">
      <template slot="progress">
        <v-progress-linear color="primary" height="10" indeterminate></v-progress-linear>
      </template>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="8" md="10">
            <p>Loading cloud platform...</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-form ref="form" v-if="show == 'start'" v-model="formValid">
      <v-card fluid ma-0 pa-0 fill-height style="width:100%">

        <v-card-title class="headline">
          Launch an AWS Resource
          <v-spacer />

          <div v-if="hasCredentials">
            <v-select v-model="cloud.accountid" :items="credentials" item-text="aws_account_id"
              item-value="user_cloud_provider_id" label="AWS Account"></v-select>
          </div>
          <div v-else>
            <v-btn color="primary" v-on:click="upgrade">Connect AWS Account</v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="6" sm="4" md="6">
              <v-select v-model="cloud.resource" :items="resources" item-text="description" item-value="name"
                label="Select resource to launch" v-on:change="updateDisplay">
              </v-select>

              <v-select v-model="cloud.os" :items="oses" item-text="name" item-value="id" label="Select OS to launch"
                v-on:change="updateDisplay" :disabled="!hasOS">
              </v-select>
            </v-col>
            <v-col cols="6" sm="4" md="6">
              <v-select v-model="cloud.region" :items="regions" item-text="name" item-value="id"
                label="Select region to launch into" v-on:change="updateDisplay">
                <template slot="item" slot-scope="data">
                  <!-- HTML that describes how select should render items when the select is open -->

                  {{ data.item.name }} - {{ data.item.description }}
                </template>
              </v-select>

              <a target="_blank" :href="`${baseGH}${cloud.resource}.cfn.yaml`">
                <v-btn>View Template</v-btn>
              </a>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-alert type="info" close-text="Close Alert">
                <h3>Before Launch check...</h3>
                <ul>
                  <li>the tooltips below under each field to ensure you have
                    the correct settings.</li>
                </ul>
                <br />{{ instruction }}
              </v-alert>
            </v-col>
            <v-col v-for="opt in formFields" cols="6">
              <div>
                <v-checkbox v-if="opt.type === 'boolean'" :label="opt.description" v-model="parameters[opt.name]">
                </v-checkbox>
                <v-text-field v-if="opt.type === 'string'" :label="opt.description" :rules="opt.validation"
                  v-model="parameters[opt.name]"></v-text-field>
                <v-text-field v-if="opt.type === 'password'" :label="opt.description" :rules="opt.validation"
                  v-model="parameters[opt.name]" type="password"></v-text-field>
                <v-text-field v-if="opt.type === 'integer'" :label="opt.description" :rules="opt.validation"
                  v-model="parameters[opt.name]"></v-text-field>
                <v-select v-if="opt.type === 'list'" :label="opt.description" :items="opt.values"
                  :item-text="opt.textPath" :item-value="opt.valuePath" v-model="parameters[opt.name]"
                  :multiple="opt.multiple ? opt.multiple : false">
                  <template slot="selection" slot-scope="data">
                    <!-- HTML that describe how select should render selected items -->

                    {{
      data.item.name
        ? `${data.item.name} - ${data.item.id}`
        : data.item.id
          ? data.item.id
          : data.item
    }}
                  </template>
                  <template slot="item" slot-scope="data">
                    <!-- HTML that describe how select should render items when the select is open -->
                    {{
        data.item.name
          ? `${data.item.name} - ${data.item.id}`
          : data.item.id
            ? data.item.id
            : data.item
      }}
                  </template>
                </v-select>
                <span v-if="opt.tooltip != undefined">
                  <a target="_blank" :href="`https://console.aws.amazon.com${opt.tooltip.link(
      cloud.region
    )}`">{{ opt.tooltip.text }}</a>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :disabled="!formValid" v-on:click="generateTemplate">
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-divider></v-divider>

    <v-card v-if="show == 'generate'" width="800">
      <v-card-title class="headline"> Details </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="8" md="10">
            <p>

            </p>
            <p>
              <v-textarea filled name="cli" label="AWS CLI Command" :value="cliCommand"></v-textarea>
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" v-on:click="show = 'start'"> Edit </v-btn>
        <v-spacer />
        <v-btn color="primary" v-on:click="launchCfn">Launch CloudFormation
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import search from '~/static/data/search'
var s = search()

import ResourceOption from '../types/ResourceOption'
import ViewTemplate from '~/components/ViewTemplate.vue'
import ConnectAccount from '~/components/Account/ConnectAccount.vue'
const showOptions = {
  loading: 'loading',
  start: 'start',
  generate: 'generate',
  connect: 'connect',
}

const regions = require('~/assets/data/regions.json')
const instanceTypes = require('~/assets/data/instance_types')

const NO_SPACES_REGEX = /^([A-z])*[^\s]\1*$/
const SPACES_REGEX = /^\S*$/


export default Vue.extend({
  props: {
    id: { type: String, required: true } as PropOptions<String>,
  },
  components: {
    ViewTemplate,
    ConnectAccount,
  },
  async mounted() {
    try {
      //check if user has loggedin and been here (e.g. in this browser before)
      console.log("mounting Generator.vue")
      if (this.beenHere) {
        //first check if we can access account details
        const check = await this.getUser()
        if (check) {
          await this.topsCredentials()
          if (this.credentials.length > 0) {
            this.cloud.accountid = this.credentials[0].user_cloud_provider_id
          }

          this.show = showOptions.start
        } else {
          this.show = showOptions.start
          this.$router.push('/login')
        }
      }

      const result = await this.$axios.$get(
        `${process.env.topsless_api}templates`
      )
      this.oses = result.templates
      this.configureDefaults()
    } catch (e) {
      console.log('error with request to amis')
    }
    this.show = showOptions.start
  },
  methods: {
    ...mapActions({ getUser: 'auth/getUser' }),
    ...mapActions({ topsGet: 'teemops/get' }),
    ...mapActions({ topsPost: 'teemops/post' }),
    ...mapActions({ topsCredentials: 'teemops/credentials' }),
    upgrade: async function () {
      this.$router.push('/signup')
    },
    launchCfn: function () {

      window.open(this.templateUrl, '_blank');
    },
    dismissConnectLocal: async function () {
      this.dismissConnect = 1
      localStorage.setItem('dismissConnect', '1')
    },
    generateTemplate: function () {
      this.generate = true
      this.show = showOptions.generate
      if (Object.keys(this.parameters).length > 0) {
        const resourceOptions: Array<ResourceOption> = this.resourceOptions

        const baseUrl =
          'https://console.aws.amazon.com/cloudformation/home?region='
        var teemopsTemplateUrl =
          'https%3A%2F%2Fstorage.auditaws.com.s3.amazonaws.com%2F'
        let globalParameters = this.parameters
        var paramString: string = ''

        Object.keys(this.parameters).forEach((key) => {
          //check if parameter is in resourceOptions array
          if (
            resourceOptions.find((option) => option.name == key) != undefined
          ) {
            paramString += `&param_${key}=${globalParameters[key]}`
          }
        })

        this.templateUrl = `${baseUrl}${this.cloud.region}#/stacks/quickcreate?templateUrl=${teemopsTemplateUrl}${this.cloud.resource}.cfn.yaml&stackName=teemops-${this.parameters.AppName}-stack${paramString}`
        //now generate cli command
        paramString = ''
        Object.keys(this.parameters).forEach((key) => {
          if (
            resourceOptions.find((option) => option.name == key) != undefined
          ) {
            if (!SPACES_REGEX.test(globalParameters[key])) {
              paramString += ` ParameterKey=${key},ParameterValue=\\"'${globalParameters[key]}'\\"`
            } else {
              paramString += ` ParameterKey=${key},ParameterValue=\\"${globalParameters[key]}\\"`
            }
          }
        })
        teemopsTemplateUrl =
          'https://storage.auditaws.com.s3.amazonaws.com/'
        this.cliCommand = `aws cloudformation create-stack --region ${this.cloud.region}  --capabilities CAPABILITY_IAM --stack-name teemops-${this.parameters.AppName}-stack --template-url ${teemopsTemplateUrl}${this.cloud.resource}.cfn.yaml --parameters${paramString}`
      } else {
        this.templateUrl = 'https://nourlyet'
      }
    },
    /**
     * Updates hidden fields values
     * e.g AMI is updated
     */
    updateDisplay: async function () {
      try {
        if (this.cloud.os != null) {
          this.configureDefaults()
          switch (this.cloud.resource) {
            case 'dynamo':
              break
            default:
              await this.configureEC2()
          }
        }
      } catch (e) {
        console.log('Error with updating display')
      }
    },
    configureDefaults() {
      var resourceOptions: Array<ResourceOption> = this.resourceOptions
      resourceOptions.forEach((option: ResourceOption) => {
        if (option.default && this.parameters[option.name] == null) {
          this.parameters[option.name] = option.default
        }
      })
    },
    configureEC2: async function () {
      this.parameters.HasPublicIp =
        this.parameters.HasPublicIp == 1 ? true : false

      if (this.cloud.resource == 'ec2') {
        this.parameters.HasElasticIp = this.parameters.HasElasticIp || false
      } else {
        try {
          delete this.parameters.HasElasticIp
        } catch (e) { }
      }
      if (this.cloud.os != '') {
        const data = {
          region: this.cloud.region,
          cloud_provider: 1,
          app_provider: this.cloud.os,
        }
        const result = await this.$axios.$post(
          `${process.env.topsless_api}amis/view`,
          data
        )
        this.parameters.AMI = result.amis.ami
      }
    },
    showSection: async function (resourceName: any) {
      return this.cloud.resource == resourceName
    },
  },
  computed: {
    ...mapGetters({ token: 'auth/token' }),
    ...mapGetters({ credentials: 'teemops/credentials' }),
    ...mapGetters({ beenHere: 'auth/beenHere' }),
    instruction(): any {
      let currentResourceName = this.cloud.resource
      console.log(s.instructions)

      return s.instructions.filter(function (item) {
        console.log(`Filter for instruction ${item.resource}`)
        return item.resource === currentResourceName
      })[0].instructions;
    },
    hasOS(): any {
      let currentResourceName = this.cloud.resource
      if (['ec2', 'asg', 'asg.alb'].filter(function (res) {
        return res == currentResourceName
      }).length > 0) {
        return true
      } else {
        return false
      }
    },
    /**
     * TODO: Show Allowed Regions for currently selected Resource Type
     * For certain templates and services e.g. CDN
     * We want the regions to be limited based on what is required
     */
    allowedRegions(): any {

    },
    hasCredentials(): any {
      if (this.credentials.length > 0) {
        return true
      } else {
        return false
      }
    },
    /**
     * Returns list of options for the given cloud.resource (e.g. ec2, asg, rds etc...)
     */
    resourceOptions(): any {
      let currentResourceName = this.cloud.resource
      var currentOptions = this.options.filter(function (option) {
        return (
          option.resources == undefined ||
          option.resources.indexOf(currentResourceName) > -1
        )
      })

      return currentOptions
    },
    formFields(): any {
      let currentResourceName = this.cloud.resource
      var currentOptions = this.options.filter(function (option) {
        return (
          option.resources != undefined &&
          option.type != 'placeholder' &&
          option.resources.indexOf(currentResourceName) > -1
        )
      })

      currentOptions.forEach(async (option: any, index) => {
        if (option['dynamic'] != undefined) {
          try {
            if (this.cloud.accountid != undefined) {
              console.log(this.cloud.region)
              //e.g. tihs will equal name of return data from AWS APIs e.g. Subnets
              const itemIdentifier = option['dynamic']['items']
              //id is used to identify the fieldname that will become the id
              const idIdentifier = option['dynamic']['id']
              //name is used to identify whether or not to use Tags 'tags' or
              //use the named field as the name
              const nameIdentifier =
                option['textPath'] == 'tags'
                  ? `Tags[?Key=='Name'].Value[] | [0]`
                  : option['textPath']
              const filterParams =
                option['dynamic']['params'] != undefined
                  ? option['dynamic']['params']
                  : {}
              const params = {
                ...option['dynamic'],
                awsAccountId: this.cloud.accountid,
                params: filterParams,
                region: this.cloud.region,
                filter: `${itemIdentifier}[*].{name: ${nameIdentifier}, id: ${idIdentifier}}`,
              }
              const response = await this.topsPost({
                path: 'apps/general',
                data: params
              })
              console.log(JSON.stringify(response))
              if (response.data != undefined && response.data.length > 0) {
                option['values'] = response.data
              } else {
                option['values'] = [
                  {
                    id: `Create a new ${option.name} item and refresh`,
                    name: `No data `,
                  },
                ]
              }
            } else {
              option['values'] = [
                {
                  id: `To View Lists`,
                  name: `Connect AWS account`,
                },
              ]
            }
          } catch (e) {
            console.log(e)
          }
        }
      })
      return currentOptions
    },
  },
  data() {
    var dismissConnect = parseInt(localStorage.getItem('dismissConnect') || '0')

    return {
      show: showOptions.loading,
      dismissConnect: dismissConnect,
      baseGH:
        'https://github.com/teemops/templates/blob/master/cloudformation/',
      generate: false,
      formValid: false,
      templateUrl: '',
      cliCommand: '',
      cloud: {
        resource: 'ec2',
        region: 'us-east-1',
        os: '',
        accountid: null,
      },
      parameters: {
        AppId: 0,
        CustomerId: 0,
      } as any,
      regions: (regions as Array<any>).sort(function (a, b) {
        return a.name - b.name
      }),
      instanceTypes: instanceTypes,
      oses: [
        { name: 'Ubuntu 20.04 LTS', id: 17 },
        { name: 'Ubuntu 18.04 LTS', id: 13 },
        { name: 'Ubuntu 16.04 LTS', id: 8 },
      ],
      resources: s.resources,
      options: s.options,
    }
  },
})
</script>
