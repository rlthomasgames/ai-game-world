import {injectable} from "inversify";
import {AbstractModule} from "kitsune-wrapper-library";
import * as THREE from "three";
import KitsuneHelper from "kitsune-wrapper-library/dist/base/helper/KitsuneHelper";
import IInjectParser from "kitsune-wrapper-library/dist/base/interfaces/extensions/IInjectParser";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";

@injectable()
class DracoParser extends AbstractModule implements IInjectParser, IInjectableExtensionModule {
    name: string = 'DracoParser';
    loadingManager = new THREE.LoadingManager();
    private _gltfLoader: GLTFLoader = new GLTFLoader(this.loadingManager);
    container: {dracoLoader:GLTFLoader, threeLoader:THREE.LoadingManager } = { dracoLoader:this._gltfLoader, threeLoader:this.loadingManager};

    startModule() {
        console.log('draco parser ready');
        const dracoLoader = new DRACOLoader(this.loadingManager);
        this._gltfLoader.manager = this.loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
    }

    /*
    parse<GLTF>(data:ArrayBuffer|string, path:string): GLTF {
        console.log('draco parser ready', data, path);
        const dracoLoader = new DRACOLoader(this.loadingManager);
        this._gltfLoader.manager = this.loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
        const promise = new Promise<GLTF>(resolve => {
            console.log("should parse");
            this._gltfLoader.parse(data, path, (gltf)=>{
                console.log("parsed", gltf);
                resolve(gltf as GLTF);
            }, (err:any)=>{
                console.log("parse error", err);
            });
        })
        return KitsuneHelper.asyncAwait(promise) as GLTF
    }
     */

    parse<GLTF>(url:string){
        const dracoLoader = new DRACOLoader(this.loadingManager);
        this._gltfLoader.manager = this.loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
        const promise = new Promise<GLTF>(resolve => {
            console.log("should parse");
            this._gltfLoader.load(url, (gltf)=>{
                console.log("parsed", gltf);
                resolve(gltf as GLTF);
            }, (err:any)=>{
                console.log("parse error", err);
            });
        })
        return KitsuneHelper.asyncAwait(promise) as GLTF
    }

}

export {DracoParser as default, DracoParser};

KitsuneHelper.getKitsuneFactories().set('DracoParser', DracoParser);