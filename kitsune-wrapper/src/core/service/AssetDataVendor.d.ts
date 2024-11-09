import { AbstractModule } from "kitsune-wrapper-library";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import { IDataStore } from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import { APResponseData } from "kitsune-wrapper-library/dist/base/constants/SockConn";
export type StoredPacketData = {
    file: number;
    packet: number;
    data: ArrayBuffer;
    assetPackUUID: string;
};
declare class AssetDataVendor extends AbstractModule implements IInjectableExtensionModule, IAsyncRequest, IDataStore {
    name: string;
    container: {
        dataVendor: {};
    };
    dataStore: {
        [x: string]: {
            [y: string]: Uint8Array;
        };
    };
    dataWells: {
        [a: string]: {
            [p: string]: StoredPacketData;
        };
    };
    startModule(): void;
    request(valuedObject?: unknown, gzipped?: boolean): void;
    storeAssetResponseFromWS(data: APResponseData): void;
    appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer): Uint8Array;
    finalStore(data: {
        [x: string]: Uint8Array;
    }, assetPackUUID: string): void;
    unzipFile(arrData: Array<ArrayBuffer>, assetPACKID: string): void;
}
export { AssetDataVendor as default, AssetDataVendor };
