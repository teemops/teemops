
import base from '../type/base'
import ResourceOption from '~/types/ResourceOption'
import IBase from '~/types/Base';
const instanceTypes = require('~/assets/data/instance_types.json')
const service = "ec2"
const resources = [{
  name: 'ec2',
  description: 'EC2: Instance',
},
{
  name: 'asg',
  description: 'EC2: Autoscaling Group (ASG)',
},
{
  name: 'asg.alb',
  description: 'EC2: Application Load Balancer + ASG',
}];

var b = new base();
b.instructions = `
You can launch either an EC2, Autoscaling Group or Load Balancer with Autoscaling Group in the region of your choice.

Minimum Required for Each Resource:
EC2: Keypair
Application Load Balancer: An Amazon SSL Certificate Setup in the same region. (See tooltip under SSL Arn)

`
b.service = service;
b.resources = resources;
b.options = [
  {
    name: 'AMI',
    type: 'placeholder',
    resources: ['ec2', 'asg', 'asg.alb'],
  },
  {
    name: 'AppName',
    description: 'Resource Name',
    resources: ['ec2', 'asg', 'asg.alb'],
    type: 'string',
    default: 'myfirstapp',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'KeyPair',
    tooltip: {
      text: 'Create a new KeyPair',
      link: function (region: string) {
        return `/ec2/v2/home?region=${region}#KeyPairs:`
      },
    },
    description: 'Keypair Name',
    resources: ['ec2', 'asg', 'asg.alb'],
    type: 'list',
    values: [],
    dynamic: {
      className: 'EC2',
      task: 'describeKeyPairs',
      items: 'KeyPairs',
      id: 'KeyName',
    },
    textPath: 'KeyName',
    valuePath: 'id',
  },
  {
    name: 'RootVolumeSize',
    resources: ['ec2', 'asg', 'asg.alb'],
    description: 'EBS Volume Size',
    type: 'integer',
    validation: [
      (v: any) => !!v || 'This field is required',
      (v: any) => (v && v >= 30) || 'EBS Volume Size between 30-4,000GB',
      (v: any) =>
        (v && v <= 4000) || 'EBS Volume Size between 30-4,000GB',
    ],
    default: 50,
  },
  {
    name: 'InstanceType',
    resources: ['ec2', 'asg', 'asg.alb'],
    description: 'EC2 Instance Type',
    type: 'list',
    values: instanceTypes.map(function (value: any) {
      return value.vm_size
    }),
    textPath: 'vm_size',
    valuePath: 'vm_size',
    default: 't2.nano',
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
    resources: ['ec2', 'asg', 'asg.alb'],
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
    resources: ['ec2', 'asg', 'asg.alb'],
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
    resources: ['ec2', 'asg', 'asg.alb'],
    description: 'Public IP Address?',
    type: 'boolean',
    default: true,
  },
  {
    name: 'HasElasticIp',
    resources: ['ec2'],
    description: 'Use a Static(Elastic) IP?',
    type: 'boolean',
  },
  {
    name: 'AppEnvironment',
    resources: ['asg', 'asg.alb'],
    description: 'App Environment',
    type: 'list',
    values: ['baseline'],
    default: 'baseline',
  },
  {
    name: 'Min',
    resources: ['asg'],
    description: 'Minimum number of EC2 Instances to Launch',
    type: 'integer',
    validation: [
      (v: any) => !!v || 'This field is required',
      (v: any) => (v && v >= 1) || 'Min must be between 1-10',
      (v: any) => (v && v <= 10) || 'Min must be between 1-10',
    ],
    default: 1,
  },
  {
    name: 'Max',
    resources: ['asg'],
    description: 'Maximum number of EC2 Instances to Launch',
    type: 'integer',
    validation: [
      (v: any) => !!v || 'This field is required',
      (v: any) => (v && v >= 1) || 'Max must be between 1-30',
      (v: any) => (v && v <= 30) || 'Max must be between 1-30',
    ],
    default: 2,
  },
  {
    name: 'VPC',
    tooltip: {
      text: 'Manage VPCs',
      link: function (region: string) {
        return `/vpc/home?region=${region}#vpcs:`
      },
    },
    resources: ['asg.alb'],
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
    name: 'ALBSubnets',
    tooltip: {
      text: 'Create a new Subnet',
      link: function (region: string) {
        return `/vpc/home?region=${region}#subnets:`
      },
    },
    resources: ['asg.alb'],
    description: 'ALB Subnets',
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

] as Array<ResourceOption>

export default b
