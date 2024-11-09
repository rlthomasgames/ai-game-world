/*
import {Group, Texture} from "three";
import AssetsLoader from "../../assets/AssetsLoader";

export default class SporeEmitter extends Group {

    assetLoader:AssetsLoader;

    smokes:Texture[];

    constructor(assetFactory:AssetsLoader){
        super();
        this.assetLoader = assetFactory;
    }

    public initialise(): void {
        this.smokes = [];
        for(let i = 0; i < 4; i++){
            this.smokes.push(this.assetLoader.getTexture('smoke_0'+i+''));
        }
    }

    public start():void {

    }

    public stop(delay?:number) : void {

    }

    public destroy():void {

    }
}

 */