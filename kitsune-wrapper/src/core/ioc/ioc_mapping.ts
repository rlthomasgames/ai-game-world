import "reflect-metadata";

import {Container} from "inversify";
import {TYPES} from "kitsune-wrapper-library/dist/base/constants/Base";
import CoreState from "../constants/CoreState";
import {LoadModule} from "../service/LoadModule";
import {InitWrapper} from "../commands/InitWrapper";
import {InitWrapperComplete} from "../commands/InitWrapperComplete";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import IAsyncRequest from "kitsune-wrapper-library/dist/base/interfaces/IAsyncRequest";
import {StartApplication} from "../commands/StartApplication";
import {FetchConfig} from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
import {IDataStore} from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
import AssetDataVendor from "../service/AssetDataVendor";
import KSockService from "../service/KSockService";
import {ConnectToServer} from "../commands/ConnectToServer";
import {ConnectionEstablished} from "../commands/ConnectionEstablished";
import {LoadAssetPakData} from "../commands/LoadAssetPakData";
import {ClientAuthorized} from "../commands/ClientAuthorized";

let container = new Container({ skipBaseClassChecks: true });

container.bind<ICommand>(CoreState.INIT).to(InitWrapper).inSingletonScope();
container.bind<IAsyncRequest>(TYPES.FetchConfig).to(FetchConfig).inSingletonScope();
container.bind<LoadModule>(TYPES.LoadModule).to(LoadModule).inSingletonScope();
container.bind<ICommand>(CoreState.INIT_COMPLETE).to(InitWrapperComplete).inSingletonScope();

container.bind<ICommand>(CoreState.CONNECT_TO_SERVER).to(ConnectToServer).inSingletonScope();
container.bind<ISockComm>((TYPES.Socket)).to(KSockService).inSingletonScope();
container.bind<ICommand>(CoreState.CONNECTION_ESTABLISHED).to(ConnectionEstablished).inSingletonScope();
container.bind<ICommand>(CoreState.CLIENT_AUTH).to(ClientAuthorized).inSingletonScope();

container.bind<ICommand>(CoreState.LOAD_ASSET_DATA).to(LoadAssetPakData).inSingletonScope();
container.bind<IDataStore>(TYPES.AssetData).to(AssetDataVendor).inSingletonScope();

container.bind<ICommand>(CoreState.START_APPLICATION).to(StartApplication).inSingletonScope();
export default container;