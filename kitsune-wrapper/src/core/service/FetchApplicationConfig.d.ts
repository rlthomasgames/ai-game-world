import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import { IWrapperConfig } from "kitsune-wrapper-library";
export declare class FetchApplicationConfig implements IAsyncRequest {
    private baseConfig;
    private urlParams;
    private finalConfig;
    internalPromise: Promise<void>;
    name: 'FetchConfig';
    request(): Promise<void>;
    configLoaded(fetchedConfig: IWrapperConfig): void;
    getConfig: () => IWrapperConfig;
    private getUrlParams;
}
