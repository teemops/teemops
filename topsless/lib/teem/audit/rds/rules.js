/**
 * Provides rules defintion for a scan
 */
var tasks = {
    describeDBInstances: {
        task: 'describeDBInstances',
        id: 'instance',
        key: 'Name',
        selector: 'DBInstances[]',
        description: 'List all RDS Instances',
        items: {},
        actions: [
            'describeDBSubnetGroups',
            'describeVpcs',
            'describeSecurityGroups'
        ]
    },
}
var config = {
    service: 'rds',
    start: tasks.describeDBInstances,
    defaults: {
        actions: {
            params: (item) => {
                return {
                    DBInstanceIdentifier: item.DBInstanceIdentifier
                }
            }
        }
    }
}

tasks.describeDBInstances.items = {
    DBInstances: [
        {
            Name: 'DBInstanceIdentifier',
            Type: 'String',
        }
    ]
}

tasks.describeDBSubnetGroups = {
    params: (item) => {
        return {
            DBSubnetGroupName: item.DBSubnetGroup.DBSubnetGroupName
        }
    }
}

module.exports = { config: config, tasks: tasks };