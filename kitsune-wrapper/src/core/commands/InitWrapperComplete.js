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
exports.InitWrapperComplete = void 0;
const inversify_1 = require("inversify");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
const CoreState_1 = __importDefault(require("../constants/CoreState"));
const Flow_1 = require("./flow/Flow");
let InitWrapperComplete = class InitWrapperComplete {
    run() {
        console.log('should request asset paks and load application');
        const application = this._wrapperConfig.getConfig().application;
        if (application != undefined) {
            this.loadApplication(application);
        }
    }
    loadApplication(applicationValuedObject) {
        console.log(`||||||||||| INIT WRAPPER COMPLETE CMD |||||||||||`);
        Flow_1.Flow.HISTORY.push(CoreState_1.default.INIT_COMPLETE);
        // @ts-ignore
        this._moduleLoader.request(applicationValuedObject, false).then((returnedApplicationInstance) => {
            //container.get(CoreState.START_APPLICATION);
            console.log("CONNECTING TO SERVER...");
            //container.get(CoreState.INIT_COMPLETE);
            /*
            const originalPayload = { assetPackREQ: this._wrapperConfig.getConfig().assetPacks };
            this.sendGZipEmit(originalPayload).then((value)=>{
                console.log('on full filled =', value);
            });

             */
            const connectCommand = ioc_mapping_1.default.get(CoreState_1.default.CONNECT_TO_SERVER);
            connectCommand.run();
        });
    }
};
exports.InitWrapperComplete = InitWrapperComplete;
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.FetchConfig)
], InitWrapperComplete.prototype, "_wrapperConfig", void 0);
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.inject)('HelloWorldExtension')
], InitWrapperComplete.prototype, "_helloWorld", void 0);
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.LoadModule)
], InitWrapperComplete.prototype, "_moduleLoader", void 0);
__decorate([
    (0, inversify_1.postConstruct)()
], InitWrapperComplete.prototype, "run", null);
exports.InitWrapperComplete = InitWrapperComplete = __decorate([
    (0, inversify_1.injectable)()
], InitWrapperComplete);
