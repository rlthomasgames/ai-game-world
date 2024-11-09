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
exports.ClientAuthorized = void 0;
const inversify_1 = require("inversify");
const CoreState_1 = __importDefault(require("../constants/CoreState"));
const Flow_1 = require("./flow/Flow");
const ioc_mapping_1 = __importDefault(require("../ioc/ioc_mapping"));
let ClientAuthorized = class ClientAuthorized {
    run() {
        //notify
        console.log(`||||||||||| CONNECTION AUTH TOKEN |||||||||||`);
        Flow_1.Flow.HISTORY.push(CoreState_1.default.CLIENT_AUTH);
        console.log(`established, history so far : `, Flow_1.Flow.HISTORY);
        const loadAssets = ioc_mapping_1.default.get(CoreState_1.default.LOAD_ASSET_DATA);
        loadAssets.run();
    }
};
exports.ClientAuthorized = ClientAuthorized;
exports.ClientAuthorized = ClientAuthorized = __decorate([
    (0, inversify_1.injectable)()
], ClientAuthorized);
