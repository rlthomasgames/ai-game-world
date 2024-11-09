import PhysicsController from "../controllers/PhysicsController";
import CharacterAnimationController from "../controllers/CharacterAnimationController";
import {ICharacterInputController, IGameObject, IPlayerGameObject} from "../interface/Interfaces";
import {Object3D, Scene, Vector3} from "three";
import {ObjectType} from "../types/GameTypes";
// @ts-ignore
import {btDefaultMotionState, btRigidBody, btRigidBodyConstructionInfo, btSphereShape, btBoxShape, btTransform, btVector3} from "ammonext";
import {application} from "../../index";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class GameObjectFactory {

    private _physicsWorld:PhysicsController;

    constructor(physicsWorld?:PhysicsController) {
        this._physicsWorld = physicsWorld!;
    }

    public createGamePlayerCharacter(startTile:Vector3, asset:string, ioController:ICharacterInputController):IGameObject{
        ////////////////////////////////////////////////////////////
        //character animation controller
        const gltf = application.LOADED_ASSETS[asset] as GLTF;
        const characterAnimationController:CharacterAnimationController = new CharacterAnimationController(gltf);
        characterAnimationController.setStartAnimation('Armature|mixamo.com|Layer0')
        const object3d: Object3D = characterAnimationController.getModel();

        ////////////////////////////////////////////////////////////
        //3d model treatment
        object3d.scale.set(11.5, 11.5, 11.5);
        (object3d as Scene).traverse((object3d: Object3D) => {
            object3d.castShadow = true;
            object3d.receiveShadow = true;
        });
        object3d.position.x = startTile.x*200;
        object3d.position.y = (startTile.y*200)+800;
        object3d.position.z = startTile.z*200;
        object3d.scale.set(36,36,36);

        ////////////////////////////////////////////////////////////
        //physics body and initiation
        const shape = new btBoxShape(new btVector3(36,36,36));
        shape.setMargin(0.5);
        var mass = 0.64;
        var localInertia = new btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        const transform = new btTransform();
        transform.setIdentity();
        const pos = object3d.position;
        transform.setOrigin(new btVector3(pos.x, pos.y, pos.z));
        const motionState = new btDefaultMotionState(transform);
        const rbInfo = new btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const body = new btRigidBody(rbInfo);
        body.setFriction(0.55);
        body.setActivationState(4);
        body.setRestitution(0.83);
        body.setDamping(0.02,0.01);
        // console.log('values: ', body.getSize, body.getWorldScale, rbInfo);
        body.setAngularFactor(new btVector3(1, 0.01, 1));
        object3d.userData.physicsBody = body;
        object3d.traverse((child)=>{
            child.position.setY(-1);
        })

        ///////////////////////////////////////////////////////////

        const characterInputController: ICharacterInputController = ioController;

        ///////////////////////////////////////////////////////////
        //actual player game object!
        let charGameObject:IPlayerGameObject = {
            physicsBody:body,
            threeObject:object3d,
            engineModel:'playerCharacter',
            type:ObjectType.PLAYER_OBJECT,
            active:true,
            collision:false,
            inputController:characterInputController,
            animationController:characterAnimationController,
            angle:180,
            tile:startTile,
            pointer:new Vector3(),
            pointerRadius:24,
            speed:0,
            topSpeed:14,
            impulseObject:{x:0, y:0, z:0},
            jumpImpulse:{x:0,y:0,z:0},
            currentAnimName:'Armature|mixamo.com|Layer0'
        };
        if(this._physicsWorld) {
            this._physicsWorld.addBody(charGameObject.physicsBody);
        }
        //harGameObject.physicsBody.getCollisionShape().setLocalScaling(11)
        return charGameObject;
    }
}