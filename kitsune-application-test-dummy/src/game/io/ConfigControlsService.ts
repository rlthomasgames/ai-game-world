/*
import ThreeGameView from "../ThreeGameView";
import AssetsVendor from "../../assets/AssetsVendor";
import {
    DirectionalLight,
    DoubleSide,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    Vector2,
    Vector3
} from "three";
export default class ConfigControlsService {
    private threeView : ThreeGameView;
    private analogueStick0 : Object3D;
    private analogueStick1 : Object3D;

    private buttonGroup : Object3D;
    private button0 : Object3D;
    private button1 : Object3D;
    private button2 : Object3D;
    private button3 : Object3D;

    private mappings = [
        {config_name:'STEAM DECK DESKTOP', mappings:[
                {name:'FORWARDS', mapped:'KEY_ARROW-UP', instruction:'FORWARDS ACTION'},
                {name:'BACKWARDS', mapped:'KEY_ARROW-DOWN', instruction:'BACKWARDS ACTION'},
                {name:'LEFT', mapped:'MOUSE_LEFT', instruction:'TURN LEFT'},
                {name:'RIGHT', mapped:'MOUSE_RIGHT', instruction:'TURN RIGHT'},
                {name:'JUMP', mapped:'SPACE', instruction:'JUMP ACTION'},
                {name:'ACTION', mapped:'KEY_E', instruction:'INTERACT ACTION'},
                {name:'ATTACK', mapped:'KEY_/', instruction:'ATTACK ACTION'},
                {name:'MENU', mapped:'KEY_ESC', instruction:'SHOW MENU'}
            ]},
        {config_name:'WASD KEYBOARD', mappings: [

            ]}
    ]
    constructor(threeView:ThreeGameView){
        this.threeView = threeView;
        // console.log('helllllllllo');
    }

    displayGamepadStyle():void {
        const controlsScale : number = 75;

        this.analogueStick0 = AssetsVendor.assets.getGltfModel('joystick.glb').scene;
        (this.analogueStick0 as Scene).scale.set(controlsScale,controlsScale,controlsScale);
        this.analogueStick0.children.forEach((child)=>{
            ((child as Mesh).material as MeshStandardMaterial).roughness = 0.1;
            ((child as Mesh).material as MeshStandardMaterial).metalness = 0.305;
            ((child as Mesh).material as MeshStandardMaterial).side = DoubleSide;
            (child as Mesh).receiveShadow = true;
            (child as Mesh).castShadow = true;
            ((child as Mesh).material as MeshStandardMaterial).needsUpdate = true;
        })
        this.analogueStick1 = this.analogueStick0.clone();

        this.button0 = AssetsVendor.assets.getGltfModel('button.glb').scene;
        (this.button0 as Scene).scale.set(controlsScale,controlsScale,controlsScale);
        this.button0.children.forEach((child)=>{
            (child as Mesh).material = (this.analogueStick0.children[0] as Mesh).material;
        })

        this.buttonGroup = new Object3D();
        this.buttonGroup.add(this.button0);
        this.buttonGroup.add(this.button1 = this.button0.clone());
        this.buttonGroup.add(this.button2 = this.button0.clone());
        this.buttonGroup.add(this.button3 = this.button0.clone());

        const spaceDivider = 5.5;
        this.button0.position.set(0,0, controlsScale/spaceDivider);
        this.button1.position.set(0,0,-controlsScale/spaceDivider);
        this.button2.position.set(-controlsScale/spaceDivider,0,0);
        this.button3.position.set(controlsScale/spaceDivider,0,0);

        this.analogueStick0.position.set(-(controlsScale*1.4),0,0);
        this.analogueStick1.position.set((controlsScale*1.4),0,0);
        this.buttonGroup.position.set((controlsScale*1.7),0,-(controlsScale/spaceDivider)*4.3);

        //(this.threeView.getCamera() as PerspectiveCamera)

        const directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 0.8);
        directionalLight.intensity = 1.145;
        directionalLight.shadow.bias = -0.0074;
        directionalLight.shadow.camera.near = 24;
        directionalLight.shadow.camera.far = 512;
        directionalLight.shadow.camera.top = 512;
        directionalLight.shadow.camera.bottom = -512;
        directionalLight.shadow.camera.left = -512;
        directionalLight.shadow.camera.right = 512;
        directionalLight.shadow.mapSize = new Vector2(2048, 2048);
        directionalLight.castShadow = true;
        directionalLight.position.set(0, this.analogueStick0.position.y+70, -65);
        directionalLight.lookAt(new Vector3());

        this.threeView.addObject(this.analogueStick0);
        this.threeView.addObject(this.analogueStick1);
        this.threeView.addObject(this.buttonGroup);
        this.threeView.addObject(directionalLight);

        directionalLight.shadow.camera.updateProjectionMatrix();
        this.testAnalogue();
    }

    private testAnalogue() {

    }
}

 */