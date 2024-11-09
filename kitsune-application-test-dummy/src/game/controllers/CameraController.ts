import {PerspectiveCamera, Vector2, Vector3} from 'three'
import {IGameObject, IPlayerGameObject, IStandAloneController} from "../interface/Interfaces";
import {MadMath} from "../Utils/MadMath";
import * as TWEEN from "@tweenjs/tween.js";
import {ObjectType} from "../types/GameTypes";
import {Tween} from "@tweenjs/tween.js";

export default class CameraController implements IStandAloneController {

    private _camera: PerspectiveCamera;
    private _cameraTween: unknown = null;
    private _cameraPos: Vector3;

    constructor(camera:PerspectiveCamera) {
        this._camera = camera;
    }

    public update(): void {
    }

    public setCamera(camera: PerspectiveCamera): void {
        this._camera = camera;
    }

    public lookAt(position: Vector3): void {
        this._camera.lookAt(position);
    }

    public getPosition(): Vector3 {
        return this._camera.position;
    }

    public setPosition(position: Vector3): void {
        this._camera.position.x = position.x;
        this._camera.position.y = position.y;
        this._camera.position.z = position.z;
    }

    public followObject(gameObject: IGameObject): void {
        //TODO : all camera control needs to be handed to the camera controller, pass it a game object and use pointers to control its position / tweens
        const camera: PerspectiveCamera = this._camera;
        if (gameObject.type == ObjectType.PLAYER_OBJECT) {
            const player: IPlayerGameObject = gameObject as IPlayerGameObject;

            const radialVector: Vector2 = MadMath.radialPosition(new Vector2(player.threeObject.position.x,  player.threeObject.position.z), 480, player.angle- 180);
            const requestedPos = new Vector3(radialVector.x, player.threeObject.position.y+432, radialVector.y);

            const tweenChain = new TWEEN.Tween(camera.position).to({y:requestedPos}, 500)
                .easing(TWEEN.Easing.Linear.None)
                .onStart(()=>{
                    new TWEEN.Tween(this._cameraPos)
                        .to({
                            x: radialVector.x,
                            z: radialVector.y,
                        }, 500)
                        .easing(TWEEN.Easing.Linear.None)
                        .onUpdate(()=>{
                            this._camera.position.setX(this._cameraPos.x);
                            this._camera.position.setY(this._cameraPos.y);
                            this._camera.position.setZ(this._cameraPos.z);
                            this.lookAt(player.threeObject.position);
                        })
                        .start();
                })
                .onComplete(()=>{
                    this._cameraTween = null;
                });
            if(!this._cameraTween) {
                this._cameraTween = tweenChain;
                (this._cameraTween as Tween<any>).start();
            } else {
                (this._cameraTween as Tween<any>).chain(tweenChain);
                (this._cameraTween as Tween<any>).onComplete(()=>{
                        this._cameraTween = tweenChain.start();
                    })
            }
            this._cameraPos = requestedPos;
        }
    }

    public worldBuilderPosition(position:Vector3): void {
        //TODO : all camera control needs to be handed to the camera controller, pass it a game object and use pointers to control its position / tweens
        const camera: PerspectiveCamera = this._camera;
        camera.position.x = position.x;
        camera.position.y = position.y+1600;
        camera.position.z = position.z;
        camera.lookAt(position);
    }
}