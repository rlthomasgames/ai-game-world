"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAsyncRequest = void 0;
class AbstractAsyncRequest {
    request(moduleName) {
        console.log('this is abstract implementation of ICommand, please make sure to override');
        return undefined;
    }
    ;
}
exports.AbstractAsyncRequest = AbstractAsyncRequest;
