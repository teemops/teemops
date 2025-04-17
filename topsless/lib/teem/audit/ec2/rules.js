/**
 * Provides rules defintion for a scan
 */
var tasks = {
    describeInstances: {
        task: 'describeInstances',
        id: 'instance',
        key: 'Name',
        selector: 'Reservations[*].Instances[]',
        description: 'List all buckets',
        items: {},
        actions: [
            'describeSubnets',
            'describeVpcs',
            'describeSecurityGroups'
        ]
    },
    describeSubnets: {},
    describeVpcs: {},
    describeSecurityGroups: {},
}
var config = {
    service: 'ec2',
    start: tasks.describeInstances,
    defaults: {
        actions: {
            params: (item) => {
                return {
                    InstanceIds: [
                        item.InstanceId
                    ]
                }
            }
        }
    }
}

tasks.describeInstances.items = {
    Instances: [
        {
            Name: 'InstanceId',
            Type: 'String',
        }
    ]
}

tasks.describeSubnets = {
    params: (item) => {
        return {
            Filters: [
                {
                    Name: 'subnet-id',
                    Values: [
                        item.SubnetId
                    ]
                }
            ]
        }
    }
}

module.exports = { config: config, tasks: tasks };