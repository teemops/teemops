export default ({ app }, inject) => {
    const AUDIT_TYPES = {
        1: 'S3 Audit',
        2: 'EC2 Audit',
        3: 'IAM Audit',
        4: 'Custom Audit'
    }
    const RESOURCE_TYPES = {
        's3': 'S3 Bucket',
        'ec2': 'EC2 Instance',
        'iam': 'IAM Users and Groups',
    }
    inject('getAuditType', (type) => {
        console.log(`Audit Type Map ${type}`)
        return AUDIT_TYPES[type]
    })

    inject('getResourceType', (type) => {
        console.log(`Resource Type Map ${type}`)
        return RESOURCE_TYPES[type]
    })

    inject('displayBirthday', () => {
        console.log(`July 13!`)
    })

    inject('getArrayHeaders', (arr) => {
        const keys = Object.keys(arr[0])
        return keys
    })
}