import {AbstractModule} from "./AbstractModule";
import ISockComm from "../interfaces/extensions/ISockComm";
export class AbstractSockComm extends AbstractModule implements ISockComm {
    _wrapperConfig:any;
    _assetData:any;

    clientMap: Map<string, any | string | boolean | number | null> = new Map();
    socket: any;
    id: string = '';
    totals: Array<number> = [];

    run(_wrapperConfig:any): ISockComm {
        console.warn(
            'Abstract Socket Comm run() was triggered  \n' +
            'Override this function in your own Socket \n' +
            'Extension, or use the KSockService extension\n')

        return this;
    };
}