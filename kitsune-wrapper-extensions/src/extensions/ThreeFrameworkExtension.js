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
exports.ThreeFrameworkExtension = exports.default = void 0;
const inversify_1 = require("inversify");
const kitsune_wrapper_library_1 = require("kitsune-wrapper-library");
const three_1 = require("three");
const KitsuneHelper_1 = __importDefault(require("kitsune-wrapper-library/dist/base/helper/KitsuneHelper"));
let ThreeFrameworkExtension = class ThreeFrameworkExtension extends kitsune_wrapper_library_1.AbstractModule {
    constructor() {
        super(...arguments);
        this.name = 'ThreeFrameworkExtension';
    }
    startModule() {
        const canvas = document.createElement('canvas');
        const webGLRenderer = new three_1.WebGLRenderer({ canvas: canvas });
        this.container = { canvas: canvas, renderer: webGLRenderer };
        document.getElementById('content').appendChild(this.container.canvas);
    }
};
exports.default = ThreeFrameworkExtension;
exports.ThreeFrameworkExtension = ThreeFrameworkExtension;
exports.ThreeFrameworkExtension = exports.default = ThreeFrameworkExtension = __decorate([
    (0, inversify_1.injectable)()
], ThreeFrameworkExtension);
KitsuneHelper_1.default.getKitsuneFactories().set('ThreeFrameworkExtension', ThreeFrameworkExtension);
