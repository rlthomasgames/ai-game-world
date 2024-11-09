import { ExtensionValuedObject } from "../commands/InitWrapper";
import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import IWrapperConfig from "../interfaces/IWrapperConfig";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
export type EssentialLoadingParams = {
    moduleName: string;
    modulePath: string;
    location: HTMLHeadElement;
    gzipped: boolean;
};
export declare class LoadModule implements IAsyncRequest {
    _socket: ISockComm;
    private totalModules;
    private totalLoaded;
    cacheKeys: Array<String>;
    constructor();
    loadModules(wrapperConfig: IWrapperConfig): void;
    request(moduleVO: ExtensionValuedObject, gzipped: boolean): Promise<unknown> | undefined;
    completeInit(): void;
    loadJS(parameters: EssentialLoadingParams): Promise<unknown>;
    storeInCache(extensionName: string, extensionContent: string): Promise<void>;
    loadFromCache(parameters: EssentialLoadingParams): Promise<unknown>;
}
