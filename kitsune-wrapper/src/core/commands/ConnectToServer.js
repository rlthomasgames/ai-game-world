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
exports.ConnectToServer = void 0;
const inversify_1 = require("inversify");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
const CoreState_1 = __importDefault(require("../constants/CoreState"));
const Flow_1 = require("./flow/Flow");
let ConnectToServer = class ConnectToServer {
    constructor() {
        this._wrapperConfig = ioc_mapping_1.default.get(kitsune_wrapper_library_1.TYPES.FetchConfig);
    }
    run() {
        Flow_1.Flow.HISTORY.push(CoreState_1.default.CONNECT_TO_SERVER);
        console.log(`||||||||||| CONNECT TO SERVER CMD |||||||||||`);
        const configObject = this._wrapperConfig.getConfig();
        console.log(`Connecting to server...${configObject} ${this._socket}`);
        this._socket.run(configObject);
    }
};
exports.ConnectToServer = ConnectToServer;
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.FetchConfig)
], ConnectToServer.prototype, "_wrapperConfig", void 0);
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.Socket)
], ConnectToServer.prototype, "_socket", void 0);
exports.ConnectToServer = ConnectToServer = __decorate([
    (0, inversify_1.injectable)()
], ConnectToServer);
