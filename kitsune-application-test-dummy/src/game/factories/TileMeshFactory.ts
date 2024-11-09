import {
    Mesh,
    Object3D,
    Group,
} from "three";
// @ts-ignore
import {btBvhTriangleMeshShape, btDefaultMotionState, btRigidBody, btRigidBodyConstructionInfo, btTransform, btTriangleMesh, btVector3, destroy} from "ammonext";
// @ts-ignore
import * as deePool from "deepool";
import {application} from "../../index";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {AssetHelper} from "../Utils/AssetHelper";

export class TileMeshFactory {
    private _builderSet: Group;
    private _bodyPool: { [id: string]: deePool } = {};
    public builderSetNames:string[] = [];

    private static _shapeLibrary: { [id: string]: btBvhTriangleMeshShape } = {};
    public static _instance:TileMeshFactory;

    constructor() {
        TileMeshFactory._instance = this;
        this._builderSet = (application.LOADED_ASSETS['land_builder_set.glb'] as GLTF).scene as Group;
        // TODO - re-instate
        (AssetHelper.getChildByName(this._builderSet, 'stair_00_02') as Mesh).geometry.translate(100,0,0);
        (AssetHelper.getChildByName(this._builderSet, 'stair_01_02') as Mesh).geometry.translate(100,0,0);
        (AssetHelper.getChildByName(this._builderSet, 'house02_01') as Mesh).geometry.scale(0.65,0.65,0.65);
        (AssetHelper.getChildByName(this._builderSet, 'house01_03') as Mesh).geometry.scale(0.65,0.65,0.65);
        (AssetHelper.getChildByName(this._builderSet, 'house02_01') as Mesh).geometry.translate(0,0,25);
        (AssetHelper.getChildByName(this._builderSet, 'house01_03') as Mesh).geometry.translate(0,0,16);
        this._builderSet.children.forEach((mesh: Mesh) => {
            mesh.scale.set(1,1,1);
            this.builderSetNames.push(mesh.name);
            //mesh.material = new MeshBasicMaterial({color:0xff0000});
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.set(0, 0, 0);
        });
        this.builderSetNames.sort();
    }

    private createShape(mesh: Mesh): btBvhTriangleMeshShape {
        const geom = mesh.geometry;
        const pos = geom.getAttribute('position').array
        let triangles = []
        for(let i = 0 ; i < pos.length; i+=3)
        {
            console.log('creating triangle')
            triangles.push({
                x: pos[i],
                y: pos[i+1],
                z: pos[i+2],
            })
        }

        let triangle_mesh = new btTriangleMesh();
        let vecA = new btVector3(0,0,0)
        let vecB = new btVector3(0,0,0)
        let vecC = new btVector3(0,0,0)

        for(let i = 0; i < triangles.length-3; i+=3){
            vecA.setX(triangles[i].x)
            vecA.setY(triangles[i].y)
            vecA.setZ(triangles[i].z)
            vecB.setX(triangles[i+1].x)
            vecB.setY(triangles[i+1].y)
            vecB.setZ(triangles[i+1].z)
            vecC.setX(triangles[i+2].x)
            vecC.setY(triangles[i+2].y)
            vecC.setZ(triangles[i+2].z)
            triangle_mesh.addTriangle(vecA, vecB, vecC, true)
        }
        //destroy(vecA)
        //destroy(vecB)
        //destroy(vecC)
        const shape: btBvhTriangleMeshShape = new btBvhTriangleMeshShape(triangle_mesh, true, true);
        shape.getMargin(0.05);
        return shape;
    }

    public static getShape(name: string): btBvhTriangleMeshShape {
        //TODO : remove all references to meshIndex and switch to a name - also reform tile mesh elements so you dont use a index, they should be proper objects
        if (this._shapeLibrary[name]) {
            return this._shapeLibrary[name];
        } else {
            let newShape;
            newShape = TileMeshFactory._instance.createShape((TileMeshFactory._instance._builderSet as Group).getObjectByName(name) as Mesh);
            this._shapeLibrary[name] = newShape;
            return this._shapeLibrary[name];
        }
    }

    public requestTileByName(name:string, physicsName:string): Mesh {
        let tile: Mesh = (((this._builderSet as Group).getObjectByName(name)) as Object3D).clone() as Mesh;
        tile.castShadow = true;
        tile.receiveShadow = true;
        tile.name = ''+name+'';
        tile.userData.physicsBody = this.getBodyByName(name, physicsName);
        return tile;
    }

    private getBodyByName(name: string, physicsName:string): btRigidBody {
        let body:btRigidBody;
        if (this._bodyPool[name]) {
            // @ts-ignore
            body = this._bodyPool[name].use();
        } else {
            this._bodyPool[name] = deePool.create(
                ():btRigidBody => {
                    const shape: btBvhTriangleMeshShape = TileMeshFactory.getShape(physicsName);
                    var transform = new btTransform();
                    transform.setIdentity();
                    var motionState = new btDefaultMotionState(transform);
                    let localInertia = new btVector3(0, 0, 0);
                    let rbInfo = new btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
                    let newBody = new btRigidBody(rbInfo);
                    newBody.setFriction(0.05);
                    newBody.setRestitution(0.85);
                    return newBody;
                }
            );
            // @ts-ignore
            this._bodyPool[name].grow(5);
            // @ts-ignore
            body = this._bodyPool[name].use();
        }
        return body;
    }

    public getBodyPool():{ [id: number]: deePool } {
        return this._bodyPool;
    }
}