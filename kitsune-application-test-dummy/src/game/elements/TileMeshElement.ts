import {Object3D, Vector2, Vector3} from "three";

export type TileElement = {
    heightLevel:number;
    type:number;
    physics?:any;
}

export interface ITileElement {
    heightLevel:number;
    type:number;
    staticObjects:IStaticScenery[] | undefined;
    physics?:any;
}

export interface IStaticScenery {
    meshName:string;
    physicsMesh:string;
    rotation:number;
    offset:Vector3;
    offsetRotation:Vector3;
}

export class TileHelper {
    private static tileWidth:number = 200;
    private static tileDepth:number = 200;
    private static tileCenterX:number = .5;
    private static tileCenterZ:number = .5;
    private static mapContainer:Object3D;
    private static theMap: ITileElement[][];
    public static reDefineTileProps = (mapContainer:Object3D, map:ITileElement[][], tileWidth?:number, tileDepth?:number, tileCenterX?: number, tileCenterZ?: number)=>{
        TileHelper.mapContainer = mapContainer;
        TileHelper.theMap = map;
        TileHelper.tileWidth = tileWidth ? tileWidth : TileHelper.tileWidth;
        TileHelper.tileDepth = tileDepth ? tileDepth : TileHelper.tileDepth;
        TileHelper.tileCenterX = tileCenterX ? tileCenterX : TileHelper.tileCenterX;
        TileHelper.tileCenterZ = tileCenterZ ? tileCenterZ : TileHelper.tileCenterZ;
    }

    public static getMapPosFrom3DCoords = (pos3d:Vector3) => {
        const posX: number = ((pos3d.x + TileHelper.mapContainer.position.x) / TileHelper.tileWidth) - TileHelper.tileCenterX;
        const posZ: number = ((pos3d.z + TileHelper.mapContainer.position.z) / TileHelper.tileDepth) - TileHelper.tileCenterZ;
        return new Vector2(posX,posZ);
    }

    public static getTileFromMapPos = (posX:number, posZ:number) => {
        // console.log('checking ', TileHelper.theMap);
        return TileHelper.theMap[posZ][posX];
    }

    public static createStaticDefinition = (meshName:string, physicsMesh:string, rotation:number, offset:Vector3, offsetRotation:Vector3)=>{
        return {
            meshName,
            physicsMesh,
            rotation,
            offset,
            offsetRotation
        } as IStaticScenery;
    }
}

export class TileMeshElement implements ITileElement {

    public heightLevel:number;
    public type:number;
    public staticObjects:IStaticScenery[] | undefined = [];
    public physics?:any;

    constructor(type:number, heightLvl:number, staticObject?:IStaticScenery[], physics?:any){
        this.type = type;
        this.heightLevel = heightLvl;
        this.staticObjects = staticObject;
        this.physics = physics;
    }
}