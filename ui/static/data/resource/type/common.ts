
import base from '../type/base'
import ResourceOption from '~/types/ResourceOption'
const service = "common"
const resources = [];

var b = new base();

b.service = service;
b.resources = resources;
b.options = [
  {
    name: 'AppId',
    type: 'placeholder',
  },
  {
    name: 'CustomerId',
    type: 'placeholder',
  },
  {
    name: 'SSLArn',
    tooltip: {
      text: 'Create a new SSL Certificate',
      link: function (region: string) {
        return `/acm/home?region=${region}#/`
      },
    },
    resources: ['asg.alb', 's3.cdn'],
    description: 'SSL ARN',
    type: 'list',
    dynamic: {
      className: 'ACM',
      task: 'listCertificates',
      items: 'CertificateSummaryList',
      id: 'CertificateArn',
      params: {
        CertificateStatuses: ['ISSUED'],
      },
    },
    textPath: 'DomainName',
    valuePath: 'id',
  },
] as Array<ResourceOption>

export default b
