"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSockComm = void 0;
const AbstractModule_1 = require("./AbstractModule");
class AbstractSockComm extends AbstractModule_1.AbstractModule {
    constructor() {
        super(...arguments);
        this.clientMap = new Map();
        this.id = '';
        this.totals = [];
    }
    run(_wrapperConfig) {
        console.warn('Abstract Socket Comm run() was triggered  \n' +
            'Override this function in your own Socket \n' +
            'Extension, or use the KSockService extension\n');
        return this;
    }
    ;
}
exports.AbstractSockComm = AbstractSockComm;
