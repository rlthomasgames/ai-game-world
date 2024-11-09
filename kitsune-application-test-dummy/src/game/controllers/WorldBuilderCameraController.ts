/*
import {IObjectController} from "../interface/Interfaces";
import {PerspectiveCamera, Vector3, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class WorldBuilderCameraController implements IObjectController {

    private _camera: PerspectiveCamera;
    private _pointer:Vector3 = new Vector3();
    private _controls:OrbitControls;
    private _cameraTween: any;
    private _cameraAngle: number = 0;

    constructor(camera:PerspectiveCamera, renderer:WebGLRenderer) {
        this._camera = camera;
        this.initListeners();
        this._controls = new OrbitControls( this._camera, renderer.domElement );
    }

    public update():void {
        this._controls.update();
    }

    private initListeners(): void {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key == 'ArrowUp') {
                this._pointer.z -= 15;
            }
            if (event.key == 'ArrowDown') {
                this._pointer.z += 15;
            }
            if (event.key == 'ArrowLeft') {
                this._pointer.x -= 15;
            }
            if (event.key == 'ArrowRight') {
                this._pointer.x += 15;
            }
            if (event.code == 'Space') {
                //this._spaceKey = true;
            }
        });
    };

    public worldBuilderPosition(position:Vector3): void {
        //TODO : all camera control needs to be handed to the camera controller, pass it a game object and use pointers to control its position / tweens
        const camera: PerspectiveCamera = this._camera;
        camera.position.x = this._pointer.x;
        camera.position.y = this._pointer.y+1600;
        camera.position.z = this._pointer.z;
        camera.lookAt(this._pointer);
    }
}

 */