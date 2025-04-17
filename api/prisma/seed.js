/**
 * Pre-populate the database with some data
 * Can be used for both testing and development as well as a Brand New Production Environment
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const instanceTypes = require('./seed/instance_types.json')
const appProviders = require('./seed/app_provider.json')
const appStatus = require('./seed/app_status.json')
const appTypes = require('./seed/app_type.json')
const jobType = require('./seed/job_type.json')
const lookupAuditType = require('./seed/lookup_audit_type.json')
const lookupEnvironment = require('./seed/lookup_environment.json')
const regionMap = require('./seed/region_map.json')

async function main() {
    const result = await prisma.cloud_provider.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "aws",
            description: "Launch and Secure Amazon Web Services"
        }
    })
    instanceTypes.forEach(async (instance) => {
        const result = await prisma.allowed_instance_types.upsert({
            where: { id: instance.id },
            update: {},
            create: {
                ...instance
            }
        })
    })
    appProviders.forEach(async (provider) => {
        const result = await prisma.app_provider.upsert({
            where: { id: provider.id },
            update: {},
            create: {
                ...provider
            }
        })
    })

    appStatus.forEach(async (status) => {
        const result = await prisma.app_status.upsert({
            where: { id: status.id },
            update: {},
            create: {
                ...status
            }
        })
    })
    appTypes.forEach(async (type) => {
        const result = await prisma.app_type.upsert({
            where: { id: type.id },
            update: {},
            create: {
                ...type
            }
        })
    })
    jobType.forEach(async (type) => {
        const result = await prisma.job_type.upsert({
            where: { id: type.id },
            update: {},
            create: {
                ...type
            }
        })
    })
    lookupAuditType.forEach(async (type) => {
        const result = await prisma.lookup_audit_type.upsert({
            where: { id: type.id },
            update: {},
            create: {
                ...type
            }
        })
    })
    lookupEnvironment.forEach(async (type) => {
        const result = await prisma.lookup_environment.upsert({
            where: { id: type.id },
            update: {},
            create: {
                ...type
            }
        })
    })
    regionMap.forEach(async (type) => {
        const result = await prisma.region_map.upsert({
            where: { id: type.id },
            update: {},
            create: {
                ...type
            }
        })
    })

    console.log("Seeded database successfully")


}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })