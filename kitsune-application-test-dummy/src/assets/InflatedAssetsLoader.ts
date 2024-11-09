// @ts-ignore
/*
import * as ColladaLoader from 'three-collada-loader-2';
import {ImageLoader, Loader, LoadingManager, Texture, TextureLoader} from "three";
import {TGALoader} from "three/examples/jsm/loaders/TGALoader";
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {DDSLoader} from "three/examples/jsm/loaders/DDSLoader";
import {GameAssetsManifest, InflatedAssetVO} from "./LoadAssetPackService";
import {IAssetLoader} from "../game/interface/Interfaces";
import BasicLoaderDisplay from "./BasicLoaderDisplay";
DRACOLoader.setDecoderPath('./');
var dracoLoader: DRACOLoader;
var ddsLoader: DDSLoader;

export default class InflatedAssetsLoader implements  IAssetLoader {

    private _textures: { [id: string]: Texture } = {};
    private _textureLoader: TextureLoader;
    private _imageLoader: ImageLoader;
    private _loadingManager: LoadingManager;

    //private _colladaModels: { [id: string]: Object3D } = {};
    //private _colladaLoader: ColladaLoader;

    private _gltfModels: { [id: string]: GLTF } = {};
    private _gltfLoader: GLTFLoader = new GLTFLoader(this._loadingManager);

    private _allAssets:Array<InflatedAssetVO>;
    private _knownTotal: number = 0;
    private _loaderSegments:number = 0;
    private _loadedPercentage:number = 0;

    private _loadedGLTF:number = 0;
    private _loadedTextures:number = 0;
    private _completed:boolean = false;



    //todo: externalize this data below
    private obj: GameAssetsManifest;

    constructor(assetsLibContents: GameAssetsManifest) {

        Loader.Handlers.add(/\.tga$/i, new TGALoader());

        this.obj = assetsLibContents;

        this.init();

        this._knownTotal = (
            this.obj.textures.length +
            this.obj.textures.length +
            this.obj.gltf_models.length
        );

        this._loaderSegments = 100/this._knownTotal;

        this.loadTextures(this.obj.textures);
        //this.loadColladaModels(this.obj.collada_models);
        this.loadGltfModels(this.obj.gltf_models);
        this._allAssets = assetsLibContents.allInflatedAssets;
    }

    private init(): void {
        BasicLoaderDisplay.instance.updateLoaderStatus('Casting Engine Assets', 0)
        this._loadingManager = new LoadingManager(
            () => {
                if(this._loadedPercentage === 100) {
                    this._completed = true;
                }
            },
            (url: string, loaded: number, total: number) => {
                let tempPercent:number = ((loaded/total)*this._loaderSegments)*this._knownTotal;
                if(tempPercent > this._loadedPercentage){
                    this._loadedPercentage = tempPercent;
                    BasicLoaderDisplay.instance.updateLoaderStatus('Casting Engine Assets', Math.trunc(this._loadedPercentage))
                }
            },
            () => {

            });
        this._textureLoader = new TextureLoader(this._loadingManager);
        this._imageLoader= new ImageLoader(this._loadingManager);
        dracoLoader = new DRACOLoader(this._loadingManager);
        ddsLoader = new DDSLoader(this._loadingManager);
        this._gltfLoader.manager = this._loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
        this._gltfLoader.setDDSLoader(ddsLoader);
        //this._colladaLoader = new ColladaLoader(this._loadingManager);
        //this._gltfLoader.setDDSLoader(new DDSLoader(this._loadingManager));
    }

    public loadTextures(objects: InflatedAssetVO[]): void {
        for (let i = 0; i < objects.length; i++) {
            this.loadTexture(objects[i]);
        }
    }

    private loadTexture(asset: InflatedAssetVO): void {
        this._textureLoader.load(asset.url, (texture: Texture) => {
            this._loadedTextures++;
            const percent = (100/this._knownTotal)*(this._loadedGLTF+(this._loadedTextures*2));
            BasicLoaderDisplay.instance.updateLoaderStatus('Casting Engine Assets', Math.trunc(percent))
            this._textures[asset.name] = texture;
        }, (textureProgress)=>{
        }, (textureError)=>{
            console.log(`texture : ${asset.name} ERROR : ${textureError}`, textureError);
        });
    }

    public getTexture(name: string): Texture {
        if(name === ''){
            // TODO : somewhere a material with no name - find and fix
            return this._textures['groundb.png'];
        }
        return this._textures[name];
    }

    public loadGltfModels(objects:InflatedAssetVO[]):void {
        for (let i: number = 0; i < objects.length; i++) {
            this.storeGltfModel(objects[i]);
        }
    }

    private storeGltfModel(asset: InflatedAssetVO): void {
        this._gltfLoader.load(asset.url, (gltf: GLTF) => {
            if(gltf) {
                this._gltfModels[asset.name] = gltf;
                this._loadedGLTF++;
            }
            //todo : add completion
        }, ()=>{
        }, (error:any)=>{
        })
    }

    public getGltfModel(name: string): GLTF {
        return this._gltfModels[name];
    }

    public checkAssetsLoaded(): boolean {
        return this._completed;
    }

    public getAllInflatedAssets(): Array<InflatedAssetVO> {
        return this._allAssets;
    }

    public getPercent():number {
        return this._loadedPercentage
    }
}

 */