import ThreeGameView from "./ThreeGameView";
import PhysicsController from "./controllers/PhysicsController";
import {Group, Mesh, Vector2, Vector3} from "three";
import {TileMeshFactory} from "./factories/TileMeshFactory";
import {IStaticScenery, ITileElement, TileHelper, TileMeshElement} from "./elements/TileMeshElement";
// @ts-ignore
import * as deePool from "deepool";
import {MadMath} from "./Utils/MadMath";
import GameObjectFactory from "./factories/GameObjectFactory";
import {IAssetLoader, IGameObject} from "./interface/Interfaces";
import {CharacterKeyboardController} from "./controllers/CharacterKeyboardController";

export type UpdateFunctionType = () => any;

export interface IGameController {
    name: string;
    update: UpdateFunctionType;
};

abstract class AbstractIGameController implements IGameController {
    public name: string;

    public abstract update(): void;
}

export class TestControl extends AbstractIGameController {

    update(): void {
    }
}

export class WorldBuilder {

    private test: IGameController = new TestControl();
    private worldMap: ITileElement[][] = [];
    private _lastPosition: Vector2;
    private worldSize: Vector2 = new Vector2(26, 26);
    private worldCenter: Vector2 = new Vector2(13, 13);
    private _gameObjects: IGameObject[] = [];//game objects will have there updates run by specific controllers by there type

    private _container: Group = new Group();

    private _view: ThreeGameView;
    private _physicsController: PhysicsController;

    private _tileMeshFactory: TileMeshFactory;

    private _paint:boolean = false;
    private _storedProps:TileMeshElement;
    public _selectedTile: TileMeshElement = new TileMeshElement(0, 0, [
        TileHelper.createStaticDefinition('null','null', 0, new Vector3(), new Vector3())
        ]);
    public _selectedTilePos: Vector2 = new Vector2();
    public _selectedTileHeight: number = 0;
    public _selectedTileRot: number = 0;
    public _selectedMeshName: string = 'null';
    public _selectedPhysicsMeshName: string = 'null';
    public _staticIndex: number = 0;
    public _staticIndices: number[] = [0, 1, 2, 3, 4];
    public offsetX: number = 0;
    public offsetZ: number = 0;
    public offsetY: number = 0;
    public offsetRotX: number = 0;
    public offsetRotZ: number = 0;
    public offsetRotY: number = 0;

    constructor(world_level: unknown, assetsLoader: IAssetLoader, view: ThreeGameView, physicsController: PhysicsController) {
        this.test.update();
        this._view = view;
        this._physicsController = physicsController;
        this._tileMeshFactory = new TileMeshFactory();

        this._container.name = 'world';
        this._view.addObject(this._container);

        document.body.addEventListener('mouseup', () => {
            const selectedTileMesh: Mesh = this._view._intersected;
            if(!this.paint) {
                if (selectedTileMesh) {
                    const tilePos = TileHelper.getMapPosFrom3DCoords(selectedTileMesh.position);
                    this._selectedTilePos.x = tilePos.x;
                    this._selectedTilePos.y = tilePos.y;
                    this._view._selectedTileMesh = selectedTileMesh;
                    if (this.worldMap && this.worldMap[this._selectedTilePos.y][this._selectedTilePos.x]) {
                        this._selectedTile = this.worldMap[this._selectedTilePos.y][this._selectedTilePos.x];
                        this._view._selectedTile = this._selectedTile;
                        this._staticIndex = 0;
                        this._staticIndices = [];
                        (this._selectedTile.staticObjects as IStaticScenery[]).forEach((staticObject, index) => {
                            this._staticIndices.push(index);
                        });
                        this._selectedMeshName = (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].meshName;
                        this._selectedPhysicsMeshName = (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].physicsMesh;
                        this._selectedTileHeight = this._selectedTile.heightLevel;
                        this._selectedTileHeight = (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].rotation;
                    }
                }
            } else {
                // console.log('stored props...', this._storedProps, this._selectedTile);
                if(this._storedProps) {
                    const mapPos = TileHelper.getMapPosFrom3DCoords(selectedTileMesh.position);
                    const tile = TileHelper.getTileFromMapPos(mapPos.x, mapPos.y)
                    tile.staticObjects = JSON.parse(JSON.stringify(this._storedProps.staticObjects));
                    tile.type = this._storedProps.type;
                    tile.heightLevel = this._storedProps.heightLevel;
                    tile.physics = this._storedProps.physics;
                    this.rebuild();
                }
            }
        });
    }

    public initWorldBuilder(): void {

    }

    public save(): void {
        const button: any = document.createElement('a');
        document.body.appendChild(button);
        button.style.position = 'absolute';
        button.style.left = '0px';
        button.style.top = '0px';

        const map: string = JSON.stringify(this.worldMap, null, 2);
        var file = new Blob([map], {type: 'text/plain'});
        button.href = URL.createObjectURL(file);
        button.download = 'world.json';
        button.click();
        setTimeout(() => {
            document.body.removeChild(button);
            window.location.href = button.href;
        }, 0);
    }

    get paint(){
        return this._paint;
    };
    set paint(value:boolean){
        this._paint = value;
        if(value){
            this._storedProps = JSON.parse(JSON.stringify(this._selectedTile)) as TileMeshElement;
        }
    };

    public load(callback?: Function): void {
        /*
        const filebrowse: HTMLInputElement = document.createElement('input');
        filebrowse.type = 'file';
        filebrowse.id = 'theFile';
        filebrowse.click();
        filebrowse.addEventListener('change', () => {
            const file = filebrowse.files[0];
            const fr: FileReader = new FileReader();
            fr.onload = (e: Event) => {
                const contents: string = (e.target as any).result;
                const object: TileMeshElement[][] = JSON.parse(contents);
                this.worldMap = object;
                this.buildFromMapPos(this._lastPosition);
                if (callback) {
                    callback();
                }
                TileHelper.reDefineTileProps(this._container, this.worldMap);
            };
            fr.readAsText(file);
        });

         */
    }


    public loadLevel(level:Blob){
        level.text().then((value)=>{
            console.log('text value =', value)
            this.worldMap = JSON.parse(value) as Array<Array<ITileElement>>;
            this.buildFromMapPos(this._lastPosition);
            TileHelper.reDefineTileProps(this._container, this.worldMap);
        })
    }

    public rebuild(): void {
        (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].meshName = this._selectedMeshName;
        (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].physicsMesh = this._selectedPhysicsMeshName;
        (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].rotation = this._selectedTileRot;
        (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].offset = new Vector3(this.offsetX, this.offsetY, this.offsetZ);
        (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].offsetRotation = new Vector3(this.offsetRotX, this.offsetRotY, this.offsetRotZ);
        this._selectedTile.heightLevel = this._selectedTileHeight;
        // console.log('testing..', this._selectedTile, this.worldMap[this._selectedTilePos.x][this._selectedTilePos.y]);
        this.buildFromMapPos(this._lastPosition);
        TileHelper.reDefineTileProps(this._container, this.worldMap);
    }

    public set staticIndex(value: number) {
        this._staticIndex = value;
        this._selectedMeshName = (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].meshName;
        this._selectedPhysicsMeshName = (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].physicsMesh;
        this._selectedTileHeight = this._selectedTile.heightLevel;
        this._selectedTileHeight = (this._selectedTile.staticObjects as IStaticScenery[])[this._staticIndex].rotation;
    }

    public get staticIndex(): number {
        let indices: number[] = [];
        (this._selectedTile.staticObjects as IStaticScenery[]).forEach((staticObject, index) => {
            indices.push(index);
        });
        this._staticIndices = indices;
        return this._staticIndex;
    }

    public addStatic(): void {
        (this._selectedTile.staticObjects as IStaticScenery[]).push({
            meshName: 'grass_11',
            physicsMesh: 'grass_11',
            rotation: 0,
            offset: new Vector3()
        } as IStaticScenery)
    }

    public buildFromMapPos(position: Vector2): void {
        this._lastPosition = position;
        this._physicsController.emptyTiles();
        while (this._container.children.length > 0) {
            this._container.remove(this._container.children[0]);
            delete this._container.children[0];
        }
        const startX: number = position.x;
        const startY: number = position.y;
        for (let i: number = startY - this.worldCenter.y; i < startY + (this.worldSize.y - this.worldCenter.y); i++) {
            for (let j: number = startX - this.worldCenter.x; j < startX + (this.worldSize.x - this.worldCenter.x); j++) {
                if (i > -1 && j > -1 && i < this.worldMap.length && j < this.worldMap.length) {
                    const tileElement: TileMeshElement = this.worldMap[i][j];
                    const staticObjects: IStaticScenery[] = (tileElement.staticObjects as IStaticScenery[]);
                    staticObjects.forEach((staticObject: IStaticScenery) => {
                        let tile: Mesh;
                        tile = this.getTileFromName(staticObject.meshName, staticObject.physicsMesh);
                        tile.position.y = this.worldMap[i][j].heightLevel * 200;
                        tile.rotation.z = MadMath.degreesToRadians(-(tileElement.staticObjects as IStaticScenery[])[0].rotation);
                        tile.position.z = ((i - startY) * 200);
                        tile.position.x = ((j - startX) * 200);
                        if (staticObject.offset) {
                            tile.position.x += staticObject.offset.x;
                            tile.position.y += staticObject.offset.y;
                            tile.position.z += staticObject.offset.z;
                        }
                        if (staticObject.offsetRotation) {
                            tile.rotation.x += MadMath.degreesToRadians(staticObject.offsetRotation.x);
                            tile.rotation.y += MadMath.degreesToRadians(staticObject.offsetRotation.y);
                            tile.rotation.z += MadMath.degreesToRadians(staticObject.offsetRotation.z);
                        }
                        this._container.add(tile);
                        this._physicsController.addTile(tile);
                    })
                } else {
                    let tile: Mesh;
                    tile = this.getTileFromName('floor_01', 'floor_01');
                    tile.position.y = 200;
                    tile.position.z = ((i - startY) * 200);
                    tile.position.x = ((j - startX) * 200);
                    this._container.add(tile);
                    this._physicsController.addTile(tile);
                }
            }
        }
    }

    public getTileFromName(name: string, physicsName: string): Mesh {
        let tile: Mesh;
        tile = this._tileMeshFactory.requestTileByName(name, physicsName);
        return tile;
    }

    public setTiles(mapPos: Vector2): void {
        this._container.position.x = ((mapPos.x) * 200) + 100;
        this._container.position.z = ((mapPos.y) * 200) + 100;
        this.buildFromMapPos(mapPos);
    }

    public getBodyPool(): { [id: number]: deePool } {
        return this._tileMeshFactory.getBodyPool();
    }

    public createMapTest(level:Blob): void {
        ///////////////////////////////////////////////////////////
        const objectFactory: GameObjectFactory = new GameObjectFactory(this._physicsController);
        const characterObject: IGameObject = objectFactory.createGamePlayerCharacter(new Vector3(6, 3, 6), 'base.glb', new CharacterKeyboardController());
        this._gameObjects.push(characterObject);
        this._lastPosition = new Vector2(6,3);
        this._view.addObject(characterObject.threeObject);
        this.loadLevel(level);
    }
}