import {Object3D, Texture, Vector2, Vector3} from "three";
// @ts-ignore
import {btRigidBody} from "ammonext";
import CharacterAnimationController from '../controllers/CharacterAnimationController';
import {IGameAsset} from "../../assets/IGameAsset";
//import {InflatedAssetVO} from "../../assets/LoadAssetPackService";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export interface IObjectController {
    update(gameObject:IGameObject, delta:number):void;
}

export interface IStandAloneController {
    update(delta?:number):void;
}

export interface ICharacterInputController extends IStandAloneController {
    up:boolean;
    down:boolean;
    left:boolean;
    right:boolean;
    jump:boolean;
    jumping:boolean;
}

export interface IBaseObject {
    type: string;//object type
    active: boolean;//clean or dirty
}

export interface ThreeGameObject extends IBaseObject {
    threeObject: Object3D;
}

export interface PhysicsGameObject extends IBaseObject {
    physicsBody: btRigidBody;
    collision: boolean;
}

export interface IGameObject extends ThreeGameObject, PhysicsGameObject {
    engineModel: any;
}

export interface IPlayerGameObject extends IGameObject {
    inputController:ICharacterInputController;
    animationController:CharacterAnimationController;
    angle:number;
    tile:Vector3;
    pointer:Vector3;
    pointerRadius:number;
    topSpeed:number;
    speed:number;
    impulseObject:{x:number, y:number, z:number};
    jumpImpulse:{x:number, y:number, z:number};
    currentAnimName:string;
}

export interface IAssetLoader {
    //loadTextures(objects: Array<IGameAsset|InflatedAssetVO>);

    getTexture(name: string): Texture;

    checkAssetsLoaded(): boolean;

    //loadGltfModels(objects:Array<IGameAsset|InflatedAssetVO>):void;

    getGltfModel(name: string): GLTF;
}