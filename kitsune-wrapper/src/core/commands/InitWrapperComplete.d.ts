import IInjectableExtensionModule from "kitsune-wrapper-library/dist/base/interfaces/IInjectableExtensionModule";
import ICommand from "kitsune-wrapper-library/dist/base/interfaces/ICommand";
import { LoadModule } from "../service/LoadModule";
import { ExtensionValuedObject } from "./InitWrapper";
import { FetchConfig } from "kitsune-wrapper-library/dist/base/interfaces/extensions/FetchConfig";
export declare class InitWrapperComplete implements ICommand {
    _wrapperConfig: FetchConfig;
    _helloWorld?: IInjectableExtensionModule;
    _moduleLoader: LoadModule;
    run(): void;
    loadApplication(applicationValuedObject: ExtensionValuedObject): void;
}
