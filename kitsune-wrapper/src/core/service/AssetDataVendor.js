"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetDataVendor = exports.default = void 0;
const inversify_1 = require("inversify");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const fflate_1 = require("fflate");
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
const CoreState_1 = __importDefault(require("../constants/CoreState"));
let AssetDataVendor = class AssetDataVendor extends kitsune_wrapper_library_1.AbstractModule {
    constructor() {
        super(...arguments);
        this.name = 'AssetDataVendor';
        this.container = {
            dataVendor: {}
        };
        this.dataStore = {};
        this.dataWells = {};
        this.toUnzip = 0;
        this.unzipped = 0;
    }
    startModule() {
        console.log('running asset vendor');
        this.container = { dataVendor: this.dataStore };
    }
    request(valuedObject, gzipped) {
        console.log(`asset data vendor REQUEST ca;;ed with : ${valuedObject}  - ${gzipped}  |||`);
    }
    storeAssetResponseFromWS(data, started = 0) {
        this.started = started;
        console.log('STORE DATA:', data.data, this.started);
        if (this.dataWells[data.assetPackUUID] === undefined) {
            this.dataWells[data.assetPackUUID] = {};
        }
        this.dataWells[data.assetPackUUID]['p' + data.index] = { data: data.data, file: data.fileIndex, assetPackUUID: data.assetPackUUID, packet: data.filePacketIndex };
        const sortableData = [];
        const keys = Object.keys(this.dataWells[data.assetPackUUID]);
        if (data.index === data.total && keys.length === data.total) {
            keys.sort((a, b) => {
                const numA = a.split('p')[0];
                const numB = b.split('p')[0];
                if (numA > numB)
                    return -1;
                return 1;
            });
            keys.forEach((key) => {
                sortableData.push(this.dataWells[data.assetPackUUID][key]);
            });
            //KitsuneHelper.getInstance().debugObject(sortableData, Object.keys(sortableData));
            let fileArray = [];
            let lastFile = 0;
            sortableData.sort((a, b) => {
                let returnVal = 0;
                let packetVal = 0;
                packetVal = (a.packet > b.packet) ? 1 : packetVal;
                packetVal = (a.packet < b.packet) ? -1 : packetVal;
                returnVal = (a.file > b.file) ? 1 : returnVal;
                returnVal = (a.file < b.file) ? -1 : returnVal;
                returnVal = (returnVal === 0) ? packetVal : returnVal;
                return returnVal;
            });
            console.log('sorted array =====', sortableData, fileArray);
            if (sortableData.length === data.total) {
                let fileCount = 0;
                const collectedFileArrays = [];
                let lastArrReady = null;
                for (let i = 0; i < sortableData.length; i++) {
                    let dirty = false;
                    lastArrReady = null;
                    let missingArr = null;
                    if (sortableData[i].file === lastFile) {
                        //continued file
                        fileArray.push(sortableData[i]);
                    }
                    else {
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
                    if (i === sortableData.length - 1) {
                        if (dirty) {
                            missingArr = lastArrReady;
                        }
                        lastArrReady = fileArray;
                    }
                    if (lastArrReady !== null) {
                        fileCount++;
                        this.toUnzip = fileCount;
                        //if(i === sortableData.length) {
                        console.log(`all files ready to build... files:${fileCount}`);
                        if (missingArr !== null) {
                            const missingfinalArr = [];
                            missingArr.forEach((storedData) => {
                                missingfinalArr.push(storedData.data);
                            });
                            this.unzipFile(missingfinalArr, data.assetPackUUID);
                        }
                        //}
                        const finalArr = [];
                        lastArrReady.forEach((storedData) => {
                            finalArr.push(storedData.data);
                        });
                        this.unzipFile(finalArr, data.assetPackUUID);
                        collectedFileArrays.push(lastArrReady);
                    }
                    let collection = [];
                    collectedFileArrays.forEach((v) => { collection.push(JSON.stringify(v)); });
                    //KitsuneHelper.getInstance().debugObject(collectedFileArrays, collection)
                }
            }
        }
    }
    appendBuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp;
    }
    ;
    finalStore(data, assetPackUUID) {
        if (this.dataStore[assetPackUUID] === undefined) {
            this.dataStore[assetPackUUID] = {};
        }
        const filename = Object.keys(data)[0];
        this.dataStore[assetPackUUID][filename] = data[filename];
        console.log('final storage called...', data, assetPackUUID, this.dataStore);
    }
    ;
    unzipFile(arrData, assetPACKID) {
        console.log(arrData, assetPACKID);
        const zippedBlob = new Blob(arrData, { type: 'application/zip' });
        let fileReader = new FileReader();
        let percentLoaded = 0;
        fileReader.onload = (event) => {
            percentLoaded = Math.floor((100 / event.total) * event.loaded);
            console.log(`${Math.floor((100 / event.total) * event.loaded)} % LOADED`);
            let fileArrayBuffer = KitsuneHelper_1.default.asyncAwait(new Blob(arrData).arrayBuffer().then((value) => {
                if (typeof value !== undefined) {
                    console.log('final array buffer >>>>', value);
                    let newUint = new Uint8Array(value);
                    const unzipped = (0, fflate_1.unzipSync)(newUint);
                    console.log('decompressed = ', unzipped);
                    this.finalStore(unzipped, assetPACKID);
                    this.unzipped++;
                    console.log('unzipped ', this.unzipped, 'of', this.toUnzip);
                    if (this.toUnzip == this.unzipped) {
                        ioc_mapping_1.default.get(CoreState_1.default.START_APPLICATION);
                    }
                }
                return value;
            }));
            if (percentLoaded === 100) {
                console.log('check completed', fileArrayBuffer);
                percentLoaded = 0;
            }
        };
        fileReader.readAsArrayBuffer(zippedBlob);
    }
};
exports.default = AssetDataVendor;
exports.AssetDataVendor = AssetDataVendor;
exports.AssetDataVendor = exports.default = AssetDataVendor = __decorate([
    (0, inversify_1.injectable)()
], AssetDataVendor);
KitsuneHelper_1.default.getKitsuneFactories().set('AssetDataVendor', AssetDataVendor);
