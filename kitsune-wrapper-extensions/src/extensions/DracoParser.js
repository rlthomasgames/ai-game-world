"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DracoParser = exports.default = void 0;
const inversify_1 = require("inversify");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const THREE = __importStar(require("three"));
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const GLTFLoader_1 = require("three/examples/jsm/loaders/GLTFLoader");
const DRACOLoader_1 = require("three/examples/jsm/loaders/DRACOLoader");
let DracoParser = class DracoParser extends kitsune_wrapper_library_1.AbstractModule {
    constructor() {
        super(...arguments);
        this.name = 'DracoParser';
        this.loadingManager = new THREE.LoadingManager();
        this._gltfLoader = new GLTFLoader_1.GLTFLoader(this.loadingManager);
        this.container = { dracoLoader: this._gltfLoader, threeLoader: this.loadingManager };
    }
    startModule() {
        console.log('draco parser ready');
        const dracoLoader = new DRACOLoader_1.DRACOLoader(this.loadingManager);
        this._gltfLoader.manager = this.loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
    }
    /*
    parse<GLTF>(data:ArrayBuffer|string, path:string): GLTF {
        console.log('draco parser ready', data, path);
        const dracoLoader = new DRACOLoader(this.loadingManager);
        this._gltfLoader.manager = this.loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
        const promise = new Promise<GLTF>(resolve => {
            console.log("should parse");
            this._gltfLoader.parse(data, path, (gltf)=>{
                console.log("parsed", gltf);
                resolve(gltf as GLTF);
            }, (err:any)=>{
                console.log("parse error", err);
            });
        })
        return KitsuneHelper.asyncAwait(promise) as GLTF
    }
     */
    parse(url) {
        const dracoLoader = new DRACOLoader_1.DRACOLoader(this.loadingManager);
        this._gltfLoader.manager = this.loadingManager;
        this._gltfLoader.setDRACOLoader(dracoLoader);
        const promise = new Promise(resolve => {
            console.log("should parse");
            this._gltfLoader.load(url, (gltf) => {
                console.log("parsed", gltf);
                resolve(gltf);
            }, (err) => {
                console.log("parse error", err);
            });
        });
        return KitsuneHelper_1.default.asyncAwait(promise);
    }
};
exports.default = DracoParser;
exports.DracoParser = DracoParser;
exports.DracoParser = exports.default = DracoParser = __decorate([
    (0, inversify_1.injectable)()
], DracoParser);
KitsuneHelper_1.default.getKitsuneFactories().set('DracoParser', DracoParser);
