import {inject, injectable, optional, postConstruct} from "inversify";
import { TYPES } from "kitsune-wrapper-library";
import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import {LoadModule} from "../service/LoadModule";
import container from "../ioc/ioc_mapping";
import CoreState from "../constants/CoreState";
import {ExtensionValuedObject} from "./InitWrapper";
import {FetchConfig} from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
import {Flow} from "./flow/Flow";

@injectable()
export class InitWrapperComplete implements ICommand {

    @inject(TYPES.FetchConfig)
    _wrapperConfig: FetchConfig;

    @optional()
    @inject('HelloWorldExtension')
    _helloWorld?: IInjectableExtensionModule;

    @inject(TYPES.LoadModule)
    _moduleLoader: LoadModule;

    @postConstruct()
    run() {
        console.log('should request asset paks and load application')

        const application = this._wrapperConfig.getConfig().application as ExtensionValuedObject;
        if(application != undefined) {
            this.loadApplication(application);
        }
    }

    loadApplication(applicationValuedObject:ExtensionValuedObject) {
        console.log(`||||||||||| INIT WRAPPER COMPLETE CMD |||||||||||`);
        Flow.HISTORY.push(CoreState.INIT_COMPLETE);
        // @ts-ignore
        this._moduleLoader.request(applicationValuedObject!, false).then((returnedApplicationInstance)=>{
            //container.get(CoreState.START_APPLICATION);
            console.log("CONNECTING TO SERVER...");
            //container.get(CoreState.INIT_COMPLETE);
            /*
            const originalPayload = { assetPackREQ: this._wrapperConfig.getConfig().assetPacks };
            this.sendGZipEmit(originalPayload).then((value)=>{
                console.log('on full filled =', value);
            });

             */
            const connectCommand = container.get<ICommand>(CoreState.CONNECT_TO_SERVER);
            connectCommand.run();
        })
    }
}
