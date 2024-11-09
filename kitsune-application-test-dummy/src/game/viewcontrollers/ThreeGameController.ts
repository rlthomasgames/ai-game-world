import ThreeGameView from '../ThreeGameView';
import {Clock, DirectionalLight, Vector2, Vector3} from 'three';
import {
    IAssetLoader,
    IGameObject,
    IObjectController,
    IPlayerGameObject,
    IStandAloneController,
} from '../interface/Interfaces';
import CameraController from "../controllers/CameraController";
import PhysicsController from "../controllers/PhysicsController";
import {ObjectType} from '../types/GameTypes';
import {CharacterController} from '../controllers/CharacterController';
import GameObjectFactory from "../factories/GameObjectFactory";
import AssetsVendor from "../../assets/AssetsVendor";
import {CharacterKeyboardController} from "../controllers/CharacterKeyboardController";
import {WorldBuilder} from "../WorldBuilder";

export default class ThreeGameController {
    public static PLAYER_MODE: string = 'PLAYER_MODE';
    public static GM_MODE: string = 'GM_MODE';

    private _view: ThreeGameView;
    private _assetLoader: IAssetLoader;
    private _objectControllers: { [id: string]: IObjectController } = {};//dictionary of IObjectControllers by id
    private _gameObjects: IGameObject[] = [];//game objects will have there updates run by specific controllers by there type
    private _physicsWorld: PhysicsController;
    private _clock: Clock;
    private mapPos: Vector2 = new Vector2(6, 6);

    private _delta: number = 0;

    private _directionalLight: DirectionalLight;

    private _standAloneControllers: { [id: string]: IStandAloneController } = {};

    private _level: Blob;

    private _worldBuilder: WorldBuilder;

    constructor(view: ThreeGameView, level:Blob) {
        this._view = view;
        this._assetLoader = AssetsVendor.assets;
        this._level = level;
        this.uiSetup();
    }

    private uiSetup(): void {
        /*
        const toolButton:HTMLImageElement = document.getElementById('tool') as HTMLImageElement;
        const playButton:HTMLImageElement = document.getElementById('play') as HTMLImageElement;
        toolButton.addEventListener('mouseup', ()=>{
            playButton.style.display = 'initial';
            toolButton.style.display = 'none';
            this.gmMode(true);
        });
        playButton.addEventListener('mouseup', ()=>{
            playButton.style.display = 'none';
            toolButton.style.display = 'initial';
            this.gmMode(false);
        });
        playButton.style.display = 'none';
        */
    }

    public initControllers(): void {
        ////////////////////////////////////////////////////////////
        this._physicsWorld = new PhysicsController(this._view);//TODO : split out the character from physicsWorld and create a hitTest function in physics world you can pass the character game object when required to check for collision
        this._clock = new Clock();
        this._clock.start();
        ///////////////////////////////////////////////////////////
        const objectFactory: GameObjectFactory = new GameObjectFactory(this._physicsWorld);
        const characterObject: IGameObject = objectFactory.createGamePlayerCharacter(new Vector3(6, 3, 6), 'character.glb', new CharacterKeyboardController());
        (characterObject as IPlayerGameObject).animationController.setStartAnimation('Armature|mixamo.com|Layer0');
        this._gameObjects.push(characterObject);
        this._view.addObject(characterObject.threeObject);
        ////////////////////////////////////////////////////////////
        //character controller - this is re-used for all character based game objects
        const characterController: CharacterController = new CharacterController(this._physicsWorld);
        this._objectControllers['characterController'] = characterController;

        ////////////////////////////////////////////////////////////
        this._worldBuilder = new WorldBuilder(this._level, this._assetLoader, this._view, this._physicsWorld);
        this._worldBuilder.setTiles(this.mapPos);
        this._worldBuilder.initWorldBuilder();
        this._physicsWorld.setBodyPool(this._worldBuilder.getBodyPool());

        /////////////////////////////////////////////////////////////
        const threeCameraController: CameraController = new CameraController(this._view.getCamera());
        this._standAloneControllers['cameraController'] = threeCameraController;

        //TODO: create a light controller here!!!
        const spotLight: DirectionalLight = new DirectionalLight(0xffffff, 0.8);
        spotLight.intensity = 1.1;
        spotLight.shadow.camera.near = 128;
        spotLight.shadow.camera.far = 3000;
        spotLight.shadow.camera.top = 1512;
        spotLight.shadow.camera.bottom = -1532;
        spotLight.shadow.camera.left = -1512;
        spotLight.shadow.camera.right = 1512;
        spotLight.shadow.mapSize = new Vector2(2048, 2048);
        this._view.addObject(spotLight);
        this._directionalLight = spotLight;
        (this._directionalLight as DirectionalLight).castShadow = true;
        //this._directionalLight.shadow.radius = 1.2;
        this._directionalLight.position.set(60, 60, -10);
        characterObject.threeObject.castShadow = true;
        this._directionalLight.target = characterObject.threeObject;
        //this._directionalLight.shadow.camera.frustumCulled = false;
        //this._directionalLight.shadow.mapSize = new Vector2(1024, 1024);
        this._directionalLight.shadow.camera.updateProjectionMatrix();

        this._worldBuilder.loadLevel(this._level);

        setTimeout(()=>{
            const spawnPos = characterObject.threeObject.position.clone();
            spawnPos.setY(spawnPos.y+300);
            // console.log('created boxes at', spawnPos)
                this.ballObjectTest(spawnPos);
                setTimeout(() => {
                    this.ballObjectTest(spawnPos)
                }, 500);
                setTimeout(() => {
                    this.ballObjectTest(spawnPos)
                }, 1500);
                setTimeout(() => {
                    this.ballObjectTest(spawnPos)
                }, 2000);
        },3000)
    }

    //TODO : move the ball object creation into the factory
    private ballObjectTest(startPos: Vector3): void {
        const gameObject: IGameObject = this._physicsWorld.createBallGameObjectTest(startPos, this._worldBuilder.getTileFromName('box_01', 'box_01'));
        this._gameObjects.push(gameObject);
        this._physicsWorld.addBody(gameObject.physicsBody);
        // console.log('creating test crate', gameObject.threeObject.position);
        this._view.addObject(gameObject.threeObject);
    }

    public update(): void {
        let playerObject: IPlayerGameObject | null = null;
        this._gameObjects.forEach((gameObject: IGameObject) => {
            //gameObject.collision = false;
            if (gameObject.type == ObjectType.PLAYER_OBJECT) {
                playerObject = gameObject as IPlayerGameObject;
                this._objectControllers['characterController'].update(gameObject, this._delta);
            } else if (gameObject.type == 'testBox') {
                // console.log('found a box:', gameObject, gameObject.type);
                /*
                this._view.getCamera().position.set(
                    gameObject.threeObject.position.x+350,
                    gameObject.threeObject.position.y+750,
                    gameObject.threeObject.position.z+350
                )
                this._view.getCamera().lookAt(gameObject.threeObject.position);

                 */
                //gameObject.physicsBody.applyCentralForce(new btVector3(10,10,10));
            }
        });
        if (this._clock) {
            this._delta = this._clock.getDelta()/1.05;
        }
        /*
        if (this._view) {
            this._view.update();
        }
         */
        if (this._physicsWorld) {
            this._physicsWorld.update(this._delta, this._gameObjects);
        }

        if (playerObject) {
            //////////////////////////////////////////////////////////
            /* this one is more of a fixed sun position - realistic */
            //////////////////////////////////////////////////////////

            this._directionalLight.position.set(
                (playerObject as IPlayerGameObject).threeObject.position.x + 720,
                (playerObject as IPlayerGameObject).threeObject.position.y + 860,
                (playerObject as IPlayerGameObject).threeObject.position.z - 720);

            //this._directionalLight.shadow.camera.rotation. = playerObject.angle;
            this._directionalLight.target = (playerObject as IPlayerGameObject).threeObject;
            this._directionalLight.shadow.camera.setRotationFromEuler(this._view.getCamera().rotation);
            this._directionalLight.shadow.camera.updateProjectionMatrix();
            //TODO : this is a view based update, think about moving it out of main loop if possible
            //TODO : as this decides what needs to be drawn in 3d world
            if ((playerObject as IPlayerGameObject).tile.x != this.mapPos.x || (playerObject as IPlayerGameObject).tile.y != this.mapPos.y) {
                this.mapPos.x = (playerObject as IPlayerGameObject).tile.x;
                this.mapPos.y = (playerObject as IPlayerGameObject).tile.y;
                this._worldBuilder.setTiles(this.mapPos);
            }
            if (this._standAloneControllers['cameraController']) {
                (this._standAloneControllers['cameraController'] as CameraController).followObject(playerObject);
            }
        }
    }
}
