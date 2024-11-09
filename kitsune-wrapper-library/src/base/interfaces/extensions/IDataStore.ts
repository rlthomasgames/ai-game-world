
export interface IDataDescriptor {
    //information for object file types stored
    ext?:string,
    loader?:string,
    framework?:string,
    dataWell?:string,
}
export interface IDataStore {
    dataWells:{//all wells
        [z:string]:{//asset type
            [w:string]:{data:ArrayBuffer, file:number}//asset data
        }
    }
    // dataStore [assetPackUUID][filename]
    dataStore: {[x:string]:{[y:string]:Uint8Array}};
    appendBuffer(buffer1:ArrayBuffer, buffer2:ArrayBuffer):Uint8Array;
    storeAssetResponseFromWS(data:unknown, started:number):void;
}