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
exports.StartApplication = void 0;
const inversify_1 = require("inversify");
const CoreState_1 = __importDefault(require("../constants/CoreState"));
const Flow_1 = require("./flow/Flow");
let StartApplication = class StartApplication {
    postConstruct() {
        this.run();
    }
    run() {
        var _a;
        console.log(`||||||||||| START APPLICATION CMD |||||||||||`);
        Flow_1.Flow.HISTORY.push(CoreState_1.default.START_APPLICATION);
        if (this._application) {
            (_a = this._application) === null || _a === void 0 ? void 0 : _a.startModule();
        }
        else {
            console.warn(`StartApplication command ran but no application instance found : ${this._application}`);
        }
    }
};
exports.StartApplication = StartApplication;
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.inject)('application')
], StartApplication.prototype, "_application", void 0);
__decorate([
    (0, inversify_1.postConstruct)()
], StartApplication.prototype, "postConstruct", null);
exports.StartApplication = StartApplication = __decorate([
    (0, inversify_1.injectable)()
], StartApplication);
