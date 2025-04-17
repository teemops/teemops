
import base from '../type/base'
import ResourceOption from '~/types/ResourceOption'

const service = "dynamo";
const resources = [{
  name: 'dynamo',
  description: 'DynamoDB: Table',
}];

var b = new base();

b.service = service;
b.resources = resources;
b.options = [
  {
    name: 'TableName',
    description: 'Table Name',
    resources: ['dynamo'],
    type: 'string',
    default: 'myfirstdyndb',
    validation: b.validateNoSpaces("name"),
  } as ResourceOption,

] as Array<ResourceOption>

export default b
