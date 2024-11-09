import {
    AmbientLight,
    Material, Mesh, MeshPhongMaterial,
    Object3D,
    PerspectiveCamera, Raycaster,
    Scene,
    Vector2,
    WebGLRenderer
} from 'three'
import {TileMeshElement} from "./elements/TileMeshElement";
import GlobalValues from "./Utils/GlobalValues";

export default class ThreeGameView {

    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _renderer: WebGLRenderer;
    private _mouse: Vector2 = new Vector2();
    public _intersected: Mesh;
    public _selectedTile: TileMeshElement;
    private _lastMaterial: Material | Material[];
    private _highlightedMaterial: MeshPhongMaterial = new MeshPhongMaterial({color: 0x00ff00});
    private _selectedMaterial: MeshPhongMaterial = new MeshPhongMaterial({color: 0x7e7e00});
    private _raycaster: Raycaster = new Raycaster();
    public _selectedTileMesh: Mesh;

    constructor(scene: Scene, renderer: WebGLRenderer, camera: PerspectiveCamera) {
        this._scene = scene;
        this._renderer = renderer;
        this._camera = camera;
        this.initView();
        this.initLights();
        this.initListeners();
        this.resizeWindow(null);
    }

    private initView(): void {
    }

    private initLights(): void {
        // add lights
        let light = new AmbientLight(0xffffff, 0.8);
        this._scene.add(light);
    }

    private initListeners(): void {
        window.addEventListener("resize", (event: Event) => {
            this.resizeWindow(event)
        });

        window.addEventListener("orientationchange", () => {
            this.resizeWindow(null);
        });

        document.addEventListener('mousemove', (event) => {
            this.onDocumentMouseMove(event)
        }, false);
    }

    private onDocumentMouseMove(event:MouseEvent) {
        event.preventDefault();

        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    private resizeWindow(event: Event | null): void {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        if (window.innerWidth > window.innerHeight) {
            this._camera.zoom = this._camera.aspect * 0.75;
        } else {
            this._camera.zoom = this._camera.aspect * 1.3;
        }
        this._camera.updateProjectionMatrix();
    }

    public addObject(object: Object3D): void {
        this._scene.add(object);
    }

    public removeObject(object: Object3D): Object3D {
        this._scene.remove(object);
        return object;
    }

    public update(): void {
        this._camera.updateMatrixWorld();
        if (this._scene.getObjectByName('world')) {
            this._raycaster.setFromCamera(this._mouse, this._camera);
            const intersectsChildren: Object3D[] = (this._scene.getObjectByName('world') as Object3D).children;
            let intersects = this._raycaster.intersectObjects(intersectsChildren);
            if (intersects.length > 0) {
                if (this._intersected != intersects[0].object) {
                    if (GlobalValues.gmModeGLOBAL) {
                        if (this._lastMaterial) {
                            this._intersected.material = this._lastMaterial;
                        }
                        this._intersected = intersects[0].object as Mesh;
                        this._lastMaterial = this._intersected.material;
                        (this._intersected as Mesh).material = this._highlightedMaterial;
                        if(this._selectedTileMesh) {
                            this._selectedTileMesh.material = this._selectedMaterial;
                        }
                    }
                }
            }
        }
        this._renderer.render(this._scene, this._camera);
    }

    public getCamera(): PerspectiveCamera {
        return this._camera;
    }

    public getSelectedObject(): TileMeshElement {
        return this._selectedTile;
    }

    public getRenderer(): WebGLRenderer {
        return this._renderer;
    }
}