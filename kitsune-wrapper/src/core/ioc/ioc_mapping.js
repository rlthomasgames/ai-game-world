"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const Base_1 = require("kitsune-wrapper-library/dist/base/constants/Base");
const CoreState_1 = __importDefault(require("../constants/CoreState"));
const LoadModule_1 = require("../service/LoadModule");
const InitWrapper_1 = require("../commands/InitWrapper");
const InitWrapperComplete_1 = require("../commands/InitWrapperComplete");
const StartApplication_1 = require("../commands/StartApplication");
const FetchConfig_1 = require("kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig");
const AssetDataVendor_1 = __importDefault(require("../service/AssetDataVendor"));
const KSockService_1 = __importDefault(require("../service/KSockService"));
const ConnectToServer_1 = require("../commands/ConnectToServer");
const ConnectionEstablished_1 = require("../commands/ConnectionEstablished");
const LoadAssetPakData_1 = require("../commands/LoadAssetPakData");
const ClientAuthorized_1 = require("../commands/ClientAuthorized");
let container = new inversify_1.Container({ skipBaseClassChecks: true });
container.bind(CoreState_1.default.INIT).to(InitWrapper_1.InitWrapper).inSingletonScope();
container.bind(Base_1.TYPES.FetchConfig).to(FetchConfig_1.FetchConfig).inSingletonScope();
container.bind(Base_1.TYPES.LoadModule).to(LoadModule_1.LoadModule).inSingletonScope();
container.bind(CoreState_1.default.INIT_COMPLETE).to(InitWrapperComplete_1.InitWrapperComplete).inSingletonScope();
container.bind(CoreState_1.default.CONNECT_TO_SERVER).to(ConnectToServer_1.ConnectToServer).inSingletonScope();
container.bind((Base_1.TYPES.Socket)).to(KSockService_1.default).inSingletonScope();
container.bind(CoreState_1.default.CONNECTION_ESTABLISHED).to(ConnectionEstablished_1.ConnectionEstablished).inSingletonScope();
container.bind(CoreState_1.default.CLIENT_AUTH).to(ClientAuthorized_1.ClientAuthorized).inSingletonScope();
container.bind(CoreState_1.default.LOAD_ASSET_DATA).to(LoadAssetPakData_1.LoadAssetPakData).inSingletonScope();
container.bind(Base_1.TYPES.AssetData).to(AssetDataVendor_1.default).inSingletonScope();
container.bind(CoreState_1.default.START_APPLICATION).to(StartApplication_1.StartApplication).inSingletonScope();
exports.default = container;
