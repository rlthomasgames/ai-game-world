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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchConfig = void 0;
const inversify_1 = require("inversify");
const _ = __importStar(require("lodash"));
let FetchConfig = class FetchConfig {
    constructor() {
        this.baseConfig = null;
        this.urlParams = null;
        this.finalConfig = null;
        this.name = 'FetchConfig';
        this.getConfig = () => this.finalConfig;
        this.getUrlParams = () => new URLSearchParams(window.location.search);
    }
    request() {
        const params = {};
        this.getUrlParams().forEach((value, key, parent) => {
            Object.defineProperty(params, key, { value: value });
        });
        this.urlParams = params;
        this.baseConfig = Object.assign({}, baseConfig);
        const resp = fetch('./config/wrapper.json').then((value) => {
            if (value.body !== null) {
                console.log(JSON.parse(JSON.stringify(value)));
                const dataReturned = value.json();
                return dataReturned.then((data) => {
                    return Promise.resolve(this.configLoaded(data));
                });
            }
            else {
                return Promise.resolve(false);
            }
        });
        return resp;
    }
    configLoaded(fetchedConfig) {
        const merge0 = _.merge(this.urlParams, this.baseConfig);
        this.finalConfig = Object.assign({}, fetchedConfig, merge0);
        this.finalConfig = _.merge(this.finalConfig, fetchedConfig);
        return true;
    }
};
exports.FetchConfig = FetchConfig;
exports.FetchConfig = FetchConfig = __decorate([
    (0, inversify_1.injectable)()
], FetchConfig);
const baseConfig = {
    assetPacks: "",
    version: 0,
    securityToken: "none",
    language: "en-UK",
    gameConfig: "localhost:3000/config/lobby.json",
    platformAddress: "localhost:9029/socket",
    layout: {
        name: "layout0"
    }
};
