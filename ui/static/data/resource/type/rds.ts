
import base from '../type/base'
import ResourceOption from '~/types/ResourceOption'

const instanceTypes = require('~/assets/data/instance_types.json')
const dbEngines = require('~/assets/data/rds_engines.json')
const auroraEngines = require('~/assets/data/aurora_engines.json')
const auroraModes = require('~/assets/data/aurora_modes.json')
const service = "rds"
const resources = [{
  name: 'rds',
  description: 'RDS: Database Instance',
},
{
  name: 'rds.aurora',
  description: 'RDS: Aurora Cluster',
}];

var b = new base();

b.service = service;
b.resources = resources;
b.options = [
  {
    name: 'ClusterName',
    description: 'Aurora Cluster Name',
    resources: ['rds.aurora'],
    type: 'string',
    default: 'myfirstdbcluster',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'DBId',
    description: 'RDS Name or Identifier',
    resources: ['rds'],
    type: 'string',
    default: 'myfirstrds',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'DBName',
    description: 'Database Name',
    resources: ['rds.aurora'],
    type: 'string',
    default: 'myfirstdb',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'DBEngine',
    description: 'Database Engine',
    resources: ['rds'],
    type: 'list',
    values: dbEngines.map(function (value: any) {
      return value
    }),
    // textPath: 'vm_size',
    // valuePath: 'vm_size',
    default: 'mariadb',
  },
  {
    name: 'ClusterEngine',
    description: 'Database Engine',
    resources: ['rds.aurora'],
    type: 'list',
    values: auroraEngines.map(function (value: any) {
      return value
    }),
    // textPath: 'vm_size',
    // valuePath: 'vm_size',
    default: 'aurora',
  },
  {
    name: 'DBEngineMode',
    description: 'Mode e.g Serverless, Provisioned',
    resources: ['rds.aurora'],
    type: 'list',
    values: auroraModes.map(function (value: any) {
      return value
    }),
    // textPath: 'vm_size',
    // valuePath: 'vm_size',
    default: 'serverless',
  },
  {
    name: 'DBUser',
    description: 'Admin User',
    resources: ['rds', 'rds.aurora'],
    type: 'string',
    default: 'admin',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'DBPassword',
    description: 'Admin Password',
    resources: ['rds', 'rds.aurora'],
    type: 'password',
  } as ResourceOption,
  {
    name: 'RootVolumeSize',
    resources: ['rds', 'rds.aurora'],
    description: 'Database Disk Size',
    type: 'integer',
    validation: [
      (v: any) => !!v || 'This field is required',
      (v: any) => (v && v >= 20) || 'RDS Disk Size between 30-4,000GB',
      (v: any) =>
        (v && v <= 4000) || 'RDS Disk Size between 30-4,000GB',
    ],
    default: 20,
  },
  {
    name: 'InstanceType',
    resources: ['rds', 'rds.aurora'],
    description: 'RDS Instance Type',
    type: 'list',
    values: instanceTypes.map(function (value: any) {
      return value.vm_size
    }),
    textPath: 'vm_size',
    valuePath: 'vm_size',
    default: 't2.nano',
  },
  {
    name: 'VPC',
    tooltip: {
      text: 'Manage VPCs',
      link: function (region: string) {
        return `/vpc/home?region=${region}#vpcs:`
      },
    },
    resources: ['rds', 'rds.aurora'],
    description: 'VPC to launch in',
    type: 'list',
    values: [],
    dynamic: {
      className: 'EC2',
      task: 'describeVpcs',
      items: 'Vpcs',
      id: 'VpcId',
    },
    textPath: 'tags',
    valuePath: 'id',
  },
  {
    name: 'Subnet',
    tooltip: {
      text: 'Create a new Subnet',
      link: function (region: string) {
        return `/vpc/home?region=${region}#subnets:`
      },
    },
    description: 'Subnets',
    resources: ['rds', 'rds.aurora'],
    type: 'list',
    multiple: true,
    values: [],
    dynamic: {
      className: 'EC2',
      task: 'describeSubnets',
      items: 'Subnets',
      id: 'SubnetId',
    },
    textPath: 'tags',
    valuePath: 'id',
  },
  {
    name: 'SecurityGroup',
    tooltip: {
      text: 'Create a new Security Group',
      link: function (region: string) {
        return `/ec2/v2/home?region=${region}#SecurityGroups:`
      },
    },
    description: 'Security Group',
    resources: ['rds', 'rds.aurora'],
    type: 'list',
    values: [],
    dynamic: {
      className: 'EC2',
      task: 'describeSecurityGroups',
      items: 'SecurityGroups',
      id: 'GroupId',
    },
    textPath: 'GroupName',
    valuePath: 'id',
  },
  {
    name: 'HasPublicIp',
    resources: ['rds'],
    description: 'Public Access?',
    type: 'boolean',
    default: true,
  },
] as Array<ResourceOption>

export default b
