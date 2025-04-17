/**
 * Provides list of options
 * 
 */
import common from '../data/resource/type/common'
import ec2 from '../data/resource/type/ec2'
import rds from '../data/resource/type/rds'
import dynamo from '../data/resource/type/dynamo'
import s3 from '../data/resource/type/s3'
var items = [common, ec2, rds, dynamo, s3]

export default function () {
    // var items: Array<any>;
    // items.push(ec2)
    var options = []
    var resources = []
    var instructions = []


    var services = items.map(function (item) {
        return item.service
    })

    items.forEach(item => {
        item.resources.forEach(res => {
            resources.push(res)
        });
    });

    items.forEach(item => {
        item.options.forEach(opt => {
            options.push(opt)
        });
    });

    items.forEach(item => {
        item.resources.forEach(res => {
            instructions.push({
                instructions: item.instructions,
                resource: res.name
            })
        });
    });

    return {
        services: services,
        resources: resources,
        options: options,
        instructions: instructions
    }
}
