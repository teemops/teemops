class Base {
    #config = {}
    #tasks = {}
    constructor() {

    }

    getConfig() {
        return this.#config;
    }

    getTasks() {
        return this.#tasks;
    }
}
module.exports = Base;