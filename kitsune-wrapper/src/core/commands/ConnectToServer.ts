import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import {inject, injectable} from "inversify";
import {TYPES} from "kitsune-wrapper-library";
import {FetchConfig} from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
import container from "../ioc/ioc_mapping";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
import CoreState from "../constants/CoreState";
import {Flow} from "./flow/Flow";

@injectable()
export class ConnectToServer implements ICommand {

    @inject(TYPES.FetchConfig)
    _wrapperConfig:FetchConfig = container.get(TYPES.FetchConfig);

    @inject(TYPES.Socket)
    _socket:ISockComm;

    run() {
        Flow.HISTORY.push(CoreState.CONNECT_TO_SERVER);
        console.log(`||||||||||| CONNECT TO SERVER CMD |||||||||||`);
        const configObject = this._wrapperConfig.getConfig();
        console.log(`Connecting to server...${configObject} ${this._socket}`);
        this._socket.run(configObject);
    }
}