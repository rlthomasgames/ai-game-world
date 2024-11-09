"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractModule_1 = require("../abstract/AbstractModule");
class BaseApplication extends AbstractModule_1.AbstractModule {
    constructor() {
        super(...arguments);
        this.name = 'application';
    }
    startModule() {
        //overridden
        console.log('base application module started');
    }
}
exports.default = BaseApplication;
