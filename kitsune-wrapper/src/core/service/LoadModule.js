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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadModule = void 0;
const inversify_1 = require("inversify");
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
const fflate = __importStar(require("fflate"));
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const CoreState_1 = __importDefault(require("../constants/CoreState"));
//import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
let LoadModule = class LoadModule {
    constructor() {
        this.totalLoaded = 0;
        KitsuneHelper_1.default.asyncAwait(window.caches.keys().then((resolution) => {
            this.cacheKeys = resolution;
        }, () => {
            this.cacheKeys = [];
        }));
        //KitsuneHelper.asyncAwait(this._wrapperConfig.request());
    }
    loadModules(wrapperConfig) {
        this._config = wrapperConfig;
        console.log('wrapper may not be needed here', this._config);
        const modules = wrapperConfig.modules;
        if (!modules) {
            return;
        }
        this.totalModules = modules.length;
        if (this.totalModules === 0) {
            this.completeInit();
            return;
        }
        modules.forEach((module) => {
            var _a;
            (_a = this.request(module, true)) === null || _a === void 0 ? void 0 : _a.then((moduleInstance) => {
                this.totalLoaded++;
                if (this.totalLoaded === this.totalModules) {
                    this.completeInit();
                    return;
                }
            });
        });
    }
    request(moduleVO, gzipped) {
        //!!this.cacheKeys ?? KitsuneHelper.getInstance().debugObject(this, Object(this).values)
        const cachedIndex = this.cacheKeys.indexOf(moduleVO.moduleName);
        console.log('loading module...', moduleVO.moduleName, moduleVO, cachedIndex);
        const essentialLoadingParams = {
            modulePath: moduleVO.modulePath,
            moduleName: moduleVO.moduleName,
            location: document.head,
            gzipped: (moduleVO.gzipped == true)
        };
        if (cachedIndex == -1) {
            return this.loadJS(essentialLoadingParams);
        }
        else {
            return this.loadFromCache(essentialLoadingParams);
        }
    }
    completeInit() {
        //this._socket.run();
        //console.log('sockets ready', this._socket, this._socket.id)
        ioc_mapping_1.default.get(CoreState_1.default.INIT_COMPLETE);
    }
    loadJS(parameters) {
        return new Promise((resolved, rejected) => {
            const append = parameters.gzipped ? `.gz` : undefined;
            let finalPath = `${parameters['modulePath']}`;
            finalPath = !append ? finalPath : finalPath.concat(append);
            console.log("problem", finalPath);
            fetch(`${finalPath}`, { cache: "force-cache" })
                .then((response) => {
                if (response.status === 200 || response.status === 0) {
                    return Promise.resolve(response.blob());
                }
                else {
                    return Promise.reject(new Error(response.statusText));
                }
            }).then((blob) => {
                blob.arrayBuffer().then((arrayBuffer) => {
                    let uint8Array = new Uint8Array(arrayBuffer);
                    if (parameters.gzipped) {
                        uint8Array = fflate.decompressSync(uint8Array);
                    }
                    const origText = fflate.strFromU8(uint8Array);
                    const scriptTag = document.createElement('script');
                    scriptTag.type = 'text/javascript';
                    scriptTag.text = `${origText}`;
                    parameters.location.appendChild(scriptTag);
                    const extension = KitsuneHelper_1.default.getKitsuneFactories().get(parameters.moduleName);
                    ioc_mapping_1.default.bind(parameters.moduleName).to(extension);
                    const instance = ioc_mapping_1.default.get(parameters.moduleName);
                    this.storeInCache(parameters.moduleName, origText).then(() => {
                        console.info('stored in cache', parameters.moduleName);
                    });
                    resolved(instance);
                });
            });
        });
    }
    storeInCache(extensionName, extensionContent) {
        return __awaiter(this, void 0, void 0, function* () {
            window.caches.open(extensionName).then((cache) => {
                const cacheStoreResponse = new Response(extensionContent);
                cache.put(extensionName, cacheStoreResponse).then((value) => {
                    console.log(`putting in cache... ${extensionName} - ${cacheStoreResponse}`);
                }).then(() => {
                    console.log(`completed cache storage of... ${extensionName} - ${cacheStoreResponse}`);
                });
            });
        });
    }
    loadFromCache(parameters) {
        return new Promise((resolved, rejected) => {
            window.caches.open(parameters.moduleName).then(value => {
                caches.open(parameters.moduleName).then((returnedStorage) => {
                    returnedStorage.match(parameters.moduleName).then(contentValue => {
                        if (contentValue instanceof Response) {
                            contentValue.text().then(contentText => {
                                const blobURL = URL.createObjectURL(new Blob([contentText], { type: 'text/javascript' }));
                                const scriptTag = document.createElement('script');
                                scriptTag.type = 'text/javascript';
                                scriptTag.src = blobURL;
                                scriptTag.setAttribute('priority', 'highest');
                                scriptTag.onload = () => {
                                    const extension = KitsuneHelper_1.default.getKitsuneFactories().get(parameters.moduleName);
                                    ioc_mapping_1.default.bind(parameters.moduleName).to(extension);
                                    const instance = ioc_mapping_1.default.get(parameters.moduleName);
                                    resolved(instance);
                                    URL.revokeObjectURL(blobURL);
                                };
                                scriptTag.onerror = (error) => {
                                    rejected(error);
                                };
                                parameters.location.appendChild(scriptTag);
                            });
                        }
                    });
                });
            });
        });
    }
};
exports.LoadModule = LoadModule;
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.Socket)
], LoadModule.prototype, "_socket", void 0);
exports.LoadModule = LoadModule = __decorate([
    (0, inversify_1.injectable)()
], LoadModule);
