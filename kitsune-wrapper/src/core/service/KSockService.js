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
exports.KSockService = exports.default = void 0;
const inversify_1 = require("inversify");
const SockConn_1 = require("kitsune-wrapper-library/dist/base/constants/SockConn");
const socket_io_client_1 = require("socket.io-client");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const fflate = __importStar(require("fflate"));
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
const CoreState_1 = __importDefault(require("../constants/CoreState"));
let KSockService = class KSockService extends kitsune_wrapper_library_1.AbstractSockComm {
    constructor() {
        super();
        this.name = 'KSockService';
        this.totals = [];
    }
    run() {
        this.clientMap = new Map();
        sessionStorage.clear();
        const newSessionKey = crypto.randomUUID();
        sessionStorage.setItem('kitsune_session', newSessionKey);
        const cookieApplication = `kitsune=kitsuneWrapper;`;
        const cookieToSession = `session=${newSessionKey};`;
        const cookieUser = `user=genericUser;`;
        const cookieExpires = `expires=${new Date(Date.now() + 3600000)}`;
        document.cookie = `${cookieApplication} ${cookieUser} ${cookieToSession} ${cookieExpires}`;
        this.socket = (0, socket_io_client_1.io)('ws://localhost:3000', {
            autoConnect: false,
            host: 'http://localhost:3000',
            port: 3000,
            transports: ["websocket", "polling"],
            upgrade: true,
            auth: {
                token: newSessionKey
            },
        });
        this.socket.on(SockConn_1.SOCK.CONNECT, () => {
            const connectCommand = ioc_mapping_1.default.get(CoreState_1.default.CONNECTION_ESTABLISHED);
            connectCommand.run();
            this.id = this.socket.id ? this.socket.id : crypto.randomUUID();
            console.log('connect established :', this.socket, this.socket.id);
            this.clientMap.set(SockConn_1.SOCK.CONNECT, true);
            if (this.id) {
                this.clientMap.set(SockConn_1.SOCK.SOCK_ID, this.id);
            }
        });
        this.socket.on(SockConn_1.SOCK.AUTH_TOKEN, (authMsg) => {
            console.log('received  auth token', authMsg);
            const authCommand = ioc_mapping_1.default.get(CoreState_1.default.CLIENT_AUTH);
            authCommand.run();
            sessionStorage.setItem(SockConn_1.SOCK.AUTH_TOKEN, authMsg.auth_token);
            this.clientMap.set(SockConn_1.SOCK.AUTH_TOKEN, true);
            //const sentSockID = this.socket?.id !== undefined ? this.socket!.id : 'MISSING';
            //const originalPayload = {assetPackREQ: this._wrapperConfig.getConfig().assetPacks, sock: sentSockID};
            //this.sendAssetPakReq(originalPayload);
        });
        // this.socket.on(SOCK.AP_RES, (responseData: {
        //     data: ArrayBuffer,
        //     index: number,
        //     assetPackUUID: string,
        //     total: number | undefined
        // }) => {
        //     if(responseData.total != undefined ) {
        //         this.totals.push(responseData.total)
        //     }
        //     responseData.total = this.totals[this.totals.length -1];
        //     console.log(`got parsed Asset Response : `, responseData, responseData.index, responseData.total, responseData.assetPackUUID)
        //     this._assetData.storeAssetResponseFromWS(responseData, 0)
        // })
        this.socket.connect().open();
        return this;
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
                        console.warn(err, err.stack);
                        console.error(err);
                        throw new Error(`${SockConn_1.SOCK.GZIPPED_EVENT} failed : ${err}`);
                    }
                    else if (data) {
                        resolve(true);
                        this.socket.emit(SockConn_1.SOCK.GZIPPED_EVENT, data);
                    }
                });
            });
            return yield promiseSent;
        });
    }
    sendAssetPakReq(payload) {
        console.log('trying to send req', payload);
        if (this.socket && this.socket.id != undefined && this.socket.id.length > 0) {
            let val = KitsuneHelper_1.default.asyncAwait(this.sendGZipEmit(payload));
            const isTrue = (val === true) ? val : false;
            isTrue !== true ? console.log('asset pack req sent') : setTimeout(() => {
                this.sendAssetPakReq(payload);
            }, 500);
        }
        else {
            setTimeout(() => {
                this.sendAssetPakReq(payload);
            }, 500);
        }
    }
    startModule() {
        console.log('START KITSUNE SOCKET SERVICE');
    }
};
exports.default = KSockService;
exports.KSockService = KSockService;
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.FetchConfig)
], KSockService.prototype, "_wrapperConfig", void 0);
__decorate([
    (0, inversify_1.inject)(kitsune_wrapper_library_1.TYPES.AssetData)
], KSockService.prototype, "_assetData", void 0);
exports.KSockService = exports.default = KSockService = __decorate([
    (0, inversify_1.injectable)()
], KSockService);
KitsuneHelper_1.default.getKitsuneFactories().set('KSockService', KSockService);
