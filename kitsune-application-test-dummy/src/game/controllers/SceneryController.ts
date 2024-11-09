import {IAssetLoader, IStandAloneController} from '../interface/Interfaces';
import {
	Vector2, Group, Mesh, Scene
} from 'three';
import ThreeGameView from '../ThreeGameView';
import AssetsVendor from "../../assets/AssetsVendor";


export default class SceneryController implements IStandAloneController {

	private mapViewSize:Vector2 = new Vector2(5, 5);
	private map:number[][] = [];

	private _assetsLoader:IAssetLoader;
	private _view:ThreeGameView;
	private _sceneryContainer:Group = new Group();

	constructor(threeGameView:ThreeGameView){

		this._assetsLoader = AssetsVendor.assets;
		this._view = threeGameView;

		for(let i:number = 0; i < this.mapViewSize.y*2; i++){
			this.map.push([]);
			for(let j:number = 0; j < this.mapViewSize.x*2; j++){
				this.map[i].push(0);
			}
		}

		this._view.addObject(this._sceneryContainer);

		this.generateMapFromPos(this.mapViewSize);
	}

	private generateMapFromPos(position:Vector2):void {
		const storeModels:Scene = (this._assetsLoader.getGltfModel('land_builder_set.glb').scene as unknown) as Scene;

		const startPos:Vector2 = new Vector2(position.x-this.mapViewSize.x, position.y-this.mapViewSize.y);
		for(let i:number = startPos.y; i < this.mapViewSize.y; i++){
			for(let j:number = startPos.x; j < this.mapViewSize.x; j++){
				const tile:Mesh = storeModels.getObjectByName('floor_02') as Mesh;
				tile.position.set(j-startPos.x, i-startPos.y, 0);
				this._sceneryContainer.add(tile);
			}
		}
	}

	public update():void {

	}
}
