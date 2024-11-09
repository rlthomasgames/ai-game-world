"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.application = void 0;
const inversify_1 = require("inversify");
const BaseApplication_1 = __importDefault(require("kitsune-wrapper-library/dist/base/application/BaseApplication"));
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
let application = class application extends BaseApplication_1.default {
    constructor() {
        super();
        this.name = 'application';
    }
    startModule() {
        console.log(`startModule executed in application krash test dummy \n pixi test : ${this._pixi} \n three test : ${this._three}`);
        if (this._pixi && this._three) {
            this._pixi.startModule();
            this._three.startModule();
            this._dParser.startModule();
            console.log('hello from pixi?', this._pixi.container, this._pixi);
            console.log('hello from three?', this._three.container, this._three);
            document.getElementById('content').appendChild(this._pixi.container.view);
            document.getElementById('content').appendChild(this._three.container.canvas);
            const labU8A = this._assetData.dataStore[this._wrapperConfig.getConfig().assetPacks[0]]['base-all-anims_mixamo_animations_importer_script.glb'];
            const blob = new Blob([labU8A], { type: 'model/gltf-binary' });
            console.log('the blob = ', blob);
            const url = URL.createObjectURL(blob);
            console.log('the url = ', url);
            const gltf = this._dParser.parse(url);
            console.log("parsed data using draco ", gltf);
            console.log("parsed data using draco ", gltf);
            gltf.then((scene3d) => {
                //const renderer = (this._three.container! as ThreeContainer).renderer;
                //create a camera and add to gltf scene, or have a scene with a camera and add the gltf
                //renderer.render() // <--- using camera / scene
            });
        }
    }
};
exports.application = application;
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.FetchConfig)
], application.prototype, "_wrapperConfig", void 0);
__decorate([
    (0, inversify_1.inject)('PixiFrameworkExtension')
], application.prototype, "_pixi", void 0);
__decorate([
    (0, inversify_1.inject)('ThreeFrameworkExtension')
], application.prototype, "_three", void 0);
__decorate([
    (0, inversify_1.inject)('DracoParser')
], application.prototype, "_dParser", void 0);
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.AssetData)
], application.prototype, "_assetData", void 0);
exports.application = application = __decorate([
    (0, inversify_1.injectable)()
], application);
KitsuneHelper_1.default.getKitsuneFactories().set('application', application);
