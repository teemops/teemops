import ResourceOption from '~/types/ResourceOption'
export default interface IBase {
    regions: any
    service: String
    resources: Array<any>;
    options: Array<ResourceOption>;
}