import { AbstractSockComm } from "kitsune-wrapper-library";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import ICanFetchConfig from "kitsune-wrapper-library/dist/base/interfaces/ICanFetchConfig";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
import { IDataStore } from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
declare class KSockService extends AbstractSockComm implements IInjectableExtensionModule, ISockComm {
    name: string;
    _wrapperConfig: ICanFetchConfig;
    _assetData: IDataStore;
    clientMap: Map<string, any | string | boolean | number>;
    socket: any;
    id: string;
    totals: Array<number>;
    constructor();
    run(): KSockService;
    sendGZipEmit(payload: Object): Promise<void | boolean>;
    sendAssetPakReq(payload: {
        assetPackREQ: string;
        sock: string;
    }): void;
    startModule(): void;
}
export { KSockService as default, KSockService };
