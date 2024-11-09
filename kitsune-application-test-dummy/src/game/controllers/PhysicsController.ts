import {IGameObject} from "../interface/Interfaces";
import {
    MathUtils,
    Mesh,
    Object3D, Quaternion, Vector3
} from "three";
// @ts-ignore
import {btDiscreteDynamicsWorld, btDefaultCollisionConfiguration, btDbvtBroadphase, btSequentialImpulseConstraintSolver, btCollisionDispatcher, btVector3, btTransform, btDefaultMotionState, btRigidBodyConstructionInfo, btRigidBody, btBoxShape, btQuaternion,} from "ammonext";
import ThreeGameView from "../ThreeGameView";
// @ts-ignore
import deePool from 'deepool';
import degToRad = MathUtils.degToRad;


export default class PhysicsController {
    private _collisionConfig:btDefaultCollisionConfiguration;
    private static _physicsWorld:btDiscreteDynamicsWorld;
    private _broadPhase:btDbvtBroadphase;
    private _solver:btSequentialImpulseConstraintSolver;
    private _dispatcher:btCollisionDispatcher;
    private _tiles:Object3D[] | null = [];
    private _bodyPool:{ [id: number]: deePool };
    private static _gravity:number = -100;
    constructor(view:ThreeGameView){
        this._collisionConfig = new btDefaultCollisionConfiguration();
        this._dispatcher = new btCollisionDispatcher(this._collisionConfig);
        this._broadPhase = new btDbvtBroadphase();
        this._solver = new btSequentialImpulseConstraintSolver();
        PhysicsController._physicsWorld = new btDiscreteDynamicsWorld(
            this._dispatcher,
            this._broadPhase,
            this._solver,
            this._collisionConfig
        );
    }

    public static setGravity(gravity:number) {
        this._gravity = gravity
        this._physicsWorld.setGravity(new btVector3(0,this._gravity,0));
    }

    public setBodyPool(bodyPool:{ [id: number]: deePool }):void {
        this._bodyPool = bodyPool;
    }

    public addBody(body:btRigidBody):void {
        PhysicsController._physicsWorld.addRigidBody( body );
    }

    public removeBody(body:btRigidBody):void {
        PhysicsController._physicsWorld.removeRigidBody(body);
    }

    public createBallGameObjectTest(startPos:Vector3, object3d:Object3D):IGameObject {
        object3d.scale.set(1,1,1)
        const shape = new btBoxShape(new btVector3(40,40,40));
        shape.setMargin(0.025);
        var mass = 0.95;
        var localInertia = new btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        const transform = new btTransform();
        transform.setIdentity();
        transform.setOrigin(new btVector3(startPos.x, startPos.y, startPos.z));
        const rotX = (Math.random()*32)*0.0175;
        const rotY = (Math.random()*10)*0.0175;
        const rotZ = (Math.random()*20)*0.0175;
        PhysicsController._physicsWorld.removeRigidBody(object3d.userData.physicsBody);
        object3d.rotation.set(degToRad(rotX), degToRad(rotY), degToRad(rotZ));
        const motionState = new btDefaultMotionState(transform);
        const rbInfo = new btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const body = new btRigidBody(rbInfo);
        body.setAngularFactor(new btVector3(rotX, rotY, rotZ));
        body.setDamping(0.01, 0.01);
        body.setFriction(0.5);
        body.setRestitution(0.5);
        body.applyCentralForce(new btVector3(0, 1, -0.03));
        //body.applyTorque(new btVector3(rotX, rotY, rotZ));
        delete object3d.userData.physicsBody;
        object3d.castShadow = true;
        body.active = true;
        object3d.userData.physicsBody = body;
        PhysicsController._physicsWorld.addRigidBody(object3d.userData.physicsBody);
        const gameObject:IGameObject = {
            threeObject:object3d,
            physicsBody:body,
            engineModel:'gameSphere',
            type:'testBox',
            active:true,
            collision:false,

        };
        // console.log('created test object', gameObject);
        return gameObject;
    }

    public emptyTiles():void {
        while((this._tiles as Object3D[]).length > 0){
            let body:btRigidBody = (this._tiles as Object3D[])[0].userData.physicsBody;
            this.removeBody(body);
            // @ts-ignore
            this._bodyPool[this._tiles[0].name].recycle(body);
            (this._tiles as Object3D[])[0].userData.physicsBody = null;
            body = null;
            // @ts-ignore
            (this._tiles as Object3D[])[0].parent.remove(this._tiles[0]);
            (this._tiles as Object3D[])[0].userData = {};
            (this._tiles as Object3D[]).shift();
        }
        this._tiles = null;
        this._tiles = [];
    }

    public addTile(object3d:Mesh):void {
        var pos = object3d.position;
        const vector = new btVector3( pos.x+(object3d.parent as Object3D).position.x, pos.y+(object3d.parent as Object3D).position.y, pos.z+(object3d.parent as Object3D).position.z );
        const quarternion:Quaternion = new Quaternion();
        quarternion.setFromEuler(object3d.rotation);
        var quart:btQuaternion = new btQuaternion(quarternion.x, quarternion.y, quarternion.z, quarternion.w);
        var transform = new btTransform();
        transform.setRotation(quart);
        transform.setOrigin( vector );
        object3d.userData.physicsBody.setWorldTransform(transform);
        PhysicsController._physicsWorld.addRigidBody(object3d.userData.physicsBody);
        (this._tiles as Object3D[]).push(object3d);
    }

    public checkForHitTest(object:IGameObject):boolean {
        let collision:boolean = false;
        let num: number = this._dispatcher.getNumManifolds();
        for (let i: number = 0; i < num; i++) {
            let manifold: any = this._dispatcher.getManifoldByIndexInternal(i);
            if (manifold.getBody0().ptr == object.physicsBody.ptr || manifold.getBody1().ptr == object.physicsBody.ptr) {
                const pts = manifold.getNumContacts();
                if (pts >= 1) {
                    collision = true;
                }
            }
        }
        return collision;
    }

    public update(dt:number, gameObjects:IGameObject[]):void {
        if(PhysicsController._physicsWorld) {
            if ((this._tiles as Object3D[]).length > 0) {
                gameObjects.forEach((gameObject:IGameObject) => {
                    const mesh:Object3D = gameObject.threeObject;
                    const body:btRigidBody = gameObject.physicsBody;
                    const worldTransform: any = body.getWorldTransform();
                    const origin: any = worldTransform.getOrigin();
                    mesh.position.x = origin.x();
                    mesh.position.y = origin.y();
                    mesh.position.z = origin.z();
                    const quart: Quaternion = new Quaternion();
                    const rot: any = worldTransform.getRotation();
                    quart.set(rot.x(),
                        rot.y(),
                        rot.z(),
                        rot.w()
                    );
                    mesh.rotation.setFromQuaternion(quart);
                    // console.log('simulated physics for :', gameObject.type, gameObject);
                });
                PhysicsController._physicsWorld.stepSimulation(dt * 10, 10);
            }
        }
    }
}