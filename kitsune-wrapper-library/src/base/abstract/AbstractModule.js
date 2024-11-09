"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModule = void 0;
class AbstractModule {
    constructor() {
        this.name = 'Abstract';
    }
    startModule() {
        console.info('this is abstract implementation of IInjectableExtensionModule, please make sure to override');
    }
    ;
}
exports.AbstractModule = AbstractModule;
