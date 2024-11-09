/*
import * as JSZip from "jszip";
import BasicLoaderDisplay from "./BasicLoaderDisplay";
import {JSZipObject} from "jszip";
import AssetsVendor from "./AssetsVendor";
import {DataTexture, Texture} from "three";
import {TileHelper} from "../game/elements/TileMeshElement";

export default class LoadAssetPackService {

    /////////////////////////////////////////////////////////////
    private partialsManifest: PartialsManifest;
    private totalPartials:number = 0;
    private partialVOS:Array<PartialVO> = [];

    private offScreenCanvas: HTMLCanvasElement = document.createElement('canvas');
    private canvasContext = this.offScreenCanvas.getContext('2d');

    constructor() {

    }

    public async loadAssetPacks() {
        fetch('./assets/manifest.json').then((resp)=>{
            resp.text().then((value)=>{
                this.partialsManifest = JSON.parse(value) as PartialsManifest;
                this.fetchPartials();
            })
        })
    };

    private fetchPartials() {
        this.totalPartials = this.partialsManifest.files;
        const zippedDir = 'assets/assets_split/';

        let loadCount = 0;
        let assetChunk = 1;
        while (assetChunk < this.totalPartials+1) {
            let b = 0;
            let filler = '.';
            while (b < (this.partialsManifest.numberingConvention - `${assetChunk}`.length)) {
                filler = `${filler}0`;
                b += 1;
            }
            const zipPartUrl = `${zippedDir}${this.partialsManifest.prefix}${filler}${assetChunk}`;
            let partResp;
            const vo:PartialVO = {index:assetChunk-1, path:zipPartUrl, initialResponse:undefined}
            partResp = fetch(zipPartUrl).then((part)=>{
                part.arrayBuffer().then((arrResp)=>{
                    loadCount++;
                    BasicLoaderDisplay.instance.updateLoaderStatus('Loaded Asset Package', Math.trunc(100/this.totalPartials)*loadCount);
                    vo.initialResponse = arrResp;
                    this.checkAndCombinePartials();
                });
            });
            this.partialVOS.push(vo);
            assetChunk++;
        }
    }

    checkAndCombinePartials() {
        let ready = true;
        this.partialVOS.forEach((partial)=>{
            if(partial.initialResponse === undefined){
                ready = false;
            }
        })
        if(ready === true) {
            BasicLoaderDisplay.instance.updateLoaderStatus('Combining Asset Pack', 0);
            let combined = [];
            for(let i = 0; i < this.partialVOS.length; i++){
                combined.push(Buffer.from(new Uint8Array(this.partialVOS[i].initialResponse)));
                BasicLoaderDisplay.instance.updateLoaderStatus('Combining Asset Pack', (100/this.totalPartials)*(i+1));
            }
            BasicLoaderDisplay.instance.updateLoaderStatus('Spawning Asset Package', 0);
            const utf8Buffer = Buffer.concat(combined);
            const blobbed = new Blob([new Uint8Array(utf8Buffer)]);
            const file:File = new File([blobbed], 'assets.zip');
            const newZip = new JSZip();
            newZip.loadAsync(file).then((newZipResp)=>{
                BasicLoaderDisplay.instance.updateLoaderStatus('Spawning Asset Package', 100);
                this.inflateAssets(newZipResp);
            }).catch((reason)=>{
                console.warn('rejected', reason);
            })
        }
    }

    private inflateAssets(zipObject:JSZip){
        const inflatedTextures:Array<InflatedAssetVO> = [];
        const inflatedModels:Array<InflatedAssetVO> = [];
        const inflatedBlobs:Array<InflatedAssetVO> = [];
        const fileReader = new FileReader();
        let total = 0;
        BasicLoaderDisplay.instance.updateLoaderStatus(`Inflating Assets `, 0);
        zipObject.forEach((ea)=>
        {
            const eachFile:JSZipObject = zipObject.files[ea];
            if(!eachFile.dir){
                total++;
            }
        })
        let initialsRead = 0;
        const imageReads:Array<SecondPassReadVO> = [];
        const jsonRead: Array<SecondPassReadVO> = [];
        zipObject.forEach((assetPath)=>{
            const eachFile:JSZipObject = zipObject.files[assetPath];
            if(!eachFile.dir) {
                const splitOrigName = eachFile.unsafeOriginalName.split('.');
                const fileExtension = splitOrigName[splitOrigName.length - 1];
                eachFile.async("blob", (meta) => {
                    //console.log('some meta', meta)
                }).then((blob) => {
                    const splitName = eachFile.name.split('/');
                    const usageName = splitName[splitName.length-1];
                    let objectURL
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        imageReads.push({blob:blob, name:usageName} as SecondPassReadVO);
                    } else if(fileExtension === 'json') {
                        jsonRead.push({blob:blob, name:usageName});
                    } else {
                        objectURL = URL.createObjectURL(blob);
                        const inflatedVO = {name:usageName, blob:blob, url:objectURL};
                        inflatedBlobs.push(inflatedVO);
                        if(fileExtension === 'glb'){
                            inflatedModels.push(inflatedVO);
                        }
                    }
                    initialsRead++;
                    //this.completedInflation(initialsRead, total) ? this.doNextRead(imageReads, inflatedBlobs, inflatedTextures, inflatedModels, total) : null
                    if(this.completedInflation(initialsRead, total)) {
                        imageReads.forEach((irVO)=>{
                            const newReader = new FileReader();
                            newReader.onloadend = (ev) => {
                                const base64Result = newReader.result as string;
                                const splitResult = base64Result.split('application/octet-stream');
                                splitResult[0] = 'data:image/png';
                                const combined = splitResult[0]+splitResult[1];
                                const inflatedVO: InflatedAssetVO = {name: irVO.name, blob: irVO.blob, url: combined};
                                inflatedBlobs.push(inflatedVO);
                                inflatedTextures.push(inflatedVO);
                                BasicLoaderDisplay.instance.updateLoaderStatus(`Inflating Assets `, Math.trunc((100 / total) * inflatedBlobs.length));
                                this.completedInflation(inflatedBlobs.length, total) ? this.buildNewAssetsManifest(inflatedBlobs, inflatedTextures, inflatedModels) : null;
                            };
                            newReader.readAsDataURL(irVO.blob);
                        });
                        jsonRead.forEach((jrVO)=>{
                            const fileReader = new FileReader();
                            fileReader.onloadend = (resp)  => {
                                const json = JSON.parse(fileReader.result as string);
                                const inflatedVO: InflatedAssetVO = {name: jrVO.name, blob:blob, json: json, url: 'null'};
                                inflatedBlobs.push(inflatedVO);
                                BasicLoaderDisplay.instance.updateLoaderStatus(`Inflating Assets `, Math.trunc((100 / total) * inflatedBlobs.length));
                                this.completedInflation(inflatedBlobs.length, total) ? this.buildNewAssetsManifest(inflatedBlobs, inflatedTextures, inflatedModels) : null;
                            }
                            fileReader.readAsText(jrVO.blob)
                        })
                    }
                    BasicLoaderDisplay.instance.updateLoaderStatus(`Inflating Assets `, Math.trunc((100/total)*inflatedBlobs.length));
                    //this.completedInflation(inflatedBlobs.length, total) ? this.buildNewAssetsManifest(inflatedBlobs, inflatedTextures, inflatedModels) : null;
                })
            }
        })
    }

    doNextRead(imageReads:Array<{name:string, blob:Blob}>, allInflated, textures, models, total){
        //const dataTexture = new DataTexture()
    const irVO = imageReads.shift();
    const newReader = new FileReader();
    newReader.onloadend = (ev) => {
        const base64Result = newReader.result as string;
        const splitResult = base64Result.split('application/octet-stream');
        console.log('split apoart', splitResult)
        splitResult[0] = 'data:image/png';
        const combined = splitResult[0]+splitResult[1];
        const inflatedVO: InflatedAssetVO = {name: irVO.name, blob: irVO.blob, url: combined};
        allInflated.push(inflatedVO);
        textures.push(inflatedVO);
        BasicLoaderDisplay.instance.updateLoaderStatus(`Inflating Assets `, Math.trunc((100 / total) * allInflated.length));
        this.completedInflation(allInflated.length, total) ? this.buildNewAssetsManifest(allInflated, textures, models) : this.doNextRead(imageReads, allInflated, textures, models, total);
        console.log(` LOADED ${irVO.name}`, combined);
    };
        newReader.readAsDataURL(irVO.blob);
    //newReader.readAsText(irVO.blob, "image/png");
    console.log('read called using ', newReader);
    //newReader.readAsBinaryString(blob)
}


    completedInflation(blobs:number,total:number):boolean{
        return (blobs === total) ? true : false;
    };

    buildNewAssetsManifest(inflatedBlobs:Array<InflatedAssetVO>, inflatedTextures:Array<InflatedAssetVO>, inflatedModels:Array<InflatedAssetVO>){
        const assetManifest:GameAssetsManifest = {
            textures:inflatedTextures,
            gltf_models:inflatedModels,
            allInflatedAssets:inflatedBlobs
        }
        let assetsVendor = new AssetsVendor(assetManifest);
        console.log('assetLoader manifest ready :', assetManifest);
    }
}

export type PartialsManifest = {
    files: number;
    prefix: string;
    numberingConvention: number
    internals: Array<string>
}

export type PartialVO = {
    index: number;
    path: string;
    initialResponse: ArrayBuffer;
}

export type SecondPassReadVO = {
    blob:Blob;
    name:string;
}

export type InflatedAssetVO = {
    name: string;
    url: string;
    blob: Blob;

    json?:JSON;
}

export type GameAssetsManifest = {
    textures:Array<InflatedAssetVO>;
    gltf_models:Array<InflatedAssetVO>;
    allInflatedAssets:Array<InflatedAssetVO>;
}
*/