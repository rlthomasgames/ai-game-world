import { inject, injectable } from "inversify";
import { TYPES} from "kitsune-wrapper-library";
import { LoadModule } from "../service/LoadModule";
import container from "../ioc/ioc_mapping";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import * as fflate from "fflate";
import {FetchConfig} from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
import {IDataStore} from "kitsune-wrapper-library/dist/base/interfaces/extensions/IDataStore";
import {SOCK} from "kitsune-wrapper-library/dist/base/constants/SockConn";
import {Socket} from "socket.io-client";
import ISockComm from "kitsune-wrapper-library/dist/base/interfaces/extensions/ISockComm";
import IWrapperConfig from "../interfaces/IWrapperConfig";
import CoreState from "../constants/CoreState";
import {Flow} from "./flow/Flow";

@injectable()
export class InitWrapper implements ICommand {

    @inject(TYPES.FetchConfig)
    _wrapperConfig:FetchConfig = container.get(TYPES.FetchConfig);

    @inject(TYPES.LoadModule)
    _moduleLoader:LoadModule = container.get(TYPES.LoadModule);

    @inject(TYPES.Socket)
    _socket:ISockComm;

    @inject(TYPES.AssetData)
    _assetDataVendor:IDataStore;

    private socket: Socket;

    private totalModules:number;
    private totalLoaded:number = 0;

    // TODO : !!!!!!!IMPORTANT!!!!!!!! - clean web sockets and gzip out into separate command and / or module !!!

    run() {
        Flow.HISTORY.push(CoreState.INIT);
        //console.log(KitsuneHelper.kitsuneASCII)
        console.log(`||||||||||| INIT WRAPPER CMD |||||||||||`);
        //console.table(this, Object.keys(this));
        this._wrapperConfig.request().then((value)=>{
            this._moduleLoader.loadModules(this._wrapperConfig.getConfig())
            const entries:IWrapperConfig = {
                application: undefined,
                assetPacks: "",
                restAPI: "",
                language: "",
                layout: undefined,
                modules: undefined,
                wsHost: "",
                securityToken: "",
                version: 0
            }
            console.table(this._wrapperConfig.getConfig(), Object.keys(entries))
                //${this._moduleLoader}`)
        })
    //: console.log('cant load no modules specified')
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
                    resolve(true);
                    this.socket.emit(SOCK.GZIPPED_EVENT, data);
                }
            });
        })
        return await promiseSent;
    }



    loadModules() {
        const modules : Array<ExtensionValuedObject> | undefined = (this._wrapperConfig).getConfig().modules;
        if(!modules) {
            return;
        }
        this.totalModules = modules.length;
        if (this.totalModules === 0) {
            this.completeInit();
            return;
        }
        modules.forEach((module) => {
            this._moduleLoader.request(module, true)?.then((moduleInstance: IInjectableExtensionModule) => {
                this.totalLoaded++;
                if (this.totalLoaded === this.totalModules) {
                    this.completeInit();
                    return;
                }
            });
        })
    }

    completeInit() {

    }
}

export type ExtensionValuedObject = {
    moduleName: string;
    modulePath: string;
    gzipped?: boolean | undefined;
}
