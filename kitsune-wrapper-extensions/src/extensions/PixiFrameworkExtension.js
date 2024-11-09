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
exports.PixiFrameworkExtension = exports.default = void 0;
const inversify_1 = require("inversify");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const pixi_js_1 = require("pixi.js");
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
let PixiFrameworkExtension = class PixiFrameworkExtension extends kitsune_wrapper_library_1.AbstractModule {
    constructor() {
        super(...arguments);
        this.name = 'PixiFrameworkExtension';
    }
    startModule() {
        const pixiApplication = new pixi_js_1.Application();
        this.container = pixiApplication;
    }
};
exports.default = PixiFrameworkExtension;
exports.PixiFrameworkExtension = PixiFrameworkExtension;
exports.PixiFrameworkExtension = exports.default = PixiFrameworkExtension = __decorate([
    (0, inversify_1.injectable)()
], PixiFrameworkExtension);
KitsuneHelper_1.default.getKitsuneFactories().set('PixiFrameworkExtension', PixiFrameworkExtension);
