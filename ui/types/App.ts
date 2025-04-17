
export default interface App {
    id: Number | null
    platform: string
    name: string
    status: string | null
    cloud: Number
    config: Object
    timestamp: Date | null
    appProviderId: Number
}
  