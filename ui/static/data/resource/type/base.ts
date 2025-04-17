/**
 * Base classes for resource filler
 */
import IBase from '~/types/Base'
import ResourceOption from '~/types/ResourceOption'
const regions = require('~/assets/data/regions.json')
const NO_SPACES_REGEX = /([^\W]*[-]{0,1}[_]*[^\s-]*)*/
const STRONG_PASS_REGEX = "^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$"
const SPACES_REGEX = /^\S*$/

export default class base {
    //Instructions and tips for end user to display above resource
    instructions: String
    regions: any;
    service: String
    resources: Array<any>;
    options: Array<ResourceOption>;

    base(s: String, r: Array<any>) {
        this.regions = regions
        this.service = s;
        this.resources = r;
    }

    set setOptions(o: Array<ResourceOption>) {
        this.options = o;
    }

    set add(o: ResourceOption) {
        this.options.push(o)
    }

    validateNoSpaces(s: String): Array<any> {
        return [
            (v: any) => !!v || 'This field is required',
            (v: any) =>
                NO_SPACES_REGEX.test(v) || `No spaces are allowed in ${s}`,
        ];
    }
}
