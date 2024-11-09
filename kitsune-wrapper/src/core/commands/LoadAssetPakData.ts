import {inject, injectable} from "inversify";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import * as fflate from "fflate";
import {SOCK, TYPES} from "kitsune-wrapper-library";
import {FetchConfig} from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
import container from "../ioc/ioc_mapping";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
import CoreState from "../constants/CoreState";
import {Flow} from "./flow/Flow";


@injectable()
export class LoadAssetPakData implements ICommand {

    @inject(TYPES.FetchConfig)
    _wrapperConfig:FetchConfig = container.get(TYPES.FetchConfig);

    @inject(TYPES.Socket)
    _socket:ISockComm;
    run(): void {
        //TODO : move some requests from connect to server to here
        console.log(`||||||||||| MOVE LOAD ASSETS HERE |||||||||||`);
        Flow.HISTORY.push(CoreState.LOAD_ASSET_DATA);
        const configObject = this._wrapperConfig.getConfig();
        const originalPayload = { assetPackREQ: configObject.assetPacks };
        this.sendGZipEmit(originalPayload).then((value)=>{
            console.log('on full filled:', value);
        });
    }

    async sendGZipEmit( payload: Object): Promise<boolean> {
        const payString = JSON.stringify(payload);
        // TODO ? possibly encrypt data here, REMINDER: but MUST-DO on server side more probable
        let promiseSent: void | Promise<boolean>;
        promiseSent = new Promise((resolve, reject)=>{
            fflate.gzip(fflate.strToU8(payString), (err, data) => {
                //
                if (err) {
                    resolve(false);
                    console.warn(err?.stack, err);
                    console.error(err);
                    throw new Error(`${SOCK.GZIPPED_EVENT} failed : ${err}`);
                } else if( data) {
                    console.log(data, payload, payString);
                    this._socket.socket.emit(SOCK.GZIPPED_EVENT, data);
                    resolve(true);
                }
            });
        })
        return await promiseSent;
    }

}