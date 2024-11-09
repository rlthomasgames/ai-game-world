import {injectable} from "inversify";
import {AbstractModule} from "kitsune-wrapper-library";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import {IDataStore} from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import {APResponseData} from "kitsune-wrapper-library/dist/base/constants/SockConn";
import {unzipSync} from "fflate";
import container from "../ioc/ioc_mapping";
import CoreState from "../constants/CoreState";
export type StoredPacketData = {
    file:number,
    packet:number,
    data:ArrayBuffer,
    assetPackUUID:string,
}

@injectable()
class AssetDataVendor extends AbstractModule implements IInjectableExtensionModule, IAsyncRequest, IDataStore {
    name: string = 'AssetDataVendor';
    container = {
        dataVendor: {}
    };

    dataStore:{[x:string]:{[y:string]:Uint8Array}} = {};

    dataWells: { [a: string]: { [p: string]: StoredPacketData } } = {};

    toUnzip = 0;
    unzipped = 0;

    private started:number;

    startModule() {
        console.log('running asset vendor')
        this.container = {dataVendor: this.dataStore};
    }

    public request(valuedObject?:unknown, gzipped?:boolean) {
        console.log(`asset data vendor REQUEST ca;;ed with : ${valuedObject}  - ${gzipped}  |||`);
    }

    storeAssetResponseFromWS(data: APResponseData, started:number = 0) {
        this.started = started;
        console.log('STORE DATA:', data.data, this.started);
        if(this.dataWells[data.assetPackUUID] === undefined){
            this.dataWells[data.assetPackUUID] = {};
        }
        this.dataWells[data.assetPackUUID]['p'+data.index] = {data:data.data, file:data.fileIndex, assetPackUUID:data.assetPackUUID, packet:data.filePacketIndex };
        const sortableData:Array<StoredPacketData>  = []
        const keys = Object.keys(this.dataWells[data.assetPackUUID])
        if(data.index === data.total && keys.length === data.total) {
            keys.sort((a, b)=>{
                const numA = a.split('p')[0];
                const numB = b.split('p')[0];
                if(numA > numB) return -1
                return 1
            });
            keys.forEach((key)=>{
                sortableData.push(this.dataWells[data.assetPackUUID][key]);
            })
            //KitsuneHelper.getInstance().debugObject(sortableData, Object.keys(sortableData));
            let fileArray: Array<StoredPacketData> = [];
            let lastFile = 0;
            sortableData.sort((a, b)=>{
                let returnVal = 0;
                let packetVal : number = 0;
                packetVal = (a.packet > b.packet) ? 1 : packetVal;
                packetVal = (a.packet < b.packet) ? -1 : packetVal;
                returnVal = (a.file > b.file) ? 1 : returnVal;
                returnVal = (a.file < b.file) ? -1 : returnVal;
                returnVal = (returnVal === 0 ) ? packetVal : returnVal;
                return returnVal;
            })
            console.log('sorted array =====', sortableData, fileArray);
            if(sortableData.length === data.total){
                let fileCount = 0;
                const collectedFileArrays = [];
                let lastArrReady:Array<StoredPacketData>|null = null;
                for(let i = 0 ; i < sortableData.length; i++){
                    let dirty = false;
                    lastArrReady = null;
                    let missingArr:Array<StoredPacketData>|null = null;
                    if(sortableData[i].file===lastFile){
                        //continued file
                        fileArray.push(sortableData[i]);
                    } else {
                        //new file
                        lastArrReady = fileArray;
                        fileArray = [];
                        fileArray.push(sortableData[i]);
                        lastFile = sortableData[i].file;
                        dirty = true;
                        console.log('last array is ready', lastArrReady);

                        /*
                        console.log('checkin array before unzip attempt', fileArray, JSON.parse(JSON.stringify(fileArray)));
                        this.unzipFile(fileArray);
                         */
                    }
                    if(i === sortableData.length-1){
                        if(dirty) { missingArr = lastArrReady}
                        lastArrReady = fileArray;
                    }
                    if(lastArrReady !== null){
                        fileCount++;
                        this.toUnzip = fileCount;
                        //if(i === sortableData.length) {
                            console.log(`all files ready to build... files:${fileCount}`)
                            if(missingArr !== null){
                                const missingfinalArr:Array<ArrayBuffer> = [];
                                missingArr.forEach((storedData)=>{
                                    missingfinalArr.push(storedData.data);
                                })
                                this.unzipFile(missingfinalArr, data.assetPackUUID);
                            }
                        //}
                        const finalArr:Array<ArrayBuffer> = [];
                        lastArrReady.forEach((storedData)=>{
                            finalArr.push(storedData.data);
                        })
                        this.unzipFile(finalArr, data.assetPackUUID);
                        collectedFileArrays.push(lastArrReady);
                    }
                    let collection:Array<string> = [];
                    collectedFileArrays.forEach((v)=>{collection.push(JSON.stringify(v))})
                    //KitsuneHelper.getInstance().debugObject(collectedFileArrays, collection)
                }
            }
        }
    }
    appendBuffer(buffer1:ArrayBuffer, buffer2:ArrayBuffer) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp;
    };

    finalStore(data:{ [x:string]:Uint8Array}, assetPackUUID:string){
        if(this.dataStore[assetPackUUID] === undefined) {
            this.dataStore[assetPackUUID] = {};
        }
        const filename = Object.keys(data)[0];
        this.dataStore[assetPackUUID][filename] = data[filename];
        console.log('final storage called...', data, assetPackUUID, this.dataStore);
    };

    unzipFile(arrData:Array<ArrayBuffer>, assetPACKID:string) {
        console.log(arrData, assetPACKID);
        const zippedBlob = new Blob(arrData, {type:'application/zip'});
        let fileReader = new FileReader();
        let percentLoaded = 0;
        fileReader.onload = (event) => {
            percentLoaded = Math.floor((100/event.total)*event.loaded);
            console.log(`${Math.floor((100/event.total)*event.loaded)} % LOADED`)
            let fileArrayBuffer: ArrayBuffer = KitsuneHelper.asyncAwait(new Blob(arrData).arrayBuffer().then((value)=>{
                if(typeof value !== undefined) {
                    console.log('final array buffer >>>>', value);
                    let newUint = new Uint8Array(value)
                    const unzipped = unzipSync(newUint);
                    console.log('decompressed = ', unzipped);
                    this.finalStore(unzipped, assetPACKID);
                    this.unzipped++;
                    console.log('unzipped ',this.unzipped, 'of', this.toUnzip)
                    if(this.toUnzip == this.unzipped) {
                        container.get(CoreState.START_APPLICATION);
                    }
                }
                return value;
            })) as ArrayBuffer;
            if(percentLoaded === 100) {
                console.log('check completed', fileArrayBuffer);
                percentLoaded = 0;
            }
        };
        fileReader.readAsArrayBuffer(zippedBlob);
    }
}
export {AssetDataVendor as default, AssetDataVendor};

KitsuneHelper.getKitsuneFactories().set('AssetDataVendor', AssetDataVendor);