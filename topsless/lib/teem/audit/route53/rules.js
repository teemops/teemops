/**
 * Provides rules defintion for a scan
 */
var tasks = {
    listHostedZones: {
        task: 'listHostedZones',
        id: 'zone',
        key: 'Name',
        description: 'List all Hosted Zones',
        items: {},
        actions: [
            'getHostedZone',
            'getDNSSEC',
            'listResourceRecordSets'
        ]
    },
    getHostedZone: {},
    getDNSSEC: {},
    listResourceRecordSets: {},
}
var config = {
    service: 'route53',
    start: tasks.listHostedZones,
    defaults: {
        actions: {
            params: (item) => {
                //split item into params from /hostedzone/Id
                const hostedZoneId = item.Id.split('/').pop()
                return {
                    Id: hostedZoneId
                }
            }
        }
    }
}

tasks.listHostedZones.items = {
    HostedZones: [
        {
            Name: 'Id',
            Type: 'String',
        },
        {
            Name: 'Name',
            Type: 'String',
        },
        // {
        //     Name: 'Config',
        //     Type: 'map',
        // },
        {
            Name: 'ResourceRecordSetCount',
            Type: 'Integer',
        }
    ]
}

tasks.getDNSSEC = {
    params: (item) => {
        const hostedZoneId = item.Id.split('/').pop()
        return {
            HostedZoneId: hostedZoneId
        }
    }
}

tasks.listResourceRecordSets = {
    params: (item) => {
        const hostedZoneId = item.Id.split('/').pop()
        return {
            HostedZoneId: hostedZoneId
        }
    }
}

//list user's AWS Console login details

module.exports = { config: config, tasks: tasks };