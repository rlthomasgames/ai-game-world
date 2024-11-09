import IAsyncRequest from "../interfaces/IAsyncRequest";

export class AbstractAsyncRequest implements IAsyncRequest {
    request(moduleName?: string) {
        console.log('this is abstract implementation of ICommand, please make sure to override');
        return undefined;
    };
}
