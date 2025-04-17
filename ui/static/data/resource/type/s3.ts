
import base from '../type/base'
import ResourceOption from '~/types/ResourceOption'
import ResourceSetting from '~/types/ResourceSetting'

const service = "s3";
const resources = [{
  name: 's3',
  description: 'S3: Bucket',
},
{
  name: 's3.cdn',
  description: 'S3: Bucket + CDN',
  settings: {
    limitRegions: ["us-east-1"]
  } as ResourceSetting
},
];

var b = new base();

b.service = service;
b.resources = resources;
b.options = [
  {
    name: 'BucketName',
    description: 'Bucket Name',
    resources: ['s3'],
    type: 'string',
    default: 'myfirstbucket',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'HasRoute53',
    resources: ['s3.cdn'],
    description: 'Use Existing Route 53 DNS Hosted Zone?',
    type: 'boolean',
    default: false,
  },
  {
    name: 'DomainAlias',
    description: 'Full Domain name of web app including Sub Domain',
    resources: ['s3.cdn'],
    type: 'string',
    default: 'app.mydomain.com',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,
  {
    name: 'HostedZone',
    description: 'Route53 Hosted Zone Domain (Optional if checked)',
    resources: ['s3.cdn'],
    type: 'string',
    default: 'mydomain.com',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,

  // {
  //   name: 'HostedZone',
  //   tooltip: {
  //     text: 'Route53 Hosted Zone Domain (Optional)',
  //     link: function (region: string) {
  //       return `/route53/v2/hostedzones#`
  //     },
  //   },
  //   resources: ['asg.alb', 's3.cdn'],
  //   description: 'Hosted Zone',
  //   type: 'list',
  //   dynamic: {
  //     className: 'Route53',
  //     task: 'listHostedZones',
  //     items: 'HostedZones',
  //     id: 'Name',
  //   },
  //   textPath: 'Name',
  //   valuePath: 'id',
  // },

  {
    name: 'IsPublic',
    resources: ['s3'],
    description: 'Public Bucket?',
    type: 'boolean',
    default: false,
  },
  {
    name: 'IsWebsite',
    resources: ['s3'],
    description: 'Is a Website?',
    type: 'boolean',
    default: false,
  },

] as Array<ResourceOption>

export default b
