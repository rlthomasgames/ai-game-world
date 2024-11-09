/*
import ThreeGameView from '../ThreeGameView';
import AssetsLoader from '../../assets/AssetsLoader';
import {AmbientLight, Clock, EventDispatcher, Vector2, Vector3} from 'three';
import {IGameObject, IObjectController, IStandAloneController,} from '../interface/Interfaces';
import PhysicsController from "../controllers/PhysicsController";
import {WorldBuilder} from "../WorldBuilder";
import {WorldBuilderCameraController} from "../controllers/WorldBuilderCameraController";
import GlobalValues from "../Utils/GlobalValues";

export default class WorldBuilderController {
    public static PLAYER_MODE: string = 'PLAYER_MODE';
    public static GM_MODE: string = 'GM_MODE';

    private _view: ThreeGameView;
    private _assetLoader: AssetsLoader;
    private _objectControllers: { [id: string]: IObjectController } = {};//dictionary of IObjectControllers by id
    private _gameObjects: IGameObject[] = [];//game objects will have there updates run by specific controllers by there type
    private _physicsWorld: PhysicsController;
    private _clock: Clock;
    private _worldBuilder: WorldBuilder;//TODO : move world builder into a factory and destroy it after
    private mapPos: Vector2 = new Vector2(6, 6);

    private _delta: number = 0;

    private _standAloneControllers: { [id: string]: IStandAloneController } = {};

    constructor(view: ThreeGameView) {
        EventDispatcher.apply(this);
        this._view = view;
        this.uiSetup();
    }

    private uiSetup(): void {
        // explore here for failures
        const toolButton: HTMLImageElement = document.getElementById('tool') as HTMLImageElement;
        const playButton: HTMLImageElement = document.getElementById('play') as HTMLImageElement;
        toolButton.addEventListener('mouseup', () => {
            playButton.style.display = 'initial';
            toolButton.style.display = 'none';
            GlobalValues.gmModeGLOBAL = true;
        });
        playButton.addEventListener('mouseup', () => {
            playButton.style.display = 'none';
            toolButton.style.display = 'initial';
            GlobalValues.gmModeGLOBAL = false;
        });
        playButton.style.display = 'none';
    }

    private initControllers(): void {
        ////////////////////////////////////////////////////////////
        this._physicsWorld = new PhysicsController(this._view);//TODO : split out the character from physicsWorld and create a hitTest function in physics world you can pass the character game object when required to check for collision
        this._clock = new Clock();
        this._clock.start();
        ////////////////////////////////////////////////////////////
        this._worldBuilder = new WorldBuilder(this._assetLoader, this._view, this._physicsWorld);
        this._worldBuilder.createMapTest();
        this._worldBuilder.setTiles(this.mapPos);
        this._physicsWorld.setBodyPool(this._worldBuilder.getBodyPool());
        this._worldBuilder.initWorldBuilder();
        /////////////////////////////////////////////////////////////
        const threeCameraController: WorldBuilderCameraController = new WorldBuilderCameraController(this._view.getCamera(), this._view.getRenderer());
        this._standAloneControllers['cameraController'] = threeCameraController;

        const ambientLight:AmbientLight = new AmbientLight(0xffffff, 0.8);
        this._view.addObject(ambientLight);


        if (this._standAloneControllers['cameraController']) {
            (this._standAloneControllers['cameraController'] as WorldBuilderCameraController).worldBuilderPosition(new Vector3());
        }
    }

    public update(): void {
        if (this._clock) {
            this._delta = this._clock.getDelta();
        }
        if (this._view) {
            this._view.update();
        }
        if (this._physicsWorld) {
            this._physicsWorld.update(this._delta, this._gameObjects);
        }

        //TODO : light controller required much like camera controller, target should be specified
        let tileX: number = Math.floor(this._view.getCamera().position.x / 200);
        let tileY: number = Math.floor(this._view.getCamera().position.z / 200);
        if (tileX != this.mapPos.x || tileY != this.mapPos.y) {
            this.mapPos.x = tileX;
            this.mapPos.y = tileY;
            if(this._worldBuilder) {
                this._worldBuilder.setTiles(this.mapPos);
            }
        }
    }
}

 */