// import {Application} from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js'
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import {inject, injectable} from "inversify";
import BaseApplication from "kitsune-wrapper-library/dist/base/application/BaseApplication";
import {PerspectiveCamera, PointLight, Scene, WebGLRenderer} from 'three';
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";
import {SOCK, TYPES} from "kitsune-wrapper-library";
import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import {IDataStore} from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
import IInjectParser from "kitsune-wrapper-library/dist/base/interfaces/extensions/IInjectParser";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
import * as fflate from 'fflate';
import ThreeGameView from "./game/ThreeGameView";
import ThreeGameController from "./game/viewcontrollers/ThreeGameController";

interface IConciseConfig {
    assetPacks: string;
}

export interface ICanFetchConfig {
    getConfig: ()=>IConciseConfig;
}
@injectable()
export class application extends BaseApplication implements IInjectableExtensionModule {
    name: string = 'application';

    @inject(TYPES.FetchConfig)
    _wrapperConfig: IAsyncRequest & ICanFetchConfig;

    @inject('ThreeFrameworkExtension')
    _three: IInjectableExtensionModule;

    @inject('DracoParser')
    _dParser: IInjectableExtensionModule;

    @inject(TYPES.AssetData)
    _assetData: IDataStore;

    @inject(TYPES.Socket)
    _socket:ISockComm;

    constructor() {
        super();
    }

    public static ASSET_STORE: { [y: string]: Uint8Array; };
    public static LOADED_ASSETS: {[y:string]: unknown} = {};
    public static StaticGLBParser : IInjectParser;

    private static extTypes: { [y: string]: string; } = {
        "glb": "model/gltf-binary",
        "png": "image/png",
        "jpg": "image/jpg",
        "json": "application/json"
    }

    private _threeGameView: ThreeGameView;
    private _threeGameController: ThreeGameController;
    private _renderer: WebGLRenderer;
    private _camera: PerspectiveCamera;
    private _scene: Scene;

    startModule() {
        application.ASSET_STORE = this._assetData.dataStore[this._wrapperConfig.getConfig().assetPacks[0]]
        application.StaticGLBParser = (this._dParser as unknown as IInjectParser);
        console.log(this.toString(), this.startModule.toString(), application.ASSET_STORE, application.ASSET_STORE.toString());
        if(this._three) {
            this._three.startModule();
            this._dParser.startModule();
            document.getElementById('content')!.appendChild((this._three.container! as ThreeContainer).canvas);
            console.log('assets list...')
            for (let dataStoreElementKey in application.ASSET_STORE) {
                let returnedAsset = null;
                application.LOADED_ASSETS[dataStoreElementKey] = null
                const ext = application.identifyExt(dataStoreElementKey);
                if(ext == 'glb')
                {
                    returnedAsset = KitsuneHelper.asyncAwait(application.getGLB(dataStoreElementKey))
                } else {
                    returnedAsset = KitsuneHelper.asyncAwait(fetch(application.uint8ToURL(application.ASSET_STORE[dataStoreElementKey], ext)).then((fetchedAsset)=>{
                        const finalAsset = KitsuneHelper.asyncAwait(fetchedAsset.blob().then((value)=>{
                            application.LOADED_ASSETS[dataStoreElementKey] = value;
                            return value
                        }))
                        return finalAsset;
                    }))
                }
                console.log(application.LOADED_ASSETS[dataStoreElementKey], returnedAsset)
            }
            this.checkFullyLoaded()
        }
    }

    private checkFullyLoaded() {
        let loaded = true;
        for (let asset in application.LOADED_ASSETS) {
            if(application.LOADED_ASSETS[asset] == null)
            {
                loaded = false
            }
        }
        if(!loaded){
            setTimeout(()=>{
                console.log('re-schedule loading check')
                this.checkFullyLoaded()
            }, 750);
            console.log('not loaded yet')
        } else {
            console.log('all assets loaded');
            console.log('all assets loaded');
            console.log('all assets loaded');
            console.log(application.LOADED_ASSETS)
            this.assetsFinalized();
        }
    }

    private assetsFinalized() {
        this._renderer = (this._three.container! as ThreeContainer).renderer;
        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._camera = new PerspectiveCamera();
        const light = new PointLight(0xFFFFFF, 4);
        this._scene = new Scene()
        this._scene.add(this._camera);
        this._scene.add(light);
        this._camera.position.set(8, 8, 8);
        light.position.set(1, 2, 1);
        this._camera.lookAt(0, 0, 0);
        this._threeGameView = new ThreeGameView(this._scene, this._renderer, this._camera)
        console.log(this._threeGameView.update)
        this._renderer.render(this._scene, this._camera);
        this._threeGameController = new ThreeGameController(this._threeGameView, application.LOADED_ASSETS['world12.json'] as Blob)
        this._threeGameController.initControllers();

        for (let childrenKey in document.body.children) {
            console.log(document.body.children[childrenKey]);
        }

        this.initButtons();


        this.render();
    }

    private initButtons() {
        const aiGen = document.getElementById('ai-prompt') as HTMLDivElement;
        const aiImages = document.getElementById('images') as HTMLDivElement;
        const generateButton = document.getElementById('generate') as HTMLButtonElement;
        const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
        console.log('ele ->', aiGen, aiImages)
        promptInput.addEventListener('click', (event) => {
            promptInput.value = '';
            promptInput.innerText = '';
        })
        generateButton.addEventListener('click', (event: MouseEvent) => {
            console.log('generate :', promptInput.value)
            const payload = {
                PY_REQ: {
                    GENERATE: {
                        value:promptInput.value
                    }
                }
            }
            console.log(payload, this._socket, this._socket.socket)
            this.sendGZipEmit(payload)
            this._socket.socket.emit(SOCK.PY_REQ, payload);
        })
    }

    private render() {
        console.log('render');
        TWEEN.update();
        //time = clock.getDelta();
        if (this._threeGameController) {
            this._threeGameController.update();
        }
        if (this._threeGameView) {
            this._threeGameView.update();
        }
        requestAnimationFrame(this.render.bind(this))
    }

    public static identifyExt(assetName:string):string {
        const split = assetName.split('.');
        return split[1]
    }

    public static async getGLB(assetName: string): Promise<GLTF> {
        const promise = new Promise<GLTF>((resolve, reject) => {
            const url = application.uint8ToURL(application.ASSET_STORE[assetName], 'glb')
            const gltf = application.StaticGLBParser.parse<Promise<GLTF>>(url)
            const returnVal = KitsuneHelper.asyncAwait(gltf.then((scene3d) => {
                application.LOADED_ASSETS[assetName] = scene3d;
                return scene3d
            }).then((val)=>{
                return val
            }))
            return returnVal
        })
        return await promise
    }

    public static uint8ToURL(uint8Array: Uint8Array, extType:string): string {
        let type = this.extTypes[extType];
        const options = type ? {type:type} : null;
        const blob = options ? new Blob([uint8Array], options) : new Blob([uint8Array]);
        return URL.createObjectURL(blob);
    }

    async sendGZipEmit( payload: Object): Promise<boolean> {
        const payString = JSON.stringify(payload);
        // TODO ? possibly encrypt data here, REMINDER: but MUST-DO on server side more probable
        let promiseSent: void | Promise<boolean>;
        promiseSent = new Promise((resolve, reject)=>{
            fflate.gzip(fflate.strToU8(payString), (err, data) => {
                //
                if (err) {
                    resolve(false);
                    console.warn((err as Error)?.stack, err);
                    console.error(err);
                    throw new Error(`${SOCK.GZIPPED_EVENT} failed : ${err}`);
                } else if( data) {
                    resolve(true);
                    this._socket.socket.emit(SOCK.GZIPPED_EVENT, data);
                }
            });
        })
        return await promiseSent;
    }
}

declare type ThreeContainer = {
    canvas:HTMLCanvasElement,
    renderer:WebGLRenderer,
}

KitsuneHelper.getKitsuneFactories().set('application', application);

