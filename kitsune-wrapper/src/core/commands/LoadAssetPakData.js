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
exports.LoadAssetPakData = void 0;
const inversify_1 = require("inversify");
const fflate = __importStar(require("fflate"));
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
const CoreState_1 = __importDefault(require("../constants/CoreState"));
const Flow_1 = require("./flow/Flow");
let LoadAssetPakData = class LoadAssetPakData {
    constructor() {
        this._wrapperConfig = ioc_mapping_1.default.get(kitsune_wrapper_library_1.TYPES.FetchConfig);
    }
    run() {
        //TODO : move some requests from connect to server to here
        console.log(`||||||||||| MOVE LOAD ASSETS HERE |||||||||||`);
        Flow_1.Flow.HISTORY.push(CoreState_1.default.LOAD_ASSET_DATA);
        const configObject = this._wrapperConfig.getConfig();
        const originalPayload = { assetPackREQ: configObject.assetPacks };
        this.sendGZipEmit(originalPayload).then((value) => {
            console.log('on full filled:', value);
        });
    }
    sendGZipEmit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const payString = JSON.stringify(payload);
            // TODO ? possibly encrypt data here, REMINDER: but MUST-DO on server side more probable
            let promiseSent;
            promiseSent = new Promise((resolve, reject) => {
                fflate.gzip(fflate.strToU8(payString), (err, data) => {
                    //
                    if (err) {
                        resolve(false);
                        console.warn(err === null || err === void 0 ? void 0 : err.stack, err);
                        console.error(err);
                        throw new Error(`${kitsune_wrapper_library_1.SOCK.GZIPPED_EVENT} failed : ${err}`);
                    }
                    else if (data) {
                        console.log(data, payload, payString);
                        this._socket.socket.emit(kitsune_wrapper_library_1.SOCK.GZIPPED_EVENT, data);
                        resolve(true);
                    }
                });
            });
            return yield promiseSent;
        });
    }
};
exports.LoadAssetPakData = LoadAssetPakData;
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.FetchConfig)
], LoadAssetPakData.prototype, "_wrapperConfig", void 0);
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.Socket)
], LoadAssetPakData.prototype, "_socket", void 0);
exports.LoadAssetPakData = LoadAssetPakData = __decorate([
    (0, inversify_1.injectable)()
], LoadAssetPakData);
