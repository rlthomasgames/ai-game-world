import {IAssetLoader} from "../game/interface/Interfaces";

export default class AssetsVendor {

    ////////   private static _assetsLoader:AssetsLoader;
    private static _assetsLoader:IAssetLoader;
    private static _assetsLoadedCallback:Function;
    public static assetsReady:boolean = false;
    constructor(){
        AssetsVendor.checkAssetsLoaded();
    }

    private static checkAssetsLoaded(): void {
        this.assetsReady = true;
        this._assetsLoadedCallback();
    }

    public static set setAssetsLoadedCallback(value:Function) {
        this._assetsLoadedCallback = value;
        if(this.assetsReady) {
            this._assetsLoadedCallback();
        }
    }

    public static get assets() {
        return this._assetsLoader
    }
}