import {Group, Mesh, Object3D} from "three";

export class AssetHelper {
    public static getChildByName(parent: Group, name: string):Mesh | null {
        let mesh:Mesh | null = null;
        parent.children.forEach((object3d:Object3D)=>{
            if(object3d.name == name){
                mesh = object3d as Mesh;
            }
        });
        return mesh;
    }
}