import { LoadModule } from "../service/LoadModule";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import { FetchConfig } from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
import { IDataStore } from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
export declare class InitWrapper implements ICommand {
    _wrapperConfig: FetchConfig;
    _moduleLoader: LoadModule;
    _socket: ISockComm;
    _assetDataVendor: IDataStore;
    private socket;
    private totalModules;
    private totalLoaded;
    run(): void;
    sendGZipEmit(payload: Object): Promise<boolean>;
    loadModules(): void;
    completeInit(): void;
}
export type ExtensionValuedObject = {
    moduleName: string;
    modulePath: string;
    gzipped?: boolean | undefined;
};
